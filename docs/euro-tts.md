# EURO TTS — voix et moteur de narration

## Identité vocale retenue

La voix approuvée à l'écoute pour la série est le locuteur **0** du modèle Piper français MLS, correspondant à l'identifiant de dataset **1840**.

- Profil interne : `euro-documentary-fr-01`
- Moteur : Piper TTS
- Modèle : `fr_FR-mls-medium`
- Locuteur Piper : `speaker_id=0`
- Identifiant de dataset : `1840`
- Sortie : WAV PCM, 22 050 Hz
- Usage : narration documentaire française
- Enregistrement personnel : aucun

La voix reste identique d'un épisode à l'autre. Ne pas changer de modèle, de speaker ID ou de paramètres sans validation explicite.

## Ce que signifie « EURO TTS »

EURO TTS est notre chaîne de synthèse et de production : configuration de la voix, génération segmentée, assemblage WAV, mesure des durées, attribution, puis synchronisation avec les scènes et le rendu vidéo.

Le moteur vocal est Piper, un moteur open source. Nous ne prétendons pas avoir entraîné un modèle acoustique propriétaire depuis zéro. Notre valeur ajoutée est le pipeline contrôlé et la continuité de la voix sur toute la série.

## Licence et attribution

La fiche du modèle `fr_FR-mls-medium` indique que les enregistrements du dataset MLS sont sous **CC BY 4.0**. Conserver l'attribution et la référence du modèle dans les livrables audio/vidéo redistribués.

- Fiche du modèle : https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/mls/medium
- Correspondance des locuteurs : https://huggingface.co/rhasspy/piper-voices/blob/main/voices.json
- Dataset MLS : http://openslr.org/94/
- Moteur Piper : https://github.com/OHF-Voice/piper1-gpl

Le code du moteur et la licence des données vocales sont deux éléments distincts : respecter les conditions de chacun. Ne pas retirer `ATTRIBUTION.txt` des artefacts.

## Pipeline validé pour l'épisode 001

1. Charger une seule fois le modèle Piper.
2. Générer un fichier WAV par segment narratif avec `speaker_id=0`.
3. Mesurer la durée réelle de chaque fichier PCM.
4. Assembler les WAV en conservant 0,12 seconde de respiration entre segments.
5. Écrire `timeline.json` avec les vrais débuts et fins des segments.
6. Vérifier le nombre de scènes, la durée totale, l'absence de chevauchement et la cohérence audio/timeline.
7. Transmettre cette timeline au rendu Remotion afin que chaque scène suive le segment vocal correspondant.

Les timecodes sont mesurés à partir des WAV segmentés. Il s'agit d'une synchronisation réelle au niveau des scènes, pas encore d'un alignement forcé mot à mot.

## Limites et prochaines améliorations

- La voix est une voix de synthèse issue d'un modèle public, pas une voix créée de zéro.
- Pour un modèle entièrement original, il faudrait un corpus vocal dont les droits sont explicitement acquis ou une méthode de génération synthétique autorisée; aucun enregistrement personnel ne sera demandé.
- Les améliorations prioritaires sont la prosodie, les pauses, la ponctuation, les noms propres et la cohérence de débit, sans changer de locuteur.
