import { ALL_FORMATS, Input, UrlSource } from "mediabunny";

export const getAudioDuration = async (src: string): Promise<number> => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, { getRetryDelay: () => null }),
  });

  return input.computeDuration();
};

// 中文语音大约每秒 4.5~5 个字，TTS 音频还没生成时用旁白字数估算时长，
// 保证 Studio 预览随时可用；音频就绪后 calculateMetadata 会换成真实时长。
export const estimateDurationFromNarration = (narration: string): number => {
  const chars = narration.replace(/\s/g, "").length;
  return chars / 4.6 + 1.2;
};
