import json
import subprocess
import wave
from pathlib import Path

EPISODE = Path("episodes/001-desert-eagle/episode.json")
MODEL_DIR = Path(".voice-cache")
OUT = Path("dist/episode-001")
OUT.mkdir(parents=True, exist_ok=True)

episode = json.loads(EPISODE.read_text(encoding="utf-8"))
if episode.get("voiceProfile") != "euro-documentary-fr-01":
    raise SystemExit("Profil vocal inattendu : la voix approuvée doit rester active.")

segments = episode.get("segments", [])
if not segments:
    raise SystemExit("L'épisode ne contient aucun segment.")

# Une seule instance Piper charge le modèle une fois, puis écrit chaque WAV
# demandé par les lignes JSON. Le speaker_id reste explicitement fixé à 0.
requests = []
wav_parts = []
for index, segment in enumerate(segments, start=1):
    text = segment["text"].strip()
    if not text:
        raise SystemExit(f"Texte vide pour {segment.get('id', index)}")
    output = OUT / f"{index:02d}-{segment['id']}.wav"
    requests.append({
        "text": text,
        "speaker_id": 0,
        "output_file": str(output)
    })
    wav_parts.append((segment, output))

payload = "".join(json.dumps(item, ensure_ascii=False) + "\\n" for item in requests)
command = [
    "python", "-m", "piper",
    "-m", "fr_FR-mls-medium",
    "--data-dir", str(MODEL_DIR),
    "--json-input"
]
print(f"Génération de {len(requests)} passages avec Piper MLS, locuteur 0…")
subprocess.run(command, input=payload, text=True, check=True)

# La timeline est calculée à partir des durées PCM réellement écrites.
timeline = []
cursor = 0.0
silence_seconds = 0.12
combined_path = OUT / "narration-complete.wav"

for index, (segment, path) in enumerate(wav_parts):
    if not path.exists() or path.stat().st_size < 1000:
        raise SystemExit(f"Fichier audio absent ou trop petit : {path}")

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
            combined.writeframes(b"\\x00" * silence_frames * channels * 2)
            cursor += silence_seconds

result = {
    "episodeId": episode["id"],
    "title": episode["title"],
    "voiceProfile": episode["voiceProfile"],
    "engine": "Piper",
    "model": "fr_FR-mls-medium",
    "speakerId": 0,
    "sampleRate": sample_rate,
    "channels": channels,
    "duration": round(cursor, 4),
    "timingSource": "measured-segment-wav-durations",
    "segments": timeline
}
(OUT / "timeline.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2) + "\\n",
    encoding="utf-8"
)
(OUT / "ATTRIBUTION.txt").write_text(
    "Voix générée avec Piper et le modèle fr_FR-mls-medium, locuteur 0.\\n"
    "Fiche du modèle et informations d'attribution :\\n"
    "https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/mls/medium\\n"
    "Dataset MLS indiqué sous CC-BY-4.0 dans la fiche du modèle. "
    "Vérifier et conserver les mentions d'attribution applicables lors de toute redistribution.\\n"
    "Moteur Piper : https://github.com/OHF-Voice/piper1-gpl\\n",
    encoding="utf-8"
)
print(f"Audio complet : {combined_path}")
print(f"Durée mesurée : {cursor:.2f} s")
print(f"Segments synchronisés : {len(timeline)}")
