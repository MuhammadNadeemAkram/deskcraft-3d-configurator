import {
  accessoryIds,
  deskSizes,
  legFinishes,
  surfaceFinishes,
  type AccessoryId,
  type DeskConfig,
  type DeskSize,
  type LegFinish,
  type SurfaceFinish,
} from "./types";

export const defaultConfig: DeskConfig = {
  version: 1,
  size: "140x70",
  surface: "white",
  legs: "black",
  accessories: [],
};

const isValue = <T extends readonly string[]>(
  values: T,
  value: string | null | undefined,
): value is T[number] => Boolean(value && values.includes(value));

export function normalizeAccessories(values: readonly string[]): AccessoryId[] {
  return accessoryIds.filter((id) => values.includes(id));
}

export function normalizeConfig(candidate: Partial<DeskConfig>): DeskConfig {
  return {
    version: 1,
    size: isValue(deskSizes, candidate.size) ? candidate.size : defaultConfig.size,
    surface: isValue(surfaceFinishes, candidate.surface)
      ? candidate.surface
      : defaultConfig.surface,
    legs: isValue(legFinishes, candidate.legs) ? candidate.legs : defaultConfig.legs,
    accessories: normalizeAccessories(candidate.accessories ?? []),
  };
}

export function parseDeskConfig(params: URLSearchParams): DeskConfig {
  return normalizeConfig({
    size: (params.get("s") ?? undefined) as DeskSize | undefined,
    surface: (params.get("t") ?? undefined) as SurfaceFinish | undefined,
    legs: (params.get("l") ?? undefined) as LegFinish | undefined,
    accessories: params.getAll("a") as AccessoryId[],
  });
}

export function serializeDeskConfig(config: DeskConfig): string {
  const normalized = normalizeConfig(config);
  const params = new URLSearchParams({
    v: "1",
    s: normalized.size,
    t: normalized.surface,
    l: normalized.legs,
  });

  normalized.accessories.forEach((accessory) => params.append("a", accessory));
  return `?${params.toString()}`;
}

export function createUpdatedConfig(
  config: DeskConfig,
  patch: Partial<DeskConfig>,
): DeskConfig {
  return normalizeConfig({ ...config, ...patch });
}
