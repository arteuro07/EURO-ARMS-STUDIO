import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

const scenes = [
  {
    eyebrow: "SUR FREE FIRE",
    title: "LE DESERT EAGLE",
    sub: "UNE HISTOIRE BIEN RÉELLE",
    key: "Free Fire",
    caption: "Sur Free Fire, tu utilises cette arme sans connaître son histoire… je vais te la raconter.",
    kind: "hero"
  },
  {
    eyebrow: "FIN DES ANNÉES 1970",
    title: "UNE IDÉE AMÉRICAINE",
    sub: "MAGNUM RESEARCH",
    key: "Magnum Research",
    caption: "Fin des années 1970 : l’américaine Magnum Research imagine un semi-automatique conçu pour les cartouches magnum.",
    kind: "blueprint"
  },
  {
    eyebrow: "1980 → 1981",
    title: "BREVET ET PROTOTYPES",
    sub: "IMI INTERVIENT COMME SOUS-TRAITANT",
    key: "1980",
    caption: "Le dessin est breveté en 1980 ; des prototypes suivent en 1981. IMI, en Israël, intervient comme sous-traitant pour finaliser le modèle.",
    kind: "partner"
  },
  {
    eyebrow: "1983 → 1986",
    title: "LES PREMIERS MODÈLES",
    sub: ".357 PUIS .44 MAGNUM",
    key: "1983",
    caption: "Fin 1983, le Mark I en .357 Magnum arrive sur le marché. En 1986, le Desert Eagle est aussi proposé en .44 Magnum.",
    kind: "year"
  },
  {
    eyebrow: "MILIEU DES ANNÉES 1990",
    title: "LE MARK XIX",
    sub: ".50 ACTION EXPRESS",
    key: ".50 Action Express",
    caption: "Au milieu des années 1990, le Mark XIX adopte le .50 Action Express. Sa silhouette devient célèbre au cinéma et dans les jeux vidéo.",
    kind: "calibre"
  },
  {
    eyebrow: "RÉEL ≠ FICTION",
    title: "UNE ICÔNE POPULAIRE",
    sub: "PROCHAIN ÉPISODE : MP40",
    key: "version virtuelle",
    caption: "Dans Free Fire, tu vois sa version virtuelle. Dans la réalité, c’est un projet américain dont la fabrication initiale est confiée à IMI. Prochain épisode : la MP40, née pendant la Seconde Guerre mondiale.",
    kind: "final"
  }
];

const gold = "#f3c943";
const cream = "#f2f0e4";
const muted = "#d2d5c4";

const GunIllustration = ({scale = 1, progress = 0}) => {
  const sway = Math.sin(progress * Math.PI * 2);
  return (
    <svg width="900" height="430" viewBox="0 0 900 430" style={{
      overflow: "visible",
      transform: `translateX(${sway * 10}px) rotate(${sway * .35}deg) scale(${scale * (1 + sway * .012)})`,
      transformOrigin: "center"
    }}>
      <defs>
        <linearGradient id="steel" x2="0" y2="1">
          <stop stopColor="#e0e0d3"/>
          <stop offset=".38" stopColor="#8d948c"/>
          <stop offset="1" stopColor="#3c453f"/>
        </linearGradient>
        <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>
      <ellipse cx="450" cy="335" rx="390" ry="28" fill="#172018" opacity=".34" filter="url(#shadow)"/>
      <g stroke="#252d27" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round">
        <path d="M112 155 L178 118 L600 118 L678 139 L808 151 L820 190 L689 201 L628 226 L442 224 L404 270 L378 370 L250 365 L265 223 L154 218 L112 196 Z" fill="url(#steel)"/>
        <path d="M158 211 L271 221 L253 355 L377 364 L399 267 L443 220" fill="#303a32"/>
        <path d="M202 136 L600 136 L650 155 L800 165" fill="none" stroke="#e8e5d8" strokeWidth="7"/>
        <path d="M285 230 L355 245 L337 340" fill="none" stroke="#171f19" strokeWidth="9"/>
        <path d="M468 130 L468 210 M500 130 L500 210 M535 130 L535 210" fill="none" stroke="#505a51" strokeWidth="7"/>
      </g>
      <path d="M112 155 L178 118 L600 118 L678 139 L808 151 L820 190 L689 201 L628 226 L442 224 L404 270 L378 370 L250 365 L265 223 L154 218 L112 196 Z" fill="none" stroke="#f0eddd" strokeWidth="5" opacity=".72"/>
      <path d="M280 254 L359 263 L344 344" fill="none" stroke="#aeb5a6" strokeWidth="5" opacity=".55"/>
      <path d="M402 222 Q455 214 476 260 Q485 282 460 293" fill="none" stroke="#242c25" strokeWidth="10"/>
      <circle cx="190" cy="175" r="12" fill="#313a32" stroke="#d5d7c9" strokeWidth="4"/>
      <path d="M805 166 L865 166" stroke="#e0e0d3" strokeWidth="15" strokeLinecap="round"/>
    </svg>
  );
};

const BlueprintArt = ({progress = 0}) => {
  const dash = interpolate(progress, [0, 1], [620, 0]);
  const drift = Math.sin(progress * Math.PI * 2);
  return (
    <svg width="780" height="650" viewBox="0 0 780 650" style={{transform: `translateX(${drift * 9}px) rotate(${drift * .8}deg)`}}>
      <g transform={`translate(${-drift * 12} 0) rotate(-5 370 320)`}>
        <rect x="105" y="65" width="550" height="520" rx="8" fill="#d8d0b5" stroke="#f1e8ce" strokeWidth="8"/>
        <rect x="145" y="108" width="470" height="35" fill="#a69d81"/>
        <path d="M155 190 H590 M155 230 H545 M155 270 H580 M155 310 H520 M155 420 H590 M155 460 H540" stroke="#8b8d7a" strokeWidth="6" opacity=".5"/>
        <path d="M185 365 L235 340 L470 340 L515 358 L595 365 L600 388 L515 398 L465 418 L350 415 L325 460 L250 455 L260 415 L205 410 L185 390 Z" fill="none" stroke="#64705a" strokeWidth="5" strokeDasharray="620" strokeDashoffset={dash}/>
      </g>
      <g fill="none" stroke={gold} strokeWidth="8" opacity=".95">
        <circle cx="570" cy="135" r="66"/>
        <path d="M570 35 V235 M470 135 H670"/>
      </g>
      <path d="M80 560 H690" stroke={gold} strokeWidth="5" strokeDasharray="600" strokeDashoffset={interpolate(progress,[0,1],[600,0])}/>
    </svg>
  );
};

const PartnerArt = ({progress = 0}) => {
  const route = interpolate(progress, [0, .8], [460, 0], {extrapolateRight: "clamp"});
  const pulse = .85 + Math.sin(progress * Math.PI * 4) * .12;
  return (
    <svg width="790" height="650" viewBox="0 0 790 650" style={{transform: `translateY(${Math.sin(progress * Math.PI * 2) * 8}px)`}}>
      <g transform="rotate(-4 390 310)">
        <rect x="110" y="55" width="560" height="540" rx="9" fill="#d8d0b5" stroke="#f1e8ce" strokeWidth="8"/>
        <rect x="150" y="100" width="310" height="30" fill="#a69d81"/>
        <path d="M155 180 H615 M155 220 H560 M155 260 H605 M155 300 H530" stroke="#8b8d7a" strokeWidth="6" opacity=".5"/>
        <rect x="155" y="365" width="190" height="110" fill="#b6ad91"/>
        <path d="M175 420 L225 385 L275 420 L325 385" fill="none" stroke="#68745c" strokeWidth="6"/>
      </g>
      <g fill={cream} fontSize="27" fontWeight="800" letterSpacing="4">
        <text x="105" y="610">ÉTATS-UNIS</text>
        <text x="545" y="610">ISRAËL</text>
      </g>
      <path d="M230 525 C300 430 470 430 555 525" fill="none" stroke={gold} strokeWidth="9" strokeDasharray="460" strokeDashoffset={route}/>
      <circle cx="230" cy="525" r="17" fill={gold}/>
      <circle cx="555" cy="525" r={17 * pulse} fill={gold}/>
    </svg>
  );
};

const YearArt = ({progress = 0}) => {
  const lift = interpolate(progress, [0, .35, 1], [60, 0, -8]);
  return (
    <div style={{display: "flex", alignItems: "center", gap: 24, transform: `translateY(${lift}px)`}}>
      <div style={{background: cream, color: "#46523a", padding: "28px 24px", transform: `rotate(${-4 + progress * 4}deg)`, boxShadow: "0 18px 35px #1c261b55"}}>
        <div style={{fontSize: 42, fontWeight: 900}}>1983</div>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3}}>.357 MAGNUM</div>
        <div style={{fontSize: 18, marginTop: 8}}>MARK I</div>
      </div>
      <div style={{background: "#d8d0b5", color: "#46523a", padding: "28px 24px", transform: `rotate(${4 - progress * 4}deg)`, boxShadow: "0 18px 35px #1c261b55"}}>
        <div style={{fontSize: 42, fontWeight: 900}}>1986</div>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3}}>.44 MAGNUM</div>
        <div style={{fontSize: 18, marginTop: 8}}>ÉVOLUTION</div>
      </div>
    </div>
  );
};

const CalibreArt = ({progress = 0}) => (
  <div style={{display: "flex", alignItems: "center", gap: 28, transform: `translateX(${Math.sin(progress * Math.PI * 2) * 10}px) scale(${.96 + progress * .04})`}}>
    <div style={{fontSize: 220, fontWeight: 900, color: gold, lineHeight: 1, letterSpacing: -16}}>.50</div>
    <div style={{fontSize: 42, fontWeight: 900, color: cream, lineHeight: 1.15, letterSpacing: 2}}>ACTION<br/>EXPRESS</div>
  </div>
);

const FinalArt = ({progress = 0}) => (
  <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
    <div style={{transform: `translateX(${Math.sin(progress * Math.PI * 2) * 7}px)`}}>
      <GunIllustration scale={.72} progress={progress}/>
    </div>
    <div style={{display: "flex", alignItems: "center", gap: 16, transform: `translateY(${interpolate(progress,[0,1],[35,0])}px)`, opacity: interpolate(progress,[0,.3,1],[0,1,1])}}>
      <div style={{border: `2px solid ${gold}`, color: gold, padding: "12px 24px", fontSize: 22, fontWeight: 900, letterSpacing: 4}}>RÉEL</div>
      <div style={{color: muted, fontSize: 24, fontWeight: 900}}>≠</div>
      <div style={{border: "2px solid #d8d0b5", color: cream, padding: "12px 24px", fontSize: 22, fontWeight: 900, letterSpacing: 4}}>JEU</div>
      <div style={{background: gold, color: "#3c4734", padding: "12px 20px", fontSize: 22, fontWeight: 900, letterSpacing: 3}}>MP40</div>
    </div>
  </div>
);

function Art({kind, progress}) {
  const entrance = spring({frame: Math.max(0, progress * 42), fps: 30, config: {damping: 15, stiffness: 90}});
  const floatY = Math.sin(progress * Math.PI * 2) * 13;
  const floatX = Math.cos(progress * Math.PI * 2) * 7;
  const common = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: `translate(${floatX}px,${interpolate(entrance,[0,1],[90,0]) + floatY}px) scale(${interpolate(entrance,[0,1],[.82,1])})`,
    opacity: entrance
  };
  if (kind === "hero") return <div style={{...common, top: "33%"}}><GunIllustration scale={.88} progress={progress}/></div>;
  if (kind === "blueprint") return <div style={{...common, top: "26%"}}><BlueprintArt progress={progress}/></div>;
  if (kind === "partner") return <div style={{...common, top: "24%"}}><PartnerArt progress={progress}/></div>;
  if (kind === "year") return <div style={{...common, top: "38%"}}><YearArt progress={progress}/></div>;
  if (kind === "calibre") return <div style={{...common, top: "39%"}}><CalibreArt progress={progress}/></div>;
  return <div style={{...common, top: "26%"}}><FinalArt progress={progress}/></div>;
}

export const DesertEagleEpisode = ({timeline}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const items = timeline?.segments?.length ? timeline.segments : [];
  let index = items.findIndex((s,i) => seconds >= s.start && (seconds < s.end || (i === items.length - 1 && seconds <= s.end)));
  if (index < 0) index = items.reduce((last,s,i) => seconds >= s.start ? i : last, 0);
  const timing = items[index] || {start: 0, end: timeline?.duration || 40};
  const progress = Math.max(0, Math.min(1, (seconds - timing.start) / Math.max(.01, timing.end - timing.start)));
  const data = scenes[index] || scenes[0];
  const fade = interpolate(progress, [0,.10,.90,1], [0,1,1,0], {extrapolateLeft:"clamp", extrapolateRight:"clamp"});
  const drift = Math.sin(frame / 34) * 9;
  const phrase = items[index]?.narration || data.caption;
  const matchAt = phrase.toLowerCase().indexOf(data.key.toLowerCase());
  const before = matchAt >= 0 ? phrase.slice(0, matchAt) : phrase;
  const after = matchAt >= 0 ? phrase.slice(matchAt + data.key.length) : "";

  return (
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 42%, #65704e 0%, #505b40 54%, #3c4734 100%)", color:cream, fontFamily:"Arial, sans-serif", overflow:"hidden"}}>
      <AbsoluteFill style={{opacity:.12, backgroundImage:"radial-gradient(#d9dfc0 0.7px, transparent .7px)", backgroundSize:"7px 7px"}}/>
      <div style={{position:"absolute",top:76,left:78,right:78,display:"flex",justifyContent:"space-between",fontSize:23,fontWeight:700,letterSpacing:5,color:"#d7dac8",opacity:.76}}>
        <span>EURO / ARMS</span><span>ARCHIVES · 001</span>
      </div>
      <div style={{position:"absolute",top:235,left:80,right:80,textAlign:"center",opacity:fade,transform:`translateY(${drift}px)`}}>
        <div style={{fontSize:27,letterSpacing:5,fontWeight:700,color:gold,marginBottom:24}}>{data.eyebrow}</div>
        <div style={{fontSize:66,lineHeight:1.08,fontWeight:900,letterSpacing:-2,textTransform:"uppercase"}}>{data.title}</div>
        <div style={{fontSize:30,letterSpacing:6,fontWeight:700,marginTop:22,color:"#d9ddcf"}}>{data.sub}</div>
      </div>
      <Art kind={data.kind} progress={progress}/>
      <div style={{position:"absolute",left:95,right:95,bottom:255,textAlign:"center",opacity:fade}}>
        <div style={{height:3,background:"rgba(240,240,220,.24)",marginBottom:34}}>
          <div style={{height:3,width:`${(index + progress) / 6 * 100}%`,background:gold}}/>
        </div>
        <div style={{fontSize:37,lineHeight:1.48,fontWeight:600,color:cream}}>
          {before}<span style={{color:gold,fontWeight:900}}>{matchAt >= 0 ? phrase.slice(matchAt, matchAt + data.key.length) : ""}</span>{after}
        </div>
      </div>
      <div style={{position:"absolute",bottom:90,left:80,right:80,display:"flex",justifyContent:"space-between",fontSize:20,letterSpacing:3,color:"#d4d8c7",opacity:.65}}>
        <span>HISTOIRE RÉELLE</span><span>{String(index + 1).padStart(2,"0")} / 06</span>
      </div>
    </AbsoluteFill>
  );
};
