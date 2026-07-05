#!/usr/bin/env python3
"""
Generate a Bilibili-compatible SRT subtitle file from the slide narrations
and the rendered voiceover audio durations.
"""
import json
import os
import re
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENT_FILE = PROJECT_ROOT / "src" / "content" / "scaling-laws-carefully.ts"
VOICEOVER_DIR = PROJECT_ROOT / "public" / "voiceover" / "scaling-laws-carefully"
OUTPUT_SRT = PROJECT_ROOT / "out" / "scaling-laws-carefully.srt"


def parse_slides(ts_source: str):
    """Extract slide id and narration from the TypeScript content file."""
    # Match each slide object roughly, then pull id and narration.
    slide_blocks = re.findall(
        r"\{\s*id:\s*\"([^\"]+)\".*?narration:\s*\"((?:\\.|[^\"\\])*)\".*?\},?",
        ts_source,
        re.DOTALL,
    )
    slides = []
    for sid, narration in slide_blocks:
        narration = re.sub(r"\s+", " ", narration.replace("\\n", " ").strip())
        slides.append({"id": sid, "narration": narration})
    return slides


def audio_duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


def split_narration(text: str):
    """Split narration into subtitle chunks by sentence-ending punctuation."""
    # Split on 。 ； ！ ？ but keep the punctuation.
    parts = re.split(r"([。；！？])", text)
    chunks = []
    current = ""
    for part in parts:
        current += part
        if part and part in "。；！？":
            stripped = current.strip()
            if stripped:
                chunks.append(stripped)
            current = ""
    if current.strip():
        chunks.append(current.strip())
    return chunks


def format_srt_time(seconds: float) -> str:
    """Format seconds as SRT time HH:MM:SS,mmm."""
    ms = int(round(seconds * 1000))
    hours, rem = divmod(ms, 3600000)
    minutes, rem = divmod(rem, 60000)
    sec, ms = divmod(rem, 1000)
    return f"{hours:02d}:{minutes:02d}:{sec:02d},{ms:03d}"


def main():
    ts_source = CONTENT_FILE.read_text(encoding="utf-8")
    slides = parse_slides(ts_source)
    if not slides:
        raise RuntimeError("No slides found in content file")

    durations = []
    for slide in slides:
        audio_path = VOICEOVER_DIR / f"{slide['id']}.mp3"
        if not audio_path.exists():
            raise FileNotFoundError(f"Missing voiceover: {audio_path}")
        durations.append(audio_duration(audio_path))

    srt_entries = []
    index = 1
    cursor = 0.0

    for slide, dur in zip(slides, durations):
        chunks = split_narration(slide["narration"])
        if not chunks:
            cursor += dur
            continue

        total_chars = sum(len(c) for c in chunks)
        start = cursor
        for chunk in chunks:
            chunk_dur = dur * (len(chunk) / total_chars) if total_chars > 0 else dur
            end = start + chunk_dur
            srt_entries.append(
                f"{index}\n"
                f"{format_srt_time(start)} --> {format_srt_time(end)}\n"
                f"{chunk}\n"
            )
            index += 1
            start = end
        cursor += dur

    OUTPUT_SRT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_SRT.write_text("\n".join(srt_entries).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {index - 1} subtitle entries to {OUTPUT_SRT}")


if __name__ == "__main__":
    main()
