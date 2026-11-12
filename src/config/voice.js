// Configuration centrale du moteur vocal EURO TTS.
// Aucun enregistrement personnel de l'utilisateur n'est utilisé.
// Voix retenue après audition : Piper MLS, locuteur 0.
export const VOICE_PROFILE = Object.freeze({
  id: "euro-documentary-fr-01",
  engine: "piper",
  model: "fr_FR-mls-medium",
  language: "french",
  speakerId: 0,
  voiceReference: null,
  voiceReferenceStatus: "USER_APPROVED_AUDIO_AUDITION",
  direction: "voix française retenue à l'écoute, narration documentaire posée et chaleureuse",
  generation: Object.freeze({
    format: "wav",
    sampleRate: 22050,
    keepSameReferenceForEveryEpisode: true
  }),
  attribution: Object.freeze({
    modelCard: "https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/mls/medium",
    datasetLicense: "CC-BY-4.0",
    note: "Conserver l'attribution requise par la fiche du modèle et vérifier les conditions du modèle avant toute redistribution."
  })
});
