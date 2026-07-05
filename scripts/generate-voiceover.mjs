#!/usr/bin/env node
// 生成 Scaling Laws, Honestly 的中文旁白音频。
//
// 优先使用阿里云智能语音交互（ISI）Stanley 音色：
//   - ISI 与 DashScope/百炼是两个不同产品，鉴权走 AccessKey 签名 + Token，
//     不是 DASHSCOPE_API_KEY。需要三个环境变量：
//       ALIBABA_CLOUD_ACCESS_KEY_ID
//       ALIBABA_CLOUD_ACCESS_KEY_SECRET
//       NLS_APPKEY   （NLS 控制台创建的项目 Appkey，不是 AccessKey）
//   - 参考：https://help.aliyun.com/zh/isi/developer-reference/overview-of-speech-synthesis
//
// 缺少上述任意变量时，自动回退到 macOS 本地 `say`（婷婷 Tingting）合成，
// 保证 Remotion 预览流程随时可跑通；配置好阿里云凭证后重新运行即可换成 Stanley。

import { createHmac, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const deckArg = process.argv.find((a) => a.startsWith("--deck="));
const DECK = deckArg ? deckArg.split("=")[1] : "scaling-laws";
const CONTENT_PATH = path.join(ROOT, "src", "content", `${DECK}.ts`);
const OUT_DIR = path.join(ROOT, "public", "voiceover", DECK);

const NLS_REGION = process.env.NLS_REGION || "cn-shanghai";
const NLS_VOICE = process.env.NLS_VOICE || "stanley";
const AK_ID = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
const AK_SECRET = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
const APPKEY = process.env.NLS_APPKEY;

const hasAliyunCreds = Boolean(AK_ID && AK_SECRET && APPKEY);

function specialUrlEncode(str) {
  return encodeURIComponent(str)
    .replace(/\+/g, "%20")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");
}

// 阿里云 RPC API 签名机制 1.0（HMAC-SHA1）
// https://help.aliyun.com/zh/sdk/product-overview/rpc-mechanism
function signRpcRequest(params, accessKeySecret) {
  const sorted = Object.keys(params).sort();
  const canonicalized = sorted
    .map((k) => `${specialUrlEncode(k)}=${specialUrlEncode(params[k])}`)
    .join("&");
  const stringToSign = `GET&${specialUrlEncode("/")}&${specialUrlEncode(canonicalized)}`;
  const signature = createHmac("sha1", `${accessKeySecret}&`)
    .update(stringToSign)
    .digest("base64");
  return signature;
}

async function fetchNlsToken() {
  const params = {
    AccessKeyId: AK_ID,
    Action: "CreateToken",
    Version: "2019-02-28",
    Format: "JSON",
    RegionId: NLS_REGION,
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    SignatureMethod: "HMAC-SHA1",
    SignatureVersion: "1.0",
    SignatureNonce: randomUUID(),
  };
  const signature = signRpcRequest(params, AK_SECRET);
  const query = new URLSearchParams({ ...params, Signature: signature }).toString();
  const url = `https://nls-meta.${NLS_REGION}.aliyuncs.com/?${query}`;

  const res = await fetch(url);
  const json = await res.json();
  if (!json.Token?.Id) {
    throw new Error(`获取 NLS Token 失败: ${JSON.stringify(json)}`);
  }
  return json.Token.Id;
}

async function synthesizeWithStanley(text, token) {
  const url = `https://nls-gateway-${NLS_REGION}.aliyuncs.com/stream/v1/tts`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appkey: APPKEY,
      token,
      text,
      voice: NLS_VOICE,
      format: "mp3",
      sample_rate: 16000,
      volume: 55,
      speech_rate: 0,
      pitch_rate: 0,
    }),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("application/json")) {
    const body = await res.text();
    throw new Error(`Stanley 合成失败 (${res.status}): ${body}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function synthesizeWithSay(text, outPath) {
  const aiff = outPath.replace(/\.mp3$/, ".aiff");
  await execFileAsync("say", ["-v", "Tingting", "-o", aiff, text]);
  await execFileAsync("ffmpeg", ["-y", "-i", aiff, "-codec:a", "libmp3lame", "-qscale:a", "4", outPath]);
  await rm(aiff, { force: true });
}

async function main() {
  if (!existsSync(CONTENT_PATH)) {
    throw new Error(`找不到 ${path.relative(ROOT, CONTENT_PATH)}，检查 --deck= 参数是否对应 src/content/ 下的文件名`);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const { slides } = await import(pathToFileURL(CONTENT_PATH).href);
  console.log(`deck: ${DECK}（${slides.length} 页）`);

  if (hasAliyunCreds) {
    console.log(`使用阿里云 ISI Stanley 音色（区域 ${NLS_REGION}）生成旁白...`);
    const token = await fetchNlsToken();
    for (const slide of slides) {
      const outPath = path.join(OUT_DIR, `${slide.id}.mp3`);
      const buf = await synthesizeWithStanley(slide.narration, token);
      await writeFile(outPath, buf);
      console.log(`  ✓ ${slide.id} (${buf.length} bytes)`);
    }
  } else {
    console.log(
      "未检测到阿里云凭证 (ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET / NLS_APPKEY)，" +
        "回退到本地 macOS `say`（婷婷）生成占位音频。配置好凭证后重新运行本脚本即可换成 Stanley。",
    );
    for (const slide of slides) {
      const outPath = path.join(OUT_DIR, `${slide.id}.mp3`);
      await synthesizeWithSay(slide.narration, outPath);
      console.log(`  ✓ ${slide.id} (say/Tingting fallback)`);
    }
  }

  console.log(`完成，音频已写入 ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
