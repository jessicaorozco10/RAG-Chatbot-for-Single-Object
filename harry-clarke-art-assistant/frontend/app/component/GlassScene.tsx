"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sky,
  useGLTF,
  useTexture,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";

/* loading overlay with progress indicator */
function LoadingOverlay() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setReady(true), 400);
      return () => clearTimeout(t);
    }
  }, [progress]);

  if (ready) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#333333",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid rgba(0,0,0,0.1)",
          borderTop: "4px solid #333333",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontSize: "20px", margin: 0 }}>🏛️ Preparing the gallery...</p>
      <p style={{ fontSize: "14px", opacity: 0.6, marginTop: "8px" }}>
        Polishing glass panels • Adjusting lighting
      </p>
      <p style={{ fontSize: "12px", opacity: 0.4, marginTop: "12px" }}>
        {Math.round(progress)}% loaded
      </p>
    </div>
  );
}

/* glass panel */
function GlassModel({ index }: { index: number }) {
  const { scene } = useGLTF("/assets/Untitled.glb");
  const textures = useTexture([
    "/assets/panel1.png",
    "/assets/panel2.png",
    "/assets/panel3.png",
    "/assets/panel4.png",
    "/assets/panel5.png",
    "/assets/panel6.png",
    "/assets/panel7.png",
    "/assets/panel8.png",
  ]);

  textures.forEach((t) => {
    t.flipY = false;
    t.center.set(0.5, 0.5);
    t.rotation = -Math.PI / 2;
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshPhysicalMaterial({
        map: textures[index],
        transparent: true,
        transmission: 1,
        thickness: 0.05,
        roughness: 0.05,
        clearcoat: 1,
        reflectivity: 0.6,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [scene, textures, index]);

  return <primitive object={scene} />;
}

/* slider for time of day control */
function TimeSlider({
  time,
  setTime,
}: {
  time: number;
  setTime: (val: number) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        zIndex: 10,
      }}
    >
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
        style={{
          width: "100%",
          height: "12px",
          borderRadius: "6px",
          appearance: "none",
          background:
            "linear-gradient(to right, #c34029 0%, #dc932d 20%, #e3b661 30%, #e1dd8d 40%, #edf093 50%, #c9e7e4 60%, #8abad6 70%, #5a79c8 80%, #1c4388 100%)",
        }}
      />
    </div>
  );
}

interface GlassSceneProps {
  width?: string | number;
  height?: string | number;
  initialTime?: number;
  initialIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  onTimeChange?: (time: number) => void;
  onIndexChange?: (index: number) => void;
}

/* main component */
export default function GlassScene({
  width = "800px",
  height = "600px",
  initialTime = 0,
  initialIndex = 0,
  className,
  style,
  onTimeChange,
  onIndexChange,
}: GlassSceneProps) {
  const [time, setTime] = useState(initialTime);
  const [index, setIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<any>(null);

  useEffect(() => onTimeChange?.(time), [time, onTimeChange]);
  useEffect(() => onIndexChange?.(index), [index, onIndexChange]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const resetCamera = () => orbitRef.current?.reset();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const getSkyStage = () => {
    const t = time;
    if (t > 90) return "night";
    if (t > 80) return "evening";
    if (t > 70) return "dusk";
    if (t > 60) return "sunset";
    if (t > 50) return "afternoon";
    if (t > 40) return "midday";
    if (t > 30) return "lateMorning";
    if (t > 20) return "morning";
    return "sunrise";
  };

  const getSkyProps = () => {
    const stage = getSkyStage();
    switch (stage) {
      case "sunrise":
        return {
          turbidity: 20,
          rayleigh: 4,
          mieCoefficient: 0.01,
          sunPosition: [-6, 1, 0] as [number, number, number],
          intensity: 0.5,
        };
      case "morning":
        return {
          turbidity: 15,
          rayleigh: 1.2,
          mieCoefficient: 0.01,
          sunPosition: [-8, 1, 0] as [number, number, number],
          intensity: 0.7,
        };
      case "lateMorning":
        return {
          turbidity: 20,
          rayleigh: 3,
          mieCoefficient: 0.01,
          sunPosition: [-3, 10, 0] as [number, number, number],
          intensity: 1.0,
        };
      case "midday":
        return {
          turbidity: 20,
          rayleigh: 1,
          mieCoefficient: 0.04,
          sunPosition: [0, 10, 0] as [number, number, number],
          intensity: 0.5,
        };
      case "afternoon":
        return {
          turbidity: 10,
          rayleigh: 1.4,
          mieCoefficient: 0.4,
          sunPosition: [1, 4, 0] as [number, number, number],
          intensity: 0.8,
        };
      case "sunset":
        return {
          turbidity: 15,
          rayleigh: 1.2,
          mieCoefficient: 0.01,
          sunPosition: [-5, 0, 0] as [number, number, number],
          intensity: 0.7,
        };
      case "dusk":
        return {
          turbidity: 0,
          rayleigh: 3.0,
          mieCoefficient: 3.0,
          sunPosition: [0, 1, 40] as [number, number, number],
          intensity: 0.1,
        };
      case "evening":
        return {
          turbidity: 10,
          rayleigh: 3,
          mieCoefficient: 3.0,
          sunPosition: [10, 1, 10] as [number, number, number],
          intensity: 0.1,
        };
      case "night":
        return {
          turbidity: 0,
          rayleigh: 3,
          mieCoefficient: 3.0,
          sunPosition: [0, -1, 0] as [number, number, number],
          intensity: 0.1,
        };
      default:
        return {
          turbidity: 10,
          rayleigh: 2,
          mieCoefficient: 0.005,
          sunPosition: [0, 10, 0] as [number, number, number],
          intensity: 1.5,
        };
    }
  };

  const skyProps = getSkyProps();

  const arrowClasses = (side: "left" | "right") =>
    `absolute top-1/2 -translate-y-1/2 text-3xl bg-gray-400/80 text-gray-800 border border-gray-400 px-4 py-2.5 cursor-pointer z-[1100] rounded-2xl ${side === "left" ? "left-5" : "right-5"
    }`;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width,
        height,
        position: "relative",
        background: "#111",
        isolation: "isolate",
        ...style,
      }}
    >
      <div className="relative w-full h-full bg-black">
        <Canvas
          className="absolute inset-0 z-0"
          camera={{ position: [5, 0, 0], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.3} />
          <directionalLight
            position={skyProps.sunPosition}
            intensity={skyProps.intensity}
            castShadow
          />
          <GlassModel index={index} />
          <Sky
            turbidity={skyProps.turbidity}
            rayleigh={skyProps.rayleigh}
            mieCoefficient={skyProps.mieCoefficient}
            distance={450000}
            sunPosition={skyProps.sunPosition}
          />
          <OrbitControls ref={orbitRef} />
        </Canvas>

        <LoadingOverlay />

        {/* Reset View button */}
        <button
          onClick={resetCamera}
          className="absolute top-4 left-4 z-[1100] px-3 py-1.5 bg-gray-400/80 text-gray-800 border border-gray-400 cursor-pointer rounded-xl text-sm font-medium"
        >
          Reset View
        </button>

        {/* Panel indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] px-3 py-1.5 bg-gray-400/80 text-gray-800 border border-gray-400 rounded-xl pointer-events-none text-center leading-tight">
          <div className="text-sm opacity-90">Panel</div>
          <div className="text-base font-semibold">{index + 1}/8</div>
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[1100] px-3 py-1.5 bg-gray-400/80 text-gray-800 border border-gray-400 cursor-pointer rounded-xl text-sm font-medium"
        >
          {isFullscreen ? "✕ Exit Fullscreen" : "⛶ Expand"}
        </button>

        {/* Left arrow button */}
        <button
          onClick={() => setIndex((i) => (i + 7) % 8)}
          className={arrowClasses("left")}
        >
          ◀
        </button>

        {/* Right arrow button */}
        <button
          onClick={() => setIndex((i) => (i + 1) % 8)}
          className={arrowClasses("right")}
        >
          ▶
        </button>

        <TimeSlider time={time} setTime={setTime} />
      </div>
    </div>
  );
}