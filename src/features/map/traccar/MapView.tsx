import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl from "maplibre-gl";
import { googleProtocol } from "maplibre-google-maps";
import React, { useEffect, useMemo, useRef, useState } from "react";
import preloadImages, { mapImages } from "./preloadImages";
import { SwitcherControl } from "./switcher/SwitcherControl";
import { MapRuntimeProvider } from "./MapRuntime";
import useMapStyles from "./useMapStyles";
import { usePref } from "../../../app/remote/usePref";

const DEFAULT_STYLE_ID = "openFreeMap";
const STORAGE_KEY = "selectedMapStyle";

function readPersistedStyleId(): string | null {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return raw;
  }
}

function writePersistedStyleId(styleId: string) {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(styleId));
}

const element = document.createElement("div");
element.style.width = "100%";
element.style.height = "100%";
element.style.boxSizing = "initial";

maplibregl.addProtocol("google", googleProtocol as any);

export const map = new maplibregl.Map({
  container: element,
  style: "https://tiles.openfreemap.org/styles/liberty",
  attributionControl: false,
});

let ready = false;
const readyListeners = new Set<(value: boolean) => void>();

const addReadyListener = (listener: (value: boolean) => void) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener: (value: boolean) => void) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value: boolean) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage("background")) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value as any, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
};

export const handlesMapReady = true;

export default function MapView({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState<string>(() => readPersistedStyleId() || DEFAULT_STYLE_ID);
  const mapStyles = useMapStyles();
  const activeMapStyles = usePref<string>(
    "activeMapStyles",
    "hostRaster,locationIqStreets,locationIqDark,openFreeMap,osm",
  )!;
  const defaultMapStyle = useMemo(
    () => readPersistedStyleId() || DEFAULT_STYLE_ID,
    [],
  );
  const imagesReadyRef = useRef(false);

  const switcher = useMemo(() => {
    return new SwitcherControl(
      () => updateReadyValue(false),
      (styleId) => {
        writePersistedStyleId(styleId);
        setActiveStyleId(styleId);
        setMapError(null);
      },
      () => {
        map.once("styledata", () => {
          const waiting = () => {
            if (!map.loaded()) {
              setTimeout(waiting, 33);
            } else {
              preloadImages()
                .then(() => initMap())
                .catch((e) =>
                  setMapError(
                    e instanceof Error ? e.message : "Failed to init map",
                  ),
                )
                .finally(() => updateReadyValue(true));
            }
          };
          waiting();
        });
      },
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.appendChild(element);
    map.resize();

    const ro =
      "ResizeObserver" in globalThis
        ? new ResizeObserver(() => {
            map.resize();
          })
        : null;
    ro?.observe(container);

    const waitForLoaded = () => {
      if (map.loaded()) return Promise.resolve();
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(waitForLoaded()), 33);
      });
    };

    const onError = (e: any) => {
      const message = e?.error?.message || e?.message || "Map error";
      const msg = String(message);
      const isFetchFailure =
        /failed to fetch/i.test(msg) ||
        /networkerror/i.test(msg) ||
        /load failed/i.test(msg);
      const isVectorTileFailure =
        /\.pbf(\b|\?)/i.test(msg) ||
        /locationiq\.com/i.test(msg) ||
        /openfreemap\.org/i.test(msg);

      if (isFetchFailure && isVectorTileFailure) {
        try {
          const fallback = mapStyles.find((s) => s.id === "osm" && s.available);
          if (fallback) {
            map.setStyle(fallback.style, { diff: false });
            writePersistedStyleId(fallback.id);
            setActiveStyleId(fallback.id);
            setMapError(null);
            return;
          }
        } catch {}
      }
      setMapError(msg);
    };
    map.on("error", onError);

    const ensureImages = async () => {
      if (imagesReadyRef.current) return;
      await preloadImages();
      imagesReadyRef.current = true;
    };

    const onStyleImageMissing = async (e: any) => {
      const id = e?.id;
      if (!id || typeof id !== "string") return;
      try {
        await ensureImages();
        if (!map.hasImage(id) && mapImages[id]) {
          map.addImage(id, mapImages[id] as any, { pixelRatio: window.devicePixelRatio });
        }
      } catch {}
    };
    map.on("styleimagemissing", onStyleImageMissing);

    const attribution = new maplibregl.AttributionControl({ compact: true });
    const navigation = new maplibregl.NavigationControl();
    map.addControl(attribution, "bottom-right");
    map.addControl(navigation, "top-right");
    map.addControl(switcher as any, "top-right");

    if (map.loaded()) {
      ensureImages()
        .then(() => initMap())
        .catch((e) =>
          setMapError(e instanceof Error ? e.message : "Failed to init map"),
        )
        .finally(() => updateReadyValue(true));
    }

    map.once("load", () => {
      waitForLoaded()
        .then(() => ensureImages())
        .then(() => initMap())
        .catch((e) =>
          setMapError(e instanceof Error ? e.message : "Failed to init map"),
        )
        .finally(() => updateReadyValue(true));
    });

    return () => {
      ro?.disconnect();
      map.off("error", onError);
      map.off("styleimagemissing", onStyleImageMissing);
      try {
        map.removeControl(switcher as any);
      } catch {}
      try {
        map.removeControl(navigation);
      } catch {}
      try {
        map.removeControl(attribution);
      } catch {}
      if (container.contains(element)) {
        element.remove();
      }
    };
  }, [activeStyleId, mapStyles, switcher]);

  useEffect(() => {
    const allowed = (() => {
      const raw: unknown = activeMapStyles;
      let ids: string[] = [];
      if (Array.isArray(raw)) {
        ids = raw.map(String);
      } else if (typeof raw === "string") {
        ids = raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      ids.push("locationIqStreets", "locationIqDark");
      return new Set(ids);
    })();

    const filteredStyles = mapStyles.filter((s) => s.available && allowed.has(s.id));
    const styles = filteredStyles.length
      ? filteredStyles
      : mapStyles.filter((s) => s.id === "osm");
    switcher.updateStyles(styles as any, defaultMapStyle);
  }, [activeMapStyles, defaultMapStyle, mapStyles, switcher]);

  useEffect(() => {
    const listener = (value: boolean) => setMapReady(value);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full min-h-[420px] bg-[#0b0b0b]"
      />
      <MapRuntimeProvider value={{ map, mapReady }}>
        {React.Children.map(children, (child) => {
          const maybeType = React.isValidElement(child)
            ? (child.type as unknown as { handlesMapReady?: boolean })
            : null;
          if (React.isValidElement(child) && maybeType?.handlesMapReady) {
            return React.cloneElement(child, { mapReady } as any);
          }
          return mapReady ? child : null;
        })}
      </MapRuntimeProvider>
      {import.meta.env.DEV ? (
        <div className="pointer-events-none absolute left-3 bottom-3 z-30 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-white">
          mapReady: {String(mapReady)}
        </div>
      ) : null}
      {mapError && (
        <div className="pointer-events-none absolute left-3 top-3 right-3 max-w-[520px] rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-200">
          No se pudo cargar el mapa: {mapError}
        </div>
      )}
    </div>
  );
}
