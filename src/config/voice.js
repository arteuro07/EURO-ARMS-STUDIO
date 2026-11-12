// Configuration centrale du moteur vocal EURO TTS.
// Aucun enregistrement personnel de l'utilisateur ne sera utilisé.
// La référence masculine reste à sélectionner après vérification des droits.
export const VOICE_PROFILE = Object.freeze({
  id: "euro-documentary-fr-01",
  engine: "pocket-tts",
  model: "kyutai/pocket-tts",
  language: "french",
  voiceReference: null,
  voiceReferenceStatus: "NOT_SELECTED_LICENSE_REVIEW_REQUIRED",
  direction: "voix masculine originale, grave, posée, chaleureuse, documentaire",
  generation: Object.freeze({
    format: "wav",
    keepSameReferenceForEveryEpisode: true
  })
});

// Important : « Henri » est un profil de la galerie Loudkit, pas une voix
// native de Pocket TTS. Ne pas le brancher directement comme s'il était
// compatible. Sa référence CML-TTS et le droit de clonage doivent être vérifiés.
