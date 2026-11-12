# EURO TTS — architecture vocale

## Objectif
Créer une identité de narration masculine, française et stable d'un épisode à l'autre. Aucun enregistrement personnel de l'utilisateur ne sera utilisé.

## Moteur prototype
- Runtime étudié : Pocket TTS de Kyutai.
- Le modèle prend en charge le français et accepte un fichier audio de référence.
- Le moteur fonctionne sur CPU ; le rendu sera exécuté sur GitHub Actions pour éviter de charger le téléphone.
- Sortie cible : WAV ; fréquence et format exacts à confirmer par un test d'intégration.
- Les voix prédéfinies autres que la voix française native sont principalement des références anglaises ; le dépôt Pocket TTS recommande une référence correspondant à la langue cible.

## Choix de la voix — statut juridique et technique

### Pistes examinées
- **Estelle (Pocket TTS)** : voix française native intégrée, mais féminine ; ne correspond pas à notre direction.
- **Marius et Javert (Kyutai / Unmute)** : voix masculines issues de dons volontaires, publiées en CC0. Les fichiers de référence fournis dans le catalogue Pocket TTS sont identifiés comme anglais ; ce n'est donc pas notre choix direct pour une narration française sans test d'accent.
- **Fabieng (Unmute)** : voix française jouée par Neil Zeghidour. Le dépôt Kyutai décrit ce fichier parmi les enregistrements propres à Kyutai utilisables en CC0. Cependant, nous n'avons pas trouvé de permission distincte et explicite du comédien couvrant le clonage de cette voix. Ne pas l'utiliser comme référence de clonage sur la seule base de la licence du fichier.
- **Dons vocaux Unmute** : les conditions du projet autorisent explicitement la transformation et la réutilisation des contributions, y compris commerciale, et indiquent que la réplication vocale peut en résulter. Le catalogue public compte 228 dons vérifiés, mais nous n'avons pas identifié de fichier de donneur à la fois masculin et enregistré en français. Les voix masculines préconfigurées Marius/Javert sont listées en anglais.
- **Piper fr_FR-tom-medium (solution de repli)** : voix française masculine de qualité medium. Le modèle est sous AGPLv3 et son auteur publie des conditions supplémentaires d'autorisation de la voix : ne pas présenter la voix comme appartenant à une personne réelle ou identifiée, ne pas révéler l'identité de l'auteur aux utilisateurs finaux, et publier sous AGPLv3 tout modèle vocal reconstruit à partir de ses poids ou de son audio. Cette option reste à évaluer ; elle ne doit pas être mélangée à Pocket TTS sans raison technique.
- **Henri (Loudkit)** : profil d'un autre moteur, pas une voix directement intégrée à Pocket TTS. L'audio source d'enrôlement n'est pas redistribué avec le profil. Ne pas le brancher directement dans Pocket TTS.

### Décision actuelle
Aucune voix n'est encore sélectionnée. Priorité à une référence masculine française dont la provenance et l'autorisation de synthèse vocale sont claires. Si aucune référence adaptée n'est disponible, tester Piper Tom comme moteur de repli plutôt que cloner une voix dont les droits sont incertains.

## Pipeline prévu
1. Identifier une référence masculine française ou un moteur français masculin dont les conditions autorisent clairement l'usage envisagé.
2. Vérifier la compatibilité exacte avec le moteur choisi.
3. Générer un test court en français sur GitHub Actions ; écouter et contrôler timbre, naturel, articulation et prononciation.
4. Comparer les résultats avant de fixer définitivement une seule identité vocale et ses paramètres.
5. Générer un WAV par segment narratif.
6. Aligner le texte sur l'audio réellement généré ; les estimations par nombre de mots ne sont qu'un secours temporaire.
7. Transmettre les vrais timecodes au moteur Three.js et au rendu FFmpeg.

## Limites actuelles
- La référence masculine finale n'est pas sélectionnée.
- Aucun WAV EURO TTS n'a encore été généré ni validé.
- L'entraînement complet depuis zéro est hors de portée du pipeline gratuit actuel ; priorité à un modèle existant et à une référence dûment autorisée.
- Aucun fichier vocal ne doit être ajouté au dépôt avant vérification des droits et de l'attribution.

## Références
- Pocket TTS : https://github.com/kyutai-labs/pocket-tts
- Catalogue des voix Kyutai : https://huggingface.co/kyutai/tts-voices
- Conditions du don vocal Unmute : https://kyutai.org/legal/Terms%20of%20Use%20-%20Unmute%20Voice%20Donation%20Project%20v1.pdf
- Politique de confidentialité Unmute : https://kyutai.org/legal/Privacy%20Policy%20-%20Unmute%20Voice%20Donation%20Project%20v1.pdf
- Galerie Loudkit : https://loudkit.loudreader.io/voices/
- Piper Tom — fiche modèle : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/tom/medium/MODEL_CARD
- Piper Tom — conditions de l'auteur : https://github.com/tjiho/French-tts-model-piper
- Export d'une voix Pocket TTS : https://kyutai-labs.github.io/pocket-tts/CLI%20Commands/export_voice/
