// Voix de narration unique : les épisodes réutilisent le même profil.
export const VOICE_PROFILE = Object.freeze({
  id: "euro-documentary-fr-01",
  language: "fr-FR",
  voiceKey: "VOICE_ID_TO_CONFIGURE",
  rate: 0.96,
  pitch: -1,
  style: "documentaire, posé, grave, chaleureux, articulation nette",
  stability: 0.78,
  similarity: 0.82
});

// Le voiceKey sera relié à un fournisseur TTS après vérification de ses droits,
// de sa disponibilité et de son coût. Ne pas changer de voix entre épisodes.
