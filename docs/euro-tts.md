# EURO TTS — architecture vocale

## Objectif
Créer une identité de narration masculine originale, en français, stable d'un épisode à l'autre. Aucun enregistrement vocal personnel ne sera utilisé.

## Moteur retenu pour le prototype
- Runtime : Pocket TTS de Kyutai.
- Modèle : `kyutai/pocket-tts`, variante française.
- Génération locale CPU possible ; aucune API TTS payante n'est requise.
- Sortie cible : WAV mono/PCM à 24 kHz (à confirmer dans le test d'intégration).

## Référence vocale
Le modèle français préconfiguré utilise la voix Estelle, qui ne correspond pas à notre choix masculin. EURO TTS utilisera donc un fichier de référence masculin externe uniquement après vérification de son origine, de son autorisation de synthèse et de sa licence.

Pistes autorisées à examiner :
- Les voix françaises du dossier `cml-tts/fr/` de `kyutai/tts-voices` : dataset annoncé sous CC BY 4.0, attribution requise.
- Les voix volontaires `voice-donations/` : annoncées sous CC0 ; vérifier qu'un échantillon choisi est adapté au français avant de le retenir.

Exclure les collections marquées CC BY-NC ou toute voix dont les droits sont incertains.

## Pipeline prévu
1. Sélectionner et documenter une référence masculine autorisée.
2. Tester la prononciation française sur le texte d'essai Desert Eagle.
3. Verrouiller le même fichier de référence et les mêmes paramètres pour chaque épisode.
4. Générer un WAV par segment narratif.
5. Aligner le texte sur l'audio réellement généré ; ne pas utiliser une simple estimation du nombre de mots comme timecode final.
6. Fournir les timecodes au moteur de scènes Three.js et au rendu FFmpeg.

## Limites actuelles
- La voix masculine finale n'est pas encore sélectionnée.
- Aucun WAV n'a encore été généré ni validé.
- Le script d'entraînement de Pocket TTS demande un GPU NVIDIA et beaucoup de données (le guide minimal parle de 200 heures et d'environ 15 GB de données). L'entraînement complet depuis zéro n'est donc pas notre première étape ; on construit d'abord une identité stable à partir d'une référence permise.
- Le dépôt ne doit pas inclure de fichiers vocaux tant que leur licence et leur attribution ne sont pas documentées.

## Références
- Pocket TTS : https://github.com/kyutai-labs/pocket-tts
- Voix et licences : https://huggingface.co/kyutai/tts-voices
- Guide d'entraînement : https://github.com/kyutai-labs/pocket-tts/blob/main/training/README.md
