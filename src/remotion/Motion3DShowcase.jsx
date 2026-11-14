import React from "react";
import {ThreeCanvas} from "@remotion/three";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const orbiters = Array.from({length: 18}, (_, i) => ({
  angle: (i / 18) * Math.PI * 2,
  radius: 2.15 + (i % 3) * 0.16,
  size: 0.035 + (i % 4) * 0.012,
}));

/**
 * A deterministic 3D motion test.
 * Every moving value is derived from Remotion's frame, so rendering is
 * reproducible and can be scrubbed without relying on a realtime clock.
 */
export const Motion3DShowcase = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const seconds = frame / fps;
  const cameraX = Math.sin(seconds * 0.42) * 1.25;
  const cameraY = 1.15 + Math.sin(seconds * 0.28) * 0.28;
  const titleOpacity = interpolate(frame, [0, 24, 320, 359], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: "#071019"}}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{fov: 42, position: [cameraX, cameraY, 9.2]}}
        style={{backgroundColor: "#071019"}}
      >
        <color attach="background" args={["#071019"]} />
        <fog attach="fog" args={["#071019", 8, 18]} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 6, 5]} intensity={2.1} color="#d8eaff" />
        <pointLight position={[-4, 1, 2]} intensity={38} color="#1e9dff" />
        <pointLight position={[3, -2, -3]} intensity={26} color="#f2a64a" />

        <group rotation={[seconds * 0.12, seconds * 0.22, seconds * 0.06]}>
          <mesh rotation={[seconds * 0.32, seconds * 0.55, seconds * 0.18]}>
            <torusKnotGeometry args={[1.05, 0.28, 180, 24, 2, 5]} />
            <meshPhysicalMaterial
              color="#b9c9d8"
              metalness={0.88}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.12}
            />
          </mesh>
          <mesh rotation={[seconds * -0.18, seconds * 0.24, 0.35]}>
            <torusGeometry args={[1.72, 0.025, 12, 160]} />
            <meshStandardMaterial color="#e8a94e" metalness={0.8} roughness={0.24} />
          </mesh>
          <mesh rotation={[0.8, seconds * -0.2, seconds * 0.1]}>
            <torusGeometry args={[2.02, 0.012, 8, 160]} />
            <meshStandardMaterial color="#4ba9e8" emissive="#123c60" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {orbiters.map((item, i) => {
          const a = item.angle + seconds * (i % 2 === 0 ? 0.55 : -0.38);
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * item.radius,
                Math.sin(a * 1.3 + seconds * 0.25) * 0.7,
                Math.sin(a) * item.radius * 0.55,
              ]}
              scale={item.size * (1 + Math.sin(seconds * 2 + i) * 0.2)}
            >
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color={i % 3 === 0 ? "#e8a94e" : "#8bc9ed"} metalness={0.72} roughness={0.28} />
            </mesh>
          );
        })}

        <mesh position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5.8, 96]} />
          <meshStandardMaterial color="#0b1b29" metalness={0.38} roughness={0.72} />
        </mesh>
        <gridHelper args={[12, 36, "#28516b", "#142d40"]} position={[0, -2.53, 0]} />
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 150,
          opacity: titleOpacity,
          pointerEvents: "none",
          color: "#f3f5f7",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{fontSize: 24, letterSpacing: 9, color: "#e8a94e", fontWeight: 700}}>
          EURO MOTION STUDIO
        </div>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: 2, marginTop: 22}}>
          TRUE 3D MOTION
        </div>
        <div style={{fontSize: 23, letterSpacing: 4, marginTop: 14, color: "#9eb4c6"}}>
          CAMERA • LIGHT • DEPTH • ANIMATION
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
