"use client";

import { ContactShadows } from "@react-three/drei";
import { accessoryCatalog, legCatalog, sizeCatalog, surfaceCatalog } from "@/features/desk/catalog";
import type { DeskConfig } from "@/features/desk/types";

type Vector3 = [number, number, number];

type BoxProps = {
  size: Vector3;
  position: Vector3;
  color: string;
  roughness?: number;
  metalness?: number;
};

function Box({
  size,
  position,
  color,
  roughness = 0.45,
  metalness = 0,
}: BoxProps) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function DeskAccessories({ config, width, depth, frameColor }: { config: DeskConfig; width: number; depth: number; frameColor: string }) {
  const has = (id: (typeof config.accessories)[number]) => config.accessories.includes(id);

  return (
    <group>
      {has("tray") && (
        <group position={[0, 0.605, -depth / 2 + 0.115]}>
          <Box size={[Math.max(width - 0.25, 0.82), 0.045, 0.13]} position={[0, 0, 0]} color={frameColor} roughness={0.48} metalness={0.48} />
          <Box size={[Math.max(width - 0.27, 0.8), 0.095, 0.018]} position={[0, -0.05, -0.055]} color={frameColor} roughness={0.5} metalness={0.4} />
        </group>
      )}

      {has("drawer") && (
        <group position={[0, 0.595, depth / 2 - 0.22]}>
          <Box size={[0.48, 0.1, 0.29]} position={[0, 0, 0]} color="#262925" roughness={0.55} />
          <Box size={[0.39, 0.02, 0.012]} position={[0, 0, 0.151]} color="#b7baaf" roughness={0.3} metalness={0.35} />
        </group>
      )}

      {has("arm") && (
        <group position={[width / 2 - 0.15, 0.8, -depth / 2 + 0.12]}>
          <mesh castShadow position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.018, 0.022, 0.39, 18]} />
            <meshStandardMaterial color={frameColor} roughness={0.34} metalness={0.7} />
          </mesh>
          <mesh castShadow rotation={[0, 0, -0.78]} position={[-0.1, 0.36, 0]}>
            <cylinderGeometry args={[0.017, 0.017, 0.25, 18]} />
            <meshStandardMaterial color={frameColor} roughness={0.34} metalness={0.7} />
          </mesh>
          <mesh castShadow position={[-0.205, 0.44, 0]}>
            <sphereGeometry args={[0.035, 18, 18]} />
            <meshStandardMaterial color={frameColor} roughness={0.34} metalness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function DeskScene({ config }: { config: DeskConfig }) {
  const { width, depth } = sizeCatalog[config.size].dimensions;
  const surface = surfaceCatalog[config.surface];
  const frame = legCatalog[config.legs];
  const topY = 0.76;
  const topThickness = 0.035;
  const legHeight = 0.705;
  const insetX = width / 2 - 0.08;
  const insetZ = depth / 2 - 0.075;

  return (
    <group>
      <Box
        size={[width, topThickness, depth]}
        position={[0, topY, 0]}
        color={surface.color}
        roughness={surface.roughness}
      />

      <Box size={[width - 0.14, 0.038, 0.055]} position={[0, 0.695, -insetZ]} color={frame.color} roughness={0.36} metalness={0.7} />
      <Box size={[width - 0.14, 0.038, 0.055]} position={[0, 0.695, insetZ]} color={frame.color} roughness={0.36} metalness={0.7} />

      {([-1, 1] as const).flatMap((x) =>
        ([-1, 1] as const).map((z) => (
          <Box
            key={`${x}-${z}`}
            size={[0.055, legHeight, 0.055]}
            position={[x * insetX, legHeight / 2, z * insetZ]}
            color={frame.color}
            roughness={0.32}
            metalness={0.72}
          />
        )),
      )}

      <DeskAccessories config={config} width={width} depth={depth} frameColor={frame.color} />

      <ContactShadows position={[0, -0.005, 0]} opacity={0.22} scale={4.5} blur={2.7} far={1.25} color="#1b1d1a" />
    </group>
  );
}

export const exportSceneDescription = Object.values(accessoryCatalog).map((accessory) => accessory.label).join(", ");
