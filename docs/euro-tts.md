# EURO TTS — moteur de narration

## Objectif
Fournir une narration française masculine, constante d'un épisode à l'autre, sans jamais utiliser un enregistrement vocal de l'utilisateur.

## Prototype de production retenu
- **Moteur :** Piper TTS, exécuté sur CPU dans GitHub Actions.
- **Modèle :** `fr_FR-mls-medium`.
- **Locuteur fixe :** speaker_id 0, correspondant à l'identifiant du corpus MLS `1840`.
- **Profil :** voix française masculine, posée et chaleureuse ; le catalogue de voix la répertorie comme masculine.
- **Sortie :** WAV, 22 050 Hz.
- **Attribution :** le modèle MLS indique le dataset sous licence CC BY 4.0. Le workflow produit un fichier `ATTRIBUTION.txt` avec les livrables. Cette attribution doit rester jointe à toute redistribution.
- **Cohérence :** le même modèle et le même speaker_id doivent être utilisés pour tous les épisodes.

## Ce que signifie « notre TTS »
EURO TTS est notre pipeline de production et de synchronisation, construit autour d'un moteur open source. Nous ne prétendons pas avoir entraîné le modèle acoustique depuis zéro : le modèle vocal français existe déjà et est issu du corpus MLS. Cela permet de générer gratuitement les narrations sur les runners GitHub sans API TTS payante ni enregistrement personnel.

## Pipeline actif
1. Lire les segments de l'épisode depuis `episodes/NNN-*/episode.json`.
2. Charger une seule fois le modèle Piper et le locuteur 0.
3. Générer un WAV distinct pour chaque segment.
4. Mesurer la durée réelle de chaque WAV PCM.
5. Assembler la narration complète avec de courts séparateurs.
6. Écrire `timeline.json` à partir des durées audio mesurées.
7. Contrôler le nombre de scènes, les durées, l'ordre et la continuité.
8. Transmettre l'audio et la timeline au rendu Remotion/FFmpeg.

## Limites et décisions
- La voix actuelle est une voix de corpus autorisée, pas une identité vocale inventée de zéro.
- La qualité finale doit être contrôlée à l'écoute sur les épisodes ; une génération techniquement réussie ne garantit pas une narration suffisamment naturelle.
- Ne pas changer de speaker_id entre épisodes sans décision explicite.
- Ne pas cloner une voix identifiable sans autorisation appropriée.
- Pocket TTS a été étudié comme piste expérimentale, mais il n'est pas le moteur du pipeline de production actuel.

## Références
- Piper : https://github.com/OHF-Voice/piper1-gpl
- Modèle français MLS et fiche de licence : https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/mls/medium
- Catalogue des voix Piper : https://huggingface.co/rhasspy/piper-voices/blob/main/voices.json
- Identification du speaker 1840 comme voix masculine française : https://naadly.com/voices/clement-quesnel
- Dataset MLS : https://openslr.org/94/
