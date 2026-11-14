# EURO MOTION STUDIO — Architecture

## Product goal
A universal production system: one shared engine, multiple specialist profiles. A project can be a historical documentary, science explainer, biography, product story, news explainer or fictional short. Profiles change editorial rules and art direction without forking the rendering engine.

## System layers

### 1. Project contract
A versioned JSON project describes topic, language, audience, platform, duration, visual direction, narration, scenes, assets and output. The contract is validated before expensive jobs start.

### 2. Editorial pipeline
- Brief parser: turns a topic and constraints into a production brief.
- Research dossier: source URLs, claims and confidence; factual claims must be reviewable.
- Script writer: hook, narrative beats, transitions and ending.
- Storyboard planner: each narration beat maps to a scene and visual purpose.
- Human approval checkpoints: approve research/script/storyboard before rendering.

### 3. Voice and timing
Support imported WAV/MP3 first. Voice providers are adapters, not hard-coded dependencies. Keep a stable voice profile where the provider permits it. Word-level captions require alignment timestamps; do not fabricate word timings from sentence durations. If no alignment exists, use phrase-level captions or run forced alignment.

### 4. Visual engine
- Remotion: composition, timeline, captions, transitions and deterministic final video.
- Three.js: real-time 3D assets, lighting, camera and animated objects.
- 2D/2.5D layers: illustrated scenes, depth and parallax where appropriate.
- Asset manifest: provenance, license, dimensions and reusable identifiers.
- Animation contract: every scene must declare at least one meaningful animated channel (subject, camera, light, particles or environment).

### 5. Audio post-production
Narration, music and effects on separate tracks; duck music under speech; fades and clipping checks. Keep licensed/source attribution in project metadata.

### 6. Render and quality gates
Render low-resolution previews first. Validate duration, aspect ratio, frame rate, audio presence, black/frozen frames, missing assets, caption bounds and scene coverage. Only then render final quality. A 60 fps target is optional and must be selected per project; it is not a promise of free unlimited compute.

### 7. Studio interface
Mobile-first web interface: project library, brief, script, storyboard, voice, scene editor, preview, render queue and exports. The phone is the control surface; GitHub Actions performs reproducible builds.

## Initial project data flow
`project.json → validation → editorial plan → narration/alignment → storyboard → assets → scene timeline → preview → QA → final render`

## Phased delivery
1. **Foundation (current):** schema, sample project, validator and CI.
2. **Reliable media pipeline:** reusable Remotion composition, audio timing contract and render artifact workflow.
3. **Actual animation:** reusable 2D/2.5D/3D scene primitives and motion tests.
4. **Voice studio:** pluggable TTS/import, voice profile and word alignment.
5. **Creative assistant:** research dossier, script variants, hook variants and storyboard generation with approval.
6. **Mobile editor:** scene adjustments, captions, visual controls and render requests.
7. **Quality automation:** visual/audio QA, retries and export metadata.
8. **Specialist profiles:** EURO-ARMS and additional topic-specific studios.

## Constraints and honest guarantees
- Free GitHub Actions minutes and artifact retention have limits.
- A fully automatic high-quality image/video generation system cannot be promised without a model/API or a local model with hardware requirements.
- The base engine should work with user-provided assets and open-source tools; optional providers must be clearly identified.
- Do not copy proprietary MotionLab source, branding or private assets. Reimplement general capabilities with original code.
