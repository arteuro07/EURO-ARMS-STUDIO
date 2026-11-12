// Lecture et pilotage de la timeline produite à partir des WAV Piper réels.
export function validateAudioTimeline(data) {
  if (!data || !Array.isArray(data.segments) || data.segments.length === 0) {
    throw new Error("Timeline audio invalide : aucun segment.");
  }
  let previousEnd = 0;
  for (const segment of data.segments) {
    if (!Number.isFinite(segment.start) || !Number.isFinite(segment.end) ||
        segment.start < 0 || segment.end <= segment.start) {
      throw new Error(`Timecodes invalides pour ${segment.id || "scène"}.`);
    }
    if (segment.start + 0.001 < previousEnd) {
      throw new Error("Les scènes se chevauchent dans la timeline.");
    }
    previousEnd = segment.end;
  }
  return data.segments;
}

export function sceneAtTime(timeline, seconds) {
  if (!Array.isArray(timeline) || timeline.length === 0) return null;
  const active = timeline.find((scene, index) =>
    seconds >= scene.start &&
    (seconds < scene.end || index === timeline.length - 1 && seconds <= scene.end)
  );
  if (active) return active;
  if (seconds < timeline[0].start) return timeline[0];
  // Pendant les 120 ms de silence entre deux WAV, conserver le plan précédent.
  for (let index = timeline.length - 2; index >= 0; index--) {
    if (seconds >= timeline[index].end && seconds < timeline[index + 1].start) {
      return timeline[index];
    }
  }
  return timeline[timeline.length - 1];
}

export function sceneProgress(scene, seconds) {
  if (!scene) return 0;
  return Math.max(0, Math.min(1, (seconds - scene.start) / (scene.end - scene.start)));
}

export function smoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}
