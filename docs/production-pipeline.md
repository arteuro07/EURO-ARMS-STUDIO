# Production synchronisée

## Voix constante
Tous les épisodes utilisent le profil `euro-documentary-fr-01`. Le fournisseur TTS doit accepter une voix stable et une utilisation commerciale compatible. On stockera une seule configuration de voix, puis on réutilisera exactement la même identité, le même débit et les mêmes réglages. Aucun changement de voix épisode par épisode.

## Synchronisation voix / image
1. Générer la narration complète avec le profil constant.
2. Découper le texte en segments correspondant aux scènes.
3. Produire les timecodes réels avec un outil d'alignement forcé audio/texte.
4. Affecter à chaque segment une illustration dédiée.
5. Faire durer chaque plan sur son segment audio, avec quelques images de respiration pour les transitions.
6. Vérifier automatiquement que chaque plan couvre son segment, sans trou ni chevauchement involontaire.
7. Exporter le montage vertical avec voix, ambiance et sous-titres optionnels.

La durée des scènes ne doit pas être devinée à partir d'une durée fixe : les timecodes issus de l'audio font autorité. Le module `src/pipeline/timeline.js` fournit une première estimation en attendant l'intégration de l'aligner.

## Animation réelle
Chaque scène doit avoir au moins un mouvement visuel planifié : caméra 3D, objet, lumière, fumée atmosphérique légère ou éléments de décor. Un simple zoom sur une image fixe ne compte pas comme animation.

## Étalonnage
- Exposition maîtrisée : pas de hautes lumières brûlées.
- Contraste moyen : détails conservés dans les ombres.
- Saturation modérée, matériaux réalistes.
- Balance des blancs cohérente d'un plan à l'autre.
- Contrôle sur écran mobile avant validation.
