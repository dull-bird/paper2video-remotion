#!/usr/bin/env python3
"""
Generate a Bilibili-compatible SRT subtitle file from the slide narrations
and the rendered voiceover audio durations.

Usage:
    python3 scripts/generate-subtitles.py --deck=<slug>
"""
import argparse
import re
import subprocess
from pathlib import Path


def parse_slides(ts_source: str):
    """Extract slide id and narration from the TypeScript content file."""
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
    parser = argparse.ArgumentParser(description="Generate Bilibili SRT subtitles for a deck.")
    parser.add_argument(
        "--deck",
        default="scaling-laws-carefully",
        help="Deck slug (matches src/content/<slug>.ts and public/voiceover/<slug>/).",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    content_file = project_root / "src" / "content" / f"{args.deck}.ts"
    voiceover_dir = project_root / "public" / "voiceover" / args.deck
    output_srt = project_root / "out" / f"{args.deck}.srt"

    ts_source = content_file.read_text(encoding="utf-8")
    slides = parse_slides(ts_source)
    if not slides:
        raise RuntimeError(f"No slides found in {content_file}")

    durations = []
    for slide in slides:
        audio_path = voiceover_dir / f"{slide['id']}.mp3"
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

    output_srt.parent.mkdir(parents=True, exist_ok=True)
    output_srt.write_text("\n".join(srt_entries).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {index - 1} subtitle entries to {output_srt}")


if __name__ == "__main__":
    main()
