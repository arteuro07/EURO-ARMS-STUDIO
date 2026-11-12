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

## Prévisualisation synchronisée — épisode 001

Après exécution réussie du workflow `.github/workflows/generate-episode-001.yml`, récupérer l'artefact `EURO-ARMS-EP001-NARRATION`. Dans le studio web :
1. charger `narration-complete.wav` dans le champ audio ;
2. charger `timeline.json` dans le champ timeline ;
3. lancer la lecture audio.

Le contrôleur Three.js lit le temps courant du lecteur et sélectionne la scène à partir des timecodes mesurés du WAV. Chaque segment déclenche une composition caméra dédiée avec déplacement progressif, variation d'échelle et animation d'ambiance. Les timecodes proviennent des durées réelles des WAV de segment, et non d'une estimation par nombre de mots.

Cette prévisualisation utilise encore un objet sculptural abstrait pour valider le rythme et les mouvements. Elle ne constitue pas encore le rendu final avec les illustrations historiques détaillées du Desert Eagle. Les sous-titres mot à mot nécessiteront un alignement forcé séparé.
