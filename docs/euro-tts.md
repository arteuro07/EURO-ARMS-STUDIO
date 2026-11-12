# EURO TTS — architecture vocale

## Objectif
Créer une identité de narration masculine, française et stable d'un épisode à l'autre. Aucun enregistrement personnel de l'utilisateur ne sera utilisé.

## Moteurs étudiés
- **Pocket TTS de Kyutai** : prend en charge le français, accepte une référence audio et fonctionne sur CPU. La voix française intégrée est féminine ; la référence masculine adaptée reste à trouver.
- **Piper (Open Home Foundation)** : moteur local CPU, installation officielle par `pip install piper-tts`. Il est retenu pour générer la narration française avec le modèle MLS, locuteur 0, sans entraînement ni clonage d'une voix personnelle.
- La génération de la narration est exécutée sur GitHub Actions, afin de ne pas charger le téléphone.

## Comparaison initiale des voix (historique)
Le workflow d'audition `.github/workflows/voice-audition.yml` avait produit trois échantillons de comparaison lisant le même texte :
- **fr_FR-tom-medium** : français, qualité medium, 44,1 kHz. Les poids sont sous AGPL-3.0 ; l'auteur accorde une autorisation vocale gratuite avec conditions supplémentaires. La voix ne doit pas être présentée comme appartenant à une personne réelle ou identifiée ; l'identité de l'auteur ne doit pas être communiquée aux utilisateurs finaux. Tout modèle vocal dérivé des poids ou de l'audio doit être publié sous AGPL-3.0.
- **fr_FR-gilles-low** : français, qualité low, 16 kHz. La fiche du modèle indique une source CC0, mais le modèle est de faible qualité et sert uniquement de point de comparaison. La fiche précise qu'il a été affiné à partir d'une voix anglaise.
- **fr_FR-mls-medium, speaker 0** : français, qualité medium, 22,05 kHz, modèle annoncé avec 125 locuteurs. La fiche indique le dataset MLS sous CC BY 4.0 ; le genre du locuteur 0 n'est pas confirmé et devra être contrôlé à l'écoute.

Cette comparaison a servi à l'écoute préalable. Le locuteur MLS 0 a ensuite été écouté et approuvé par l'utilisateur pour la narration EURO ARMS. Aucun enregistrement personnel n'est utilisé.

## Choix de la voix — statut juridique et technique
- **Estelle (Pocket TTS)** : voix française native intégrée, féminine ; ne correspond pas à notre direction.
- **Marius et Javert (Kyutai / Unmute)** : voix masculines issues de dons volontaires CC0, mais les fichiers de référence du catalogue Pocket TTS sont identifiés comme anglais ; ne pas les utiliser pour une narration française sans validation de l'accent.
- **Fabieng (Unmute)** : voix française jouée par Neil Zeghidour. La licence du fichier est CC0, mais nous n'avons pas trouvé de permission distincte et explicite du comédien couvrant le clonage de cette voix. Ne pas l'utiliser comme référence de clonage sur la seule base de la licence du fichier.
- **Dons vocaux Unmute** : les conditions du projet autorisent la réutilisation commerciale des contributions et indiquent que la réplication vocale peut en résulter. Le catalogue public compte 228 dons vérifiés, mais nous n'avons pas identifié de fichier de donneur à la fois masculin et enregistré en français.
- **Henri (Loudkit)** : profil d'un autre moteur, pas une voix directement intégrée à Pocket TTS. L'audio source d'enrôlement n'est pas redistribué avec le profil. Ne pas le brancher directement dans Pocket TTS.

### Décision actuelle
Aucune voix n'est encore sélectionnée. Nous comparons d'abord les échantillons Piper. Si aucune voix ne satisfait le niveau de qualité documentaire et les conditions d'usage, nous reprendrons la recherche d'une référence masculine française adaptée à Pocket TTS. Ne pas cloner une voix identifiable sans autorisation appropriée.

## Pipeline prévu
1. Écouter et comparer les WAV produits par le workflow.
2. Vérifier les conditions exactes du moteur et du modèle retenus pour le projet et sa diffusion.
3. Fixer une seule identité vocale et des paramètres constants pour tous les épisodes.
4. Générer un WAV par segment narratif.
5. Aligner le texte sur l'audio réellement généré ; les estimations par nombre de mots ne sont qu'un secours temporaire.
6. Transmettre les vrais timecodes au moteur Three.js et au rendu FFmpeg.

## Limites actuelles
- Le workflow d'audition est ajouté, mais il n'a pas encore été lancé.
- Aucun WAV EURO TTS n'a encore été généré ni validé.
- L'entraînement complet depuis zéro est hors de portée du pipeline gratuit actuel ; priorité à un moteur existant et à des droits vérifiés.
- Aucun fichier vocal ni poids de modèle ne doit être ajouté au dépôt.

## Références
- Pocket TTS : https://github.com/kyutai-labs/pocket-tts
- Catalogue des voix Kyutai : https://huggingface.co/kyutai/tts-voices
- Conditions du don vocal Unmute : https://kyutai.org/legal/Terms%20of%20Use%20-%20Unmute%20Voice%20Donation%20Project%20v1.pdf
- Piper officiel : https://github.com/OHF-Voice/piper1-gpl
- Documentation CLI Piper : https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/CLI.md
- Piper Tom — fiche modèle : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/tom/medium/MODEL_CARD
- Piper Tom — conditions de l'auteur : https://github.com/tjiho/French-tts-model-piper
- Piper Gilles — fiche modèle : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/gilles/low/MODEL_CARD
- Piper MLS — fiche modèle : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/mls/medium/MODEL_CARD
- Galerie Loudkit : https://loudkit.loudreader.io/voices/
- Export d'une voix Pocket TTS : https://kyutai-labs.github.io/pocket-tts/CLI%20Commands/export_voice/
