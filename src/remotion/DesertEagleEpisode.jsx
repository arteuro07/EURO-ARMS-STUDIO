import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

const scenes = [
  {eyebrow:"L'ARME QUI A MARQUÉ LES ESPRITS",title:"UNE LÉGENDE",sub:"MAIS UNE HISTOIRE BIEN RÉELLE",key:"Free Fire",caption:"Sur Free Fire, tu utilises cette arme sans connaître son histoire… Je vais te la raconter.",kind:"hero"},
  {eyebrow:"À LA FIN DES ANNÉES 1970",title:"UNE IDÉE HORS NORME",sub:"MAGNUM RESEARCH",key:"années soixante-dix",caption:"À la fin des années soixante-dix, Magnum Research travaille sur l’idée d’un pistolet semi-automatique de très gros calibre.",kind:"archive"},
  {eyebrow:"UN PROJET ATYPIQUE",title:"UNE CONCEPTION INHABITUELLE",sub:"UNE APPROCHE TECHNIQUE SINGULIÈRE",key:"conception inhabituelle",caption:"Le projet prend forme autour d’une conception inhabituelle, avec un système de fonctionnement inspiré des armes à emprunt de gaz.",kind:"diagram"},
  {eyebrow:"1983 · PREMIÈRE COMMERCIALISATION",title:"LE MARK I",sub:".357 MAGNUM",key:"1983",caption:"Le premier modèle de production, le Mark I en .357 Magnum, arrive sur le marché en 1983.",kind:"year"},
  {eyebrow:"LE MILIEU DES ANNÉES 1990",title:".50 ACTION EXPRESS",sub:"UNE NOUVELLE DIMENSION",key:".50 Action Express",caption:"Plus tard, la version .50 Action Express contribue à sa réputation de pistolet spectaculaire.",kind:"calibre"},
  {eyebrow:"RÉEL ≠ FICTION",title:"UNE ICÔNE POPULAIRE",sub:"L'HISTOIRE AVANT LE JEU",key:"histoire",caption:"Dans le jeu, son image est devenue iconique. Mais son histoire, elle, a commencé dans l’ingénierie bien réelle.",kind:"final"}
];

const gold="#f3c943", cream="#f2f0e4", muted="#d2d5c4";
const GunIllustration=({scale=1,progress=0})=> <svg width="900" height="430" viewBox="0 0 900 430" style={{overflow:"visible",transform:`translateX(${Math.sin(progress*Math.PI*2)*10}px) scale(${scale*(1+Math.sin(progress*Math.PI*2)*.012)})`,transformOrigin:"center"}}>
  <defs><linearGradient id="steel" x2="0" y2="1"><stop stopColor="#e0e0d3"/><stop offset=".38" stopColor="#8d948c"/><stop offset="1" stopColor="#3c453f"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter></defs>
  <ellipse cx="450" cy="335" rx="390" ry="28" fill="#172018" opacity=".34" filter="url(#shadow)"/>
  <g stroke="#252d27" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round">
    <path d="M112 155 L178 118 L600 118 L678 139 L808 151 L820 190 L689 201 L628 226 L442 224 L404 270 L378 370 L250 365 L265 223 L154 218 L112 196 Z" fill="url(#steel)"/>
    <path d="M158 211 L271 221 L253 355 L377 364 L399 267 L443 220" fill="#303a32"/>
    <path d="M202 136 L600 136 L650 155 L800 165" fill="none" stroke="#e8e5d8" strokeWidth="7"/>
    <path d="M285 230 L355 245 L337 340" fill="none" stroke="#171f19" strokeWidth="9"/>
    <path d="M468 130 L468 210 M500 130 L500 210" fill="none" stroke="#505a51" strokeWidth="8"/>
  </g>
  <path d="M112 155 L178 118 L600 118 L678 139 L808 151 L820 190 L689 201 L628 226 L442 224 L404 270 L378 370 L250 365 L265 223 L154 218 L112 196 Z" fill="none" stroke="#f0eddd" strokeWidth="5" opacity=".72"/>
  <path d="M280 254 L359 263 L344 344" fill="none" stroke="#aeb5a6" strokeWidth="5" opacity=".55"/>
  <circle cx="190" cy="175" r="12" fill="#313a32" stroke="#d5d7c9" strokeWidth="4"/>
  <path d="M805 166 L865 166" stroke="#e0e0d3" strokeWidth="15" strokeLinecap="round"/>
</svg>;

const ArchiveArt=({progress=0})=> <svg width="760" height="700" viewBox="0 0 760 700" style={{transform:`translateY(${Math.sin(progress*Math.PI*2)*10}px) rotate(${Math.sin(progress*Math.PI*2)*.7}deg)`}}>
  <g transform="rotate(-7 360 350)"><rect x="100" y="80" width="520" height="550" rx="8" fill="#d8d0b5" stroke="#f1e8ce" strokeWidth="8"/><rect x="140" y="125" width="440" height="42" fill="#a69d81"/><path d="M160 230 H550 M160 270 H520 M160 310 H545 M160 350 H490 M160 440 H550 M160 480 H515" stroke="#7e806e" strokeWidth="7" opacity=".55"/><rect x="165" y="385" width="235" height="32" fill="#8d8d78"/><path d="M170 540 L520 540" stroke="#8d8d78" strokeWidth="5"/></g>
  <g fill="none" stroke={gold} strokeWidth="8"><circle cx="565" cy="160" r="75"/><path d="M565 45 V275 M450 160 H680"/></g>
</svg>;

const DiagramArt=({progress=0})=> <svg width="760" height="650" viewBox="0 0 760 650" fill="none" style={{transform:`rotate(${Math.sin(progress*Math.PI*2)*2.2}deg) scale(${1+Math.sin(progress*Math.PI*2)*.012})`}}>
  <g stroke="#e7e5d7" strokeWidth="13" opacity=".9"><circle cx="330" cy="300" r="190"/><circle cx="330" cy="300" r="128"/><circle cx="330" cy="300" r="64"/><path d="M330 75 V525 M105 300 H555"/></g>
  <g stroke={gold} strokeWidth="12"><path d="M330 110 L520 300 L330 490 L140 300 Z"/><circle cx="330" cy="300" r="24" fill={gold}/></g>
  <g fill={cream} fontSize="28" fontFamily="monospace"><text x="565" y="190">PRINCIPE</text><text x="565" y="230">ILLUSTRÉ</text></g>
</svg>;

const YearArt=()=> <div style={{fontSize:260,fontWeight:900,color:gold,letterSpacing:-18,lineHeight:1}}>1983</div>;
const CalibreArt=()=> <div style={{display:"flex",alignItems:"center",gap:28}}><div style={{fontSize:210,fontWeight:900,color:gold,lineHeight:1}}>.50</div><div style={{fontSize:42,fontWeight:800,color:cream,lineHeight:1.2}}>ACTION<br/>EXPRESS</div></div>;

function Art({kind,progress}) {
  const entrance=spring({frame:Math.max(0,progress*42),fps:30,config:{damping:15,stiffness:90}});
  const floatY=Math.sin(progress*Math.PI*2)*13; const floatX=Math.cos(progress*Math.PI*2)*7;
  const common={position:"absolute",left:0,right:0,top:"31%",display:"flex",justifyContent:"center",alignItems:"center",transform:`translate(${floatX}px,${interpolate(entrance,[0,1],[90,0])+floatY}px) scale(${interpolate(entrance,[0,1],[.82,1])})`,opacity:entrance};
  if(kind==="hero"||kind==="final") return <div style={{...common,top:"32%"}}><GunIllustration scale={kind==="final"?.76:.88} progress={progress}/></div>;
  if(kind==="archive") return <div style={{...common,top:"25%"}}><ArchiveArt progress={progress}/></div>;
  if(kind==="diagram") return <div style={{...common,top:"26%"}}><DiagramArt progress={progress}/></div>;
  if(kind==="year") return <div style={{...common,top:"39%"}}><YearArt/></div>;
  return <div style={{...common,top:"39%"}}><CalibreArt/></div>;
}

export const DesertEagleEpisode=({timeline})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const seconds=frame/fps;
  const items=timeline?.segments?.length?timeline.segments:[];
  let index=items.findIndex((s,i)=>seconds>=s.start&&(seconds<s.end||i===items.length-1&&seconds<=s.end));
  if(index<0) index=items.reduce((last,s,i)=>seconds>=s.start?i:last,0);
  const timing=items[index]||{start:0,end:timeline?.duration||40};
  const progress=Math.max(0,Math.min(1,(seconds-timing.start)/Math.max(.01,timing.end-timing.start)));
  const data=scenes[index]||scenes[0];
  const fade=interpolate(progress,[0,.12,.88,1],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const drift=Math.sin(frame/34)*9;
  const phrase=data.caption;
  const before=phrase.toLowerCase().split(data.key.toLowerCase())[0];
  const after=phrase.slice(before.length+data.key.length);
  return <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 42%, #65704e 0%, #505b40 54%, #3c4734 100%)",color:cream,fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
    <AbsoluteFill style={{opacity:.12,backgroundImage:"radial-gradient(#d9dfc0 0.7px, transparent .7px)",backgroundSize:"7px 7px"}}/>
    <div style={{position:"absolute",top:76,left:78,right:78,display:"flex",justifyContent:"space-between",fontSize:23,fontWeight:700,letterSpacing:5,color:"#d7dac8",opacity:.76}}><span>EURO / ARMS</span><span>ARCHIVES · 001</span></div>
    <div style={{position:"absolute",top:250,left:80,right:80,textAlign:"center",opacity:fade,transform:`translateY(${drift}px)`}}>
      <div style={{fontSize:27,letterSpacing:5,fontWeight:700,color:gold,marginBottom:24}}>{data.eyebrow}</div>
      <div style={{fontSize:68,lineHeight:1.08,fontWeight:900,letterSpacing:-2,textTransform:"uppercase"}}>{data.title}</div>
      <div style={{fontSize:31,letterSpacing:7,fontWeight:700,marginTop:22,color:"#d9ddcf"}}>{data.sub}</div>
    </div>
    <Art kind={data.kind} progress={progress}/>
    <div style={{position:"absolute",left:95,right:95,bottom:260,textAlign:"center",opacity:fade}}>
      <div style={{height:3,background:"rgba(240,240,220,.24)",marginBottom:34}}><div style={{height:3,width:`${(index+progress)/6*100}%`,background:gold}}/></div>
      <div style={{fontSize:39,lineHeight:1.5,fontWeight:600,color:cream}}>{before}<span style={{color:gold,fontWeight:900}}>{data.key}</span>{after}</div>
    </div>
    <div style={{position:"absolute",bottom:90,left:80,right:80,display:"flex",justifyContent:"space-between",fontSize:20,letterSpacing:3,color:"#d4d8c7",opacity:.65}}><span>HISTOIRE RÉELLE</span><span>{String(index+1).padStart(2,"0")} / 06</span></div>
  </AbsoluteFill>;
};
