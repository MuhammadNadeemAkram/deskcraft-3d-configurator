"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { DeskConfig } from "@/features/desk/types";
import { DeskScene } from "./DeskScene";

function Lighting() {
  return (
    <>
      <hemisphereLight args={["#fffaf0", "#9aa4a3", 2.0]} />
      <directionalLight castShadow intensity={2.25} position={[3.4, 5.4, 3.8]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight intensity={0.65} position={[-3, 2.8, -2.4]} color="#d8ecff" />
    </>
  );
}

export function DeskViewer({ config }: { config: DeskConfig }) {
  const [viewKey, setViewKey] = useState(0);

  return (
    <div className="viewer-panel panel" aria-label="Interactive 3D desk preview">
      <div className="viewer-topbar">
        <span className="viewer-label">Live 3D preview</span>
        <div className="viewer-actions">
          <button className="button" type="button" onClick={() => setViewKey((key) => key + 1)}>
            <RotateCcw aria-hidden="true" size={13} />
            Reset view
          </button>
        </div>
      </div>
      <Canvas
        key={viewKey}
        className="viewer-canvas"
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.15, 1.45, 2.25], fov: 36 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#e8ebe7"]} />
        <fog attach="fog" args={["#e8ebe7", 4.2, 8]} />
        <Lighting />
        <DeskScene config={config} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          target={[0, 0.42, 0]}
          minDistance={1.45}
          maxDistance={4.2}
          minPolarAngle={Math.PI / 4.4}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      <div className="viewer-instruction" aria-hidden="true">
        <span>Drag to rotate · Scroll to zoom</span>
        <span>Configured for your workspace</span>
      </div>
    </div>
  );
}

function Capture({ onComplete, onError }: { onComplete: (blob: Blob) => void; onError: () => void }) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          gl.render(scene, camera);
          gl.domElement.toBlob((blob) => {
            if (blob) onComplete(blob);
            else onError();
          }, "image/png");
        } catch {
          onError();
        }
      });
    });

    return () => cancelAnimationFrame(firstFrame);
  }, [camera, gl, onComplete, onError, scene]);

  return null;
}

export function ExportCanvas({
  config,
  onComplete,
  onError,
}: {
  config: DeskConfig;
  onComplete: (blob: Blob) => void;
  onError: () => void;
}) {
  return (
    <div className="export-stage" aria-hidden="true">
      <Canvas
        shadows
        dpr={1}
        camera={{ position: [2.45, 1.62, 2.5], fov: 35 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f1f1eb"]} />
        <fog attach="fog" args={["#f1f1eb", 4.2, 8]} />
        <Lighting />
        <DeskScene config={config} />
        <Capture onComplete={onComplete} onError={onError} />
      </Canvas>
    </div>
  );
}
