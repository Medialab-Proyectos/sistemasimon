import { createContext, useContext } from "react";
import type maplibregl from "maplibre-gl";

type MapRuntime = {
  map: maplibregl.Map | null;
  mapReady: boolean;
};

const Ctx = createContext<MapRuntime | null>(null);

export function MapRuntimeProvider({
  value,
  children,
}: Readonly<{ value: MapRuntime; children?: React.ReactNode }>) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMapRuntime() {
  const v = useContext(Ctx);
  if (!v) {
    return { map: null, mapReady: false };
  }
  return v;
}

