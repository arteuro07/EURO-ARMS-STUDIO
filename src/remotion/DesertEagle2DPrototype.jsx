import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD = "#d9ad54";
const PAPER = "#e8dfc9";
const INK = "#17201e";
const clamp = {extrapolateLeft:"clamp", extrapolateRight:"clamp"};

const dust = Array.from({length:34}, (_,i) => ({
  x:(i*173+47)%1080,
  y:(i*293+91)%1920,
  r:1+(i%3),
  speed:.35+(i%5)*.13,
}));

const DesertEagleDrawing = ({progress=0, scale=1}) => {
  const sway = Math.sin(progress*Math.PI*2);
  return (
    <svg viewBox="0 0 1120 520" width="100%" height="100%" style={{overflow:"visible", transform:`translateY(${sway*5}px) scale(${scale})`, transformOrigin:"50% 50%"}}>
      <defs>
        <linearGradient id="de-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0eadb"/>
          <stop offset=".22" stopColor="#b7b6a9"/>
          <stop offset=".55" stopColor="#727d78"/>
          <stop offset="1" stopColor="#303b39"/>
        </linearGradient>
        <linearGradient id="de-grip" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#68706a"/><stop offset="1" stopColor="#202a28"/>
        </linearGradient>
        <filter id="de-shadow"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <ellipse cx="560" cy="433" rx="455" ry="32" fill="#000" opacity=".42" filter="url(#de-shadow)"/>
      <g stroke="#17201e" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round">
        <path d="M125 158 L174 111 L690 111 L744 130 L936 143 L1000 160 L1004 209 L936 222 L782 223 L730 252 L534 250 L480 298 L445 420 L300 416 L319 256 L202 250 L145 221 Z" fill="url(#de-steel)"/>
        <path d="M319 256 L480 298 L445 420 L300 416 Z" fill="url(#de-grip)"/>
        <path d="M500 248 Q568 248 592 291 Q605 318 576 339 L548 343" fill="none" stroke="#17201e" strokeWidth="15"/>
        <path d="M539 251 Q555 266 552 290" fill="none" stroke="#d9ad54" strokeWidth="5"/>
        <path d="M176 111 L690 111 L744 130 L936 143" fill="none" stroke="#fff4df" strokeWidth="8" opacity=".9"/>
        <path d="M208 132 L670 132" fill="none" stroke="#4a5652" strokeWidth="7"/>
        <path d="M744 145 L744 213 M765 148 L765 214 M786 151 L786 215 M807 153 L807 215" fill="none" stroke="#4b5652" strokeWidth="7"/>
        <path d="M330 276 L422 296 L394 399" fill="none" stroke="#aeb5aa" strokeWidth="5" opacity=".7"/>
        <path d="M330 294 L411 312 M325 313 L406 331 M320 332 L400 350 M315 351 L394 369" fill="none" stroke="#111a18" strokeWidth="5" opacity=".7"/>
        <path d="M842 162 L968 173" fill="none" stroke="#f1ead9" strokeWidth="5"/>
      </g>
      <path d="M125 158 L174 111 L690 111 L744 130 L936 143 L1000 160 L1004 209 L936 222 L782 223 L730 252 L534 250 L480 298 L445 420 L300 416 L319 256 L202 250 L145 221 Z" fill="none" stroke="#f2ead8" strokeWidth="4" opacity=".8"/>
      <g fill="#d9ad54" stroke="#17201e" strokeWidth="5">
        <circle cx="222" cy="180" r="10"/><circle cx="701" cy="174" r="9"/><circle cx="354" cy="275" r="8"/>
      </g>
      <path d="M1000 184 H1070" stroke="#d9ad54" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  );
};

const FrameLines = ({frame}) => (
  <AbsoluteFill style={{pointerEvents:"none",opacity:.16}}>
    {Array.from({length:18},(_,i)=><div key={i} style={{position:"absolute",left:0,right:0,top:i*112,height:1,background:"#d9c9a7",transform:`translateX(${Math.sin(frame/70+i)*18}px)`}}/>)}
  </AbsoluteFill>
);

const Dust = ({frame}) => (
  <AbsoluteFill style={{pointerEvents:"none"}}>
    {dust.map((p,i)=><i key={i} style={{position:"absolute",left:p.x,top:(p.y-frame*p.speed+2400)%1920,width:p.r,height:p.r,borderRadius:"50%",background:"#e8dfc9",opacity:.12+(i%4)*.035}}/>)}
  </AbsoluteFill>
);

const Blueprint = ({frame, local}) => {
  const reveal = interpolate(local,[0,105],[900,0],clamp);
  const paperX = interpolate(local,[0,24,65],[1250,0,-18],{...clamp,easing:Easing.out(Easing.cubic)});
  const paperRotate = interpolate(local,[0,24,150],[7,-1,1],clamp);
  const pulse = .7+Math.sin(frame/13)*.2;
  return (
    <AbsoluteFill>
      <div style={{position:"absolute",inset:"240px 82px 360px",background:"#d8ceb5",boxShadow:"0 36px 90px #0008",border:"2px solid #f1e8d4",transform:`translateX(${paperX}px) rotate(${paperRotate}deg)`,padding:42,color:"#39433b"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:20,letterSpacing:5,fontWeight:900,opacity:.7}}><span>MAGNUM RESEARCH</span><span>ARCHIVE / 001</span></div>
        <div style={{height:2,background:"#758071",marginTop:28,opacity:.5}}/>
        <div style={{fontSize:64,fontWeight:900,letterSpacing:-2,marginTop:36,lineHeight:1}}>UN PROJET</div>
        <div style={{fontSize:64,fontWeight:900,letterSpacing:-2,lineHeight:1}}>HORS NORME</div>
        <svg viewBox="0 0 1000 570" style={{width:"100%",height:590,marginTop:20,overflow:"visible"}}>
          <g fill="none" stroke="#536354" strokeWidth="5">
            <path d="M95 240 L140 190 L650 190 L710 215 L900 230 L930 275 L850 300 L720 300 L670 330 L480 330 L430 410 L285 405 L300 330 L170 320 L105 285 Z" strokeDasharray="900" strokeDashoffset={reveal}/>
            <path d="M300 330 L430 410 L400 520 L270 510 Z" strokeDasharray="900" strokeDashoffset={reveal}/>
            <path d="M120 125 H920 M120 155 H780 M120 455 H900" opacity=".25"/>
            <path d="M95 190 V410 M930 190 V410" strokeDasharray="8 12" opacity=".5"/>
          </g>
          <g fill="none" stroke={GOLD} strokeWidth="5" opacity={pulse}>
            <circle cx="745" cy="205" r="58"/><path d="M745 120 V290 M660 205 H830"/>
          </g>
        </svg>
        <div style={{position:"absolute",bottom:44,left:44,right:44,display:"flex",justifyContent:"space-between",fontSize:18,letterSpacing:4,fontWeight:900,opacity:.65}}><span>ÉTUDE HISTORIQUE</span><span>1979 — 1981</span></div>
      </div>
      <div style={{position:"absolute",left:92,bottom:250,color:PAPER,fontSize:24,letterSpacing:5,fontWeight:800,opacity:interpolate(local,[55,82],[0,1],clamp)}}>UNE CONCEPTION AMÉRICAINE</div>
    </AbsoluteFill>
  );
};

export const DesertEagle2DPrototype = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = Math.min(2,Math.floor(frame/150));
  const local = frame-scene*150;
  const progress = local/149;
  const camera = scene===0
    ? interpolate(local,[0,149],[1.12,1],clamp)
    : scene===1
      ? interpolate(local,[0,149],[1.02,1.13],clamp)
      : interpolate(local,[0,149],[1.18,1],clamp);
  const titleOpacity = interpolate(local,[0,20,125,149],[0,1,1,0],clamp);
  const gunX = scene===0
    ? interpolate(local,[0,40,149],[1220,480,30],clamp)
    : scene===2
      ? interpolate(local,[0,35,149],[1150,70,0],clamp)
      : 0;
  const gunY = scene===0 ? 810 : scene===2 ? 810 : 1120;
  const bg = scene===1 ? "#28352f" : "#111b1b";
  const kicker = scene===0 ? "EURO / ARMS  —  ARCHIVES" : scene===1 ? "LES ORIGINES" : "DESERT EAGLE";
  const headline = scene===0 ? "LE DESERT EAGLE" : scene===1 ? "UNE IDÉE\nAUDACIEUSE" : "UNE SILHOUETTE\nINSTANTANÉE";
  const subtitle = scene===0 ? "L'HISTOIRE D'UNE ICÔNE" : scene===1 ? "MAGNUM RESEARCH · FIN DES ANNÉES 1970" : "BIEN PLUS QU'UNE ARME DE FICTION";
  const sceneFade = interpolate(local,[0,10,139,149],[0,1,1,0],clamp);
  const cameraDrift = Math.sin(frame/52)*12;

  return (
    <AbsoluteFill style={{background:bg,color:PAPER,fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
      <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 48%, #526052 0%, #27352f 42%, #101918 100%)",opacity:scene===1?.95:.8}}/>
      <FrameLines frame={frame}/>
      <Dust frame={frame}/>
      <AbsoluteFill style={{transform:`scale(${camera}) translateY(${cameraDrift}px)`,transformOrigin:"50% 50%"}}>
        {scene===1 ? <Blueprint frame={frame} local={local}/> : (
          <>
            <div style={{position:"absolute",left:70,right:70,top:245,opacity:titleOpacity*sceneFade,transform:`translateY(${interpolate(local,[0,35],[55,0],clamp)}px)`}}>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:7,color:GOLD,marginBottom:30}}>{kicker}</div>
              <div style={{fontSize:scene===0?82:72,fontWeight:900,lineHeight:1.02,letterSpacing:-3,whiteSpace:"pre-line",textShadow:"0 12px 38px #0008"}}>{headline}</div>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:4,marginTop:30,color:"#c4c9ba"}}>{subtitle}</div>
            </div>
            <div style={{position:"absolute",left:0,right:0,top:gunY, height:540,transform:`translateX(${gunX}px) rotate(${Math.sin(progress*Math.PI*2)*.5}deg)`,filter:"drop-shadow(0 40px 35px #0009)"}}>
              <DesertEagleDrawing progress={progress} scale={scene===0?.96:1.02}/>
            </div>
          </>
        )}
      </AbsoluteFill>
      <div style={{position:"absolute",left:76,right:76,bottom:106,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:17,fontWeight:800,letterSpacing:4,color:"#c5cbbb",opacity:.68}}>
        <span>EURO MOTION STUDIO</span>
        <span>2D MOTION TEST · {String(Math.floor(frame/fps)).padStart(2,"0")}s</span>
      </div>
      <div style={{position:"absolute",left:76,right:76,bottom:82,height:2,background:"#e8dfc922"}}>
        <div style={{height:2,width:`${(frame/449)*100}%`,background:GOLD}}/>
      </div>
    </AbsoluteFill>
  );
};
