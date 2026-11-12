# EURO TTS — architecture vocale

## Objectif
Créer une identité de narration masculine, française et stable d'un épisode à l'autre. Aucun enregistrement personnel de l'utilisateur ne sera utilisé.

## Moteur prototype
- Runtime étudié : Pocket TTS de Kyutai.
- Le modèle prend en charge le français et accepte un fichier audio de référence.
- Le moteur peut fonctionner sur CPU ; le rendu sera exécuté sur GitHub Actions pour éviter de charger le téléphone.
- Sortie cible : WAV ; fréquence et format exacts à confirmer par un test d'intégration.

## Choix de la voix — statut juridique et technique
- La voix française intégrée par défaut à Pocket TTS est Estelle, féminine : elle ne convient pas à notre direction.
- « Henri » est référencé par la galerie Loudkit comme voix masculine française issue de CML-TTS, sous CC BY 4.0. Attention : Henri est un profil enrôlé pour le modèle Loudkit, pas une voix intégrée directement à Pocket TTS. La galerie précise que l'audio source d'enrôlement n'est pas redistribué avec le profil.
- Le dépôt Kyutai tts-voices indique que les enregistrements CML-TTS français sont sous CC BY 4.0. Cette licence et l'existence d'un fichier dans un jeu de données ne suffisent pas, à elles seules, à établir que le donneur a consenti à une réutilisation pour clonage vocal. Ne pas cloner une voix identifiable sans autorisation explicite adaptée.
- Les voix de donations CC0 doivent être examinées individuellement : il faut confirmer langue, présentation masculine, conditions couvrant explicitement la synthèse vocale et disponibilité d'un échantillon exploitable.

Décision : ne pas télécharger ni intégrer Henri à Pocket TTS tant que la provenance exacte de son audio de référence et l'autorisation d'usage vocal ne sont pas confirmées. Ne pas faire croire qu'une référence est déjà choisie.

## Pipeline prévu
1. Identifier une référence masculine synthétique ou une voix volontaire dont les conditions autorisent clairement la synthèse vocale et l'usage envisagé.
2. Vérifier la compatibilité de cette référence avec le modèle français.
3. Faire un test court en français, écouter et contrôler la prononciation.
4. Fixer la référence et tous les paramètres pour les épisodes suivants.
5. Générer un WAV par segment narratif.
6. Aligner le texte sur l'audio réellement généré ; les estimations par nombre de mots ne sont qu'un secours temporaire.
7. Transmettre les vrais timecodes au moteur Three.js et au rendu FFmpeg.

## Limites actuelles
- La référence masculine n'est pas sélectionnée.
- Aucun WAV EURO TTS n'a encore été généré ni validé.
- L'entraînement complet depuis zéro est hors de portée du pipeline gratuit actuel ; priorité à un modèle existant et à une référence dûment autorisée.
- Aucun fichier vocal ne doit être ajouté au dépôt avant vérification des droits et de l'attribution.

## Références
- Pocket TTS : https://github.com/kyutai-labs/pocket-tts
- Catalogue des voix Kyutai : https://huggingface.co/kyutai/tts-voices
- Conditions du dataset CML-TTS : https://openslr.org/146/
- Galerie Loudkit (Henri est un profil d'un autre modèle) : https://loudkit.loudreader.io/voices/
- Export d'une voix Pocket TTS : https://kyutai-labs.github.io/pocket-tts/CLI%20Commands/export_voice/
