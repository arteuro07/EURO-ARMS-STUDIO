import json
import subprocess
import wave
from pathlib import Path

ROOT = Path(".")
EPISODE = ROOT / "episodes/001-desert-eagle/episode.json"
MODEL_DIR = ROOT / ".voice-cache"
OUT = ROOT / "dist/episode-001"
OUT.mkdir(parents=True, exist_ok=True)

episode = json.loads(EPISODE.read_text(encoding="utf-8"))
voice = episode["voiceProfile"]
if voice != "euro-documentary-fr-01":
    raise SystemExit(f"Profil vocal inattendu : {voice}")

segments = episode.get("segments", [])
if not segments:
    raise SystemExit("L'épisode ne contient aucun segment.")

wav_parts = []
for index, segment in enumerate(segments, start=1):
    text = segment["text"].strip()
    if not text:
        raise SystemExit(f"Texte vide pour {segment.get('id', index)}")

    output = OUT / f"{index:02d}-{segment['id']}.wav"
    command = [
        "python", "-m", "piper",
        "-m", "fr_FR-mls-medium",
        "--data-dir", str(MODEL_DIR),
        "--speaker", "0",
        "-f", str(output),
        "--", text
    ]
    print(f"Voix {index}/{len(segments)} : {segment['id']}")
    subprocess.run(command, check=True)
    if not output.exists() or output.stat().st_size < 1000:
        raise SystemExit(f"Fichier audio absent ou trop petit : {output}")
    wav_parts.append((segment, output))

# Concaténation PCM sans réencodage : les timecodes viennent des WAV réels.
timeline = []
cursor = 0.0
silence_seconds = 0.12
combined_path = OUT / "narration-complete.wav"

with wave.open(str(wav_parts[0][1]), "rb") as first:
    params = first.getparams()
    if params.sampwidth != 2:
        raise SystemExit(f"Format PCM 16 bits attendu, reçu : {params.sampwidth * 8} bits")
    sample_rate = params.framerate
    channels = params.nchannels

with wave.open(str(combined_path), "wb") as combined:
    combined.setnchannels(channels)
    combined.setsampwidth(2)
    combined.setframerate(sample_rate)

    for index, (segment, path) in enumerate(wav_parts):
        with wave.open(str(path), "rb") as source:
            if (source.getframerate(), source.getnchannels(), source.getsampwidth()) != (sample_rate, channels, 2):
                raise SystemExit(f"Paramètres audio incohérents : {path}")
            frames = source.readframes(source.getnframes())
            duration = len(frames) / (sample_rate * channels * 2)

        start = cursor
        combined.writeframes(frames)
        cursor += duration
        end = cursor

        timeline.append({
            "id": segment["id"],
            "start": round(start, 4),
            "end": round(end, 4),
            "duration": round(duration, 4),
            "narration": segment["text"],
            "visualPrompt": segment.get("visualPrompt", ""),
            "motion": segment.get("motion", "slow-camera-dolly")
        })

        if index < len(wav_parts) - 1:
            silence_frames = round(sample_rate * silence_seconds)
            silence = b"\x00" * silence_frames * channels * 2
            combined.writeframes(silence)
            cursor += silence_seconds

result = {
    "episodeId": episode["id"],
    "title": episode["title"],
    "voiceProfile": voice,
    "engine": "Piper",
    "model": "fr_FR-mls-medium",
    "speakerId": 0,
    "sampleRate": sample_rate,
    "channels": channels,
    "duration": round(cursor, 4),
    "timingSource": "measured-segment-wav-durations",
    "segments": timeline
}
(OUT / "timeline.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

(OUT / "ATTRIBUTION.txt").write_text(
    "Voix générée avec Piper et le modèle fr_FR-mls-medium, locuteur 0.\n"
    "Fiche du modèle et informations d'attribution :\n"
    "https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/mls/medium\n"
    "Dataset MLS indiqué sous CC-BY-4.0 dans la fiche du modèle. "
    "Vérifier et conserver les mentions d'attribution applicables lors de toute redistribution.\n"
    "Moteur Piper : https://github.com/OHF-Voice/piper1-gpl\n",
    encoding="utf-8"
)
print(f"Audio complet : {combined_path}")
print(f"Durée mesurée : {cursor:.2f} s")
print(f"Segments synchronisés : {len(timeline)}")
