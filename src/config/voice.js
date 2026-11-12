// Configuration centrale du moteur vocal EURO TTS.
// Aucun enregistrement personnel : la référence vocale sera issue d'un
// échantillon tiers explicitement autorisé et conservé avec son attribution.
export const VOICE_PROFILE = Object.freeze({
  id: "euro-documentary-fr-01",
  engine: "pocket-tts",
  model: "kyutai/pocket-tts",
  language: "french",
  voiceReference: "assets/voices/euro-documentary-male.wav",
  voiceReferenceStatus: "TO_SELECT_AND_LICENSE",
  direction: "voix masculine originale, grave, posée, chaleureuse, documentaire",
  generation: Object.freeze({
    sampleRate: 24000,
    format: "wav",
    keepSameReferenceForEveryEpisode: true
  })
});

// Ne pas générer tant que la référence masculine et sa licence ne sont pas validées.
// Le moteur français officiel est disponible, mais sa voix préconfigurée Estelle
// ne correspond pas à notre direction masculine. Une référence WAV externe est requise.
