import React from "react";
import {ThreeCanvas} from "@remotion/three";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const chapters = [
  {date:"FIN DES ANNÉES 1970",title:"UNE IDÉE AUDACIEUSE",line:"Un projet américain prend forme.",accent:"#e9b35b"},
  {date:"1980 — 1981",title:"DU BREVET AU PROTOTYPE",line:"Le concept devient un véritable projet.",accent:"#7fc5e8"},
  {date:"1983",title:"LES PREMIERS MODÈLES",line:"Le Mark I apparaît en .357 Magnum.",accent:"#e9b35b"},
  {date:"1986",title:"UNE NOUVELLE ÉTAPE",line:"Le .44 Magnum rejoint la gamme.",accent:"#7fc5e8"},
  {date:"MILIEU DES ANNÉES 1990",title:"LE MARK XIX",line:"Le .50 Action Express marque une nouvelle époque.",accent:"#e9b35b"},
];

const dust = Array.from({length:72}, (_,i)=>({
  x: Math.sin(i*91.7)*4.6,
  y: ((i*37)%97)/16-2.8,
  z: Math.cos(i*17.3)*2.4,
  size: 0.012 + (i%5)*0.006,
}));

function MuseumArtifact({seconds, chapter}) {
  const yaw = seconds*0.34 + chapter*0.22;
  const lift = Math.sin(seconds*1.3)*0.09;
  return (
    <group position={[0,0.38+lift,0]} rotation={[0,yaw,0]}>
      {/* Stylized museum silhouette: an artistic shape, not a functional model. */}
      <mesh castShadow position={[0,0.35,0]}>
        <boxGeometry args={[2.45,0.34,0.42]} />
        <meshPhysicalMaterial color="#9da9ad" metalness={0.9} roughness={0.24} clearcoat={0.9}/>
      </mesh>
      <mesh castShadow position={[0.05,0.61,0]}>
        <boxGeometry args={[1.72,0.18,0.46]} />
        <meshStandardMaterial color="#d5d9d4" metalness={0.86} roughness={0.2}/>
      </mesh>
      <mesh castShadow position={[1.62,0.37,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.105,0.105,0.95,32]} />
        <meshStandardMaterial color="#59666c" metalness={0.92} roughness={0.19}/>
      </mesh>
      <mesh castShadow position={[-0.72,-0.34,0]} rotation={[0,0,0.18]}>
        <boxGeometry args={[0.55,1.12,0.39]} />
        <meshStandardMaterial color="#343f45" metalness={0.56} roughness={0.38}/>
      </mesh>
      <mesh position={[-0.72,-0.54,0.215]} rotation={[0,0,0.18]}>
        <boxGeometry args={[0.43,0.78,0.025]} />
        <meshStandardMaterial color="#b18b55" metalness={0.48} roughness={0.34}/>
      </mesh>
      <mesh position={[0.05,0.8,0]}>
        <boxGeometry args={[0.82,0.045,0.48]}/>
        <meshStandardMaterial color="#e6b65f" metalness={0.75} roughness={0.24} emissive="#4c2d0d" emissiveIntensity={0.16}/>
      </mesh>
    </group>
  );
}

function Pedestal({seconds}) {
  return (
    <group position={[0,-1.12,0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.75,1.92,0.32,96]}/>
        <meshStandardMaterial color="#172633" metalness={0.7} roughness={0.34}/>
      </mesh>
      <mesh position={[0,-0.2,0]}>
        <cylinderGeometry args={[1.55,1.72,0.16,96]}/>
        <meshStandardMaterial color="#b18b55" metalness={0.82} roughness={0.25}/>
      </mesh>
      <mesh position={[0,0.17,0]}>
        <torusGeometry args={[1.72,0.025,12,96]}/>
        <meshStandardMaterial color="#f0c878" emissive="#8b5d22" emissiveIntensity={0.5}/>
      </mesh>
      <mesh position={[0,0.38,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[1.7,96]}/>
        <meshStandardMaterial color="#263845" metalness={0.5} roughness={0.45}/>
      </mesh>
    </group>
  );
}

export const DesertEagleHistory3D = () => {
  const frame = useCurrentFrame();
  const {fps,width,height} = useVideoConfig();
  const seconds = frame/fps;
  const chapter = Math.min(chapters.length-1,Math.floor(frame/90));
  const local = (frame%90)/90;
  const item = chapters[chapter];
  const cameraX = Math.sin(seconds*0.32)*1.05 + (chapter-2)*0.08;
  const cameraY = 1.45 + Math.sin(seconds*0.22)*0.16;
  const cameraZ = 8.8 - Math.sin(local*Math.PI)*0.75;
  const fade = interpolate(frame%90,[0,12,76,89],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const progress = frame/450;

  return (
    <AbsoluteFill style={{backgroundColor:"#080f17",fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
      <ThreeCanvas width={width} height={height} camera={{fov:39,position:[cameraX,cameraY,cameraZ]}} shadows>
        <color attach="background" args={["#080f17"]}/>
        <fog attach="fog" args={["#080f17",8,17]}/>
        <ambientLight intensity={0.48}/>
        <directionalLight castShadow position={[3,6,5]} intensity={2.2} color="#dceaff"/>
        <spotLight position={[-4,5,3]} angle={0.55} penumbra={0.7} intensity={75} color="#e7b15e"/>
        <pointLight position={[4,1,-2]} intensity={34} color="#287eaf"/>
        <group rotation={[0,Math.sin(seconds*0.16)*0.08,0]}>
          <MuseumArtifact seconds={seconds} chapter={chapter}/>
          <Pedestal seconds={seconds}/>
          <mesh position={[0,1.18,-0.12]} rotation={[0,0,seconds*0.12]}>
            <torusGeometry args={[2.15,0.018,10,128]}/>
            <meshStandardMaterial color="#4a9cc6" emissive="#174b6a" emissiveIntensity={0.8}/>
          </mesh>
          <mesh position={[0,1.18,-0.16]} rotation={[Math.PI/2,0,seconds*-0.09]}>
            <torusGeometry args={[2.42,0.012,8,128]}/>
            <meshStandardMaterial color="#d5a65c" emissive="#68431c" emissiveIntensity={0.6}/>
          </mesh>
        </group>
        {dust.map((p,i)=>(
          <mesh key={i} position={[p.x, p.y+Math.sin(seconds*0.55+i)*0.08, p.z]} scale={p.size}>
            <sphereGeometry args={[1,8,8]}/>
            <meshBasicMaterial color={i%4===0?"#e8bd76":"#8bbbd2"} transparent opacity={0.5}/>
          </mesh>
        ))}
        <mesh position={[0,-1.62,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
          <circleGeometry args={[6,96]}/>
          <meshStandardMaterial color="#0d1c28" metalness={0.34} roughness={0.62}/>
        </mesh>
        <gridHelper args={[12,36,"#23465c","#122a3a"]} position={[0,-1.6,0]}/>
      </ThreeCanvas>

      <AbsoluteFill style={{padding:"105px 76px 90px",pointerEvents:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:20,fontWeight:700,letterSpacing:5,color:"#b7c6ce",opacity:0.78}}>
          <span>EURO / ARMS</span><span>ARCHIVES · 001</span>
        </div>
        <div style={{position:"absolute",top:300,left:76,right:76,textAlign:"center",opacity:fade,transform:`translateY(${interpolate(local,[0,0.5,1],[24,0,-12])}px)`}}>
          <div style={{fontSize:25,letterSpacing:6,fontWeight:800,color:item.accent,marginBottom:20}}>{item.date}</div>
          <div style={{fontSize:58,lineHeight:1.08,fontWeight:900,letterSpacing:-1,color:"#f1f3ef",textShadow:"0 5px 28px #0009"}}>{item.title}</div>
          <div style={{fontSize:25,letterSpacing:1.2,color:"#c1d0d7",marginTop:20}}>{item.line}</div>
        </div>
        <div style={{position:"absolute",left:76,right:76,bottom:90}}>
          <div style={{height:3,background:"#ffffff26",marginBottom:22}}>
            <div style={{height:3,width:`${progress*100}%`,background:"#e9b35b"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:18,letterSpacing:4,color:"#aebdc5"}}>
            <span>HISTOIRE · DOCUMENTAIRE</span><span>{String(chapter+1).padStart(2,"0")} / 05</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
