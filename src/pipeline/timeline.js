// Synchronisation narration / scènes à partir des timecodes audio réels.
export function buildSceneTimeline(scriptSegments, audioDuration) {
  if (!Array.isArray(scriptSegments) || !scriptSegments.length) throw new Error("Aucun segment narratif");
  if (!(audioDuration > 0)) throw new Error("Durée audio invalide");
  const totalWeight = scriptSegments.reduce((n, s) => n + Math.max(1, s.words || 1), 0);
  let cursor = 0;
  return scriptSegments.map((segment, index) => {
    const duration = audioDuration * Math.max(1, segment.words || 1) / totalWeight;
    const scene = {
      id: segment.id || `scene-${String(index + 1).padStart(2, "0")}`,
      start: cursor,
      end: cursor + duration,
      narration: segment.text,
      visualPrompt: segment.visualPrompt,
      motion: segment.motion || "slow-camera-dolly"
    };
    cursor += duration;
    return scene;
  });
}

export function sceneAtTime(timeline, seconds) {
  return timeline.find(s => seconds >= s.start && seconds < s.end) || timeline.at(-1) || null;
}

// Les timecodes finaux devront provenir d'un aligner audio/texte (forced alignment),
// pas seulement de cette estimation pondérée par nombre de mots.
