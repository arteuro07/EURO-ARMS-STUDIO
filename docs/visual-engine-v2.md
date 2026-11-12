# EURO-ARMS-STUDIO — moteur visuel V2

## Décision

Le rendu V1 en Three.js est abandonné comme moteur principal de narration. Il a produit un objet géométrique trop rudimentaire, des décors de musée répétitifs et un cadrage qui laissait apparaître le navigateur. Il ne doit plus être utilisé pour produire les épisodes finaux.

La référence de direction artistique est le langage graphique observé dans la vidéo ARCHIVE 66 fournie par l'utilisateur : composition 2D éditoriale, illustrations détourées, fond olive texturé, typographie compacte, chiffres jaunes et animation d'éléments synchronisée avec la narration. Il s'agit d'une inspiration de techniques et de rythme, pas d'une reproduction exacte de la marque ou de ses éléments propriétaires.

## Direction artistique EURO

- Format final : vertical 9:16, 1080 × 1920, 30 i/s.
- Fond : vert olive/gris profond, texture discrète et constante.
- Palette : olive, ivoire chaud, jaune signalétique, gris acier et brun bois très mesurés.
- Assets : illustrations 2D originales ou sources dont la licence et l'attribution sont vérifiées. Pas d'images inventées présentées comme archives historiques.
- Typographie : une police condensée pour dates et chiffres, une police lisible pour les sous-titres éditoriaux.
- Composition : un sujet principal bien détouré, 1 à 3 éléments secondaires, beaucoup d'espace négatif.
- Lumière : ombres douces et contours lisibles ; pas de bloom, reflets métalliques exagérés ou noirs bouchés.
- Pas d'interface de jeu, de navigateur ou de contrôles dans le master vidéo.

## Architecture de production

1. Piper fr_FR-mls-medium, speaker 0 reste la voix approuvée et constante.
2. Le WAV final et les durées réelles des segments définissent la timeline.
3. Chaque segment possède une scène éditoriale avec un manifeste d'assets, une position initiale/finale, des événements d'entrée/sortie et des animations.
4. Le rendu 2D est piloté par SVG/HTML/CSS et GSAP (ou Web Animations API si une dépendance supplémentaire n'apporte pas de bénéfice). Three.js devient facultatif pour des plans 3D isolés, jamais la base.
5. Remotion n'est ajouté que si le prototype prouve qu'il simplifie réellement le rendu frame-par-frame ; ne pas multiplier les dépendances avant ce test.
6. FFmpeg assemble l'image et le WAV, contrôle les dimensions, la durée, la fréquence d'images et l'intégrité audio.

## Grammaire d'animation

Chaque scène doit combiner au moins deux actions visuelles utiles au récit, choisies selon le contenu :
- entrée ou sortie latérale/verticale d'une illustration ;
- déplacement de caméra 2D ou parallaxe entre couches ;
- apparition progressive d'un chiffre, d'une date ou d'un mot-clé ;
- surlignage animé d'une donnée ;
- transformation graphique ou comparaison avant/après ;
- déplacement d'un repère sur une frise chronologique ;
- rotation légère d'un objet détouré, uniquement si elle reste crédible.

Le mouvement ne doit jamais être un simple zoom permanent sur une image fixe. Chaque événement reçoit un intervalle explicite dans la scène et doit être lisible sans masquer l'illustration.

## Synchronisation

- Synchronisation actuelle : limites de scènes calculées à partir des durées WAV réelles.
- Synchronisation mot à mot : non implémentée ; ne pas la revendiquer.
- Les événements visuels sont attachés au temps local de chaque segment, puis convertis en temps global.
- Les silences inter-segments sont conservés sans flash ni écran vide.
- Le rendu est déterministe : une même timeline et les mêmes assets doivent produire le même montage.

## Contrôles qualité obligatoires

Avant toute livraison :
- vérifier que le MP4 ne contient aucune barre de navigateur ou de studio ;
- extraire des images à plusieurs moments de chaque scène et inspecter le cadrage ;
- vérifier que les illustrations correspondent réellement à la phrase racontée ;
- vérifier l'absence de texte coupé, d'éléments hors cadre et d'écrans noirs ;
- vérifier 1080 × 1920, 30 i/s, piste AAC présente et durée cohérente ;
- écouter le début, le milieu et la fin pour contrôler la narration ;
- ne jamais qualifier le rendu de final avant inspection visuelle.

## Plan de migration

1. Conserver la voix Piper, les sources historiques, les six segments et la timeline WAV.
2. Construire une scène 2D de test autonome avec une illustration détourée originale, un fond texturé et des éléments typographiques animés.
3. Valider ce test dans GitHub Actions et inspecter les images réellement rendues.
4. Migrer les six scènes du Desert Eagle seulement après validation du test.
5. Retirer l'ancien rendu 3D du workflow final après comparaison réussie.

## État

Cette décision d'architecture ne signifie pas que le nouveau moteur est déjà implémenté. Le rendu V1 reste un prototype rejeté ; aucun nouveau MP4 final n'est déclaré disponible à ce stade.
