# Production synchronisée

## Voix constante

Tous les épisodes utilisent le profil `euro-documentary-fr-01` défini dans `src/config/voice.js` :
- Piper TTS, modèle français `fr_FR-mls-medium`.
- Locuteur Piper `speaker_id=0`, identifiant de dataset `1840`.
- Sortie WAV PCM 22 050 Hz.
- Voix approuvée à l'écoute et réutilisée à l'identique sur chaque épisode.
- Aucun enregistrement personnel n'est utilisé.

La fiche du modèle indique une licence de dataset CC BY 4.0. L'attribution doit rester jointe aux livrables redistribués.

## Synchronisation voix / scènes

1. Générer un WAV distinct pour chaque segment narratif.
2. Mesurer les durées PCM réelles des fichiers produits.
3. Assembler les segments avec 0,12 seconde de respiration entre eux.
4. Générer `timeline.json` à partir des débuts et fins mesurés.
5. Vérifier les six segments, la durée totale et l'absence de chevauchement.
6. Faire lire cette timeline par Remotion : chaque scène suit le segment vocal correspondant.
7. Vérifier que la vidéo et le WAV final ont la même durée.

Les timecodes sont exacts au niveau des segments audio. Ils ne sont pas estimés à partir du nombre de mots. L'alignement mot à mot n'est pas encore intégré et ne doit pas être annoncé comme disponible.

## Animation de l'épisode 001

Le rendu actuel de l'épisode 001 utilise Remotion et des illustrations éditoriales SVG avec plusieurs couches animées : déplacement de papier, parallaxe, tracés progressifs, déplacement des cartes de dates, mouvement des silhouettes et transitions de panneaux. Un simple zoom sur image fixe ne suffit pas.

Le prototype Three.js du studio reste distinct du rendu Remotion de cet épisode. Ne pas prétendre que le rendu Desert Eagle utilise déjà une scène Three.js photoréaliste.

## Workflows

- `.github/workflows/generate-episode-001.yml` : installe Piper, télécharge le modèle approuvé, génère les WAV et la timeline, vérifie les livrables, puis publie l'artefact audio.
- `.github/workflows/render-episode-001.yml` : récupère l'artefact audio, valide la timeline, rend les scènes Remotion en 1080×1920 et assemble la narration avec FFmpeg.

## Étalonnage et direction visuelle

Pour l'épisode 001, la direction validée est une illustration documentaire éditoriale 2D avec profondeur 2.5D :
- olive mat, papier ivoire chaud et jaune archive discret;
- grain de papier subtil et contours à l'encre fins;
- lumière latérale maîtrisée, contraste moyen;
- détails conservés dans les ombres, saturation modérée;
- pas de néon, de hautes lumières brûlées, de noirs bouchés ou de bloom excessif.

## Statut connu de l'épisode 001

Le dossier de production indique qu'une génération précédente a produit un WAV complet de 55,74 secondes et une timeline mesurée sur six segments. Le workflow de rendu existe. Ne pas déclarer le MP4 final terminé sans vérifier le dernier artefact Actions correspondant au commit courant.
