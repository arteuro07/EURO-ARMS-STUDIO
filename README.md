# EURO MOTION STUDIO

**Universal, phone-operated video creation engine** for TikTok, Reels, Shorts and YouTube: documentaries, explainers, biographies, product stories, educational videos and fiction.

The existing EURO-ARMS episode remains the first specialist workspace. The shared engine is being generalized so future studios can reuse its timeline, voice, animation and rendering systems.

## Principles
- Android + Termux for control; GitHub Actions for heavy builds.
- Open-source-first dependencies; no mandatory paid API.
- Topic-agnostic project format and reusable specialist profiles.
- Real animation (subject, camera, light, typography or environment), not slideshow zooms.
- Narration-led editing; word-level captions only when alignment timestamps exist.
- Quality gates before export; previews are never mislabeled as final renders.

## Shared pipeline
Brief/research → script → storyboard → narration → alignment → assets → animation → captions/audio mix → preview → QA → final MP4 and platform metadata.

## Repository map
- `episodes/001-desert-eagle/`: first specialist documentary.
- `src/remotion/`: current Remotion composition work.
- `src/pipeline/`: timeline code.
- `schemas/`: versioned project contracts.
- `projects/`: topic-neutral sample projects.
- `docs/architecture.md`: design and phased implementation.

## Current status
**Foundation phase:** universal project contract, sample project and validation script are in place. The editor, research automation, visual generation, voice alignment and universal scene renderer remain future milestones.

## Local development
```bash
npm install
npm run dev
npm run build
npm run validate:project
```

## Targets
Vertical 1080×1920, horizontal 1920×1080 or square 1080×1080. Frame rate is configurable (24–60 fps). GitHub Actions capacity and artifact retention are subject to GitHub's free-tier limits.

See [architecture](docs/architecture.md).
