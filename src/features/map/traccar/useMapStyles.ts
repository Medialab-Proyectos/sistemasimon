import { useMemo } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";

type StyleItem = { id: string; title: string; style: any; available: boolean; transformRequest?: any };

const styleCustom = ({ tiles, minZoom, maxZoom, attribution }: any) => {
  const source: any = { type: "raster", tiles, attribution, tileSize: 256, minzoom: minZoom, maxzoom: maxZoom };
  Object.keys(source).forEach((k) => source[k] === undefined && delete source[k]);
  return {
    version: 8,
    sources: { custom: source },
    glyphs: "https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf",
    layers: [{ id: "custom", type: "raster", source: "custom" }],
  };
};

function firstString(...values: unknown[]) {
  for (const v of values) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

export default function useMapStyles(): StyleItem[] {
  const { config } = useScada();

  const googleKey = (config.prefs as any)?.googleKey;
  const mapTilerKey = (config.prefs as any)?.mapTilerKey;
  const locationIqKey = firstString(
    (config.prefs as any)?.locationIqKey,
    (config.prefs as any)?.locationIQKey,
    (config.prefs as any)?.locationIqToken,
    (config.prefs as any)?.locationIQToken,
  ) ?? "pk.0f147952a41c555a5b70614039fd148b";
  const mapboxAccessToken = (config.prefs as any)?.mapboxAccessToken;
  const hostTilesUrl = firstString(
    (config.prefs as any)?.mapTilesUrl,
    (config.prefs as any)?.tilesUrl,
    (config.prefs as any)?.tileUrl,
    (config.prefs as any)?.rasterTilesUrl,
    (config.prefs as any)?.rasterTileUrl,
    (config.prefs as any)?.mapUrl,
  );

  return useMemo(
    () => [
      {
        id: "hostRaster",
        title: "Host Tiles",
        style: styleCustom({
          tiles: hostTilesUrl ? [hostTilesUrl] : [],
          maxZoom: 20,
        }),
        available: Boolean(hostTilesUrl),
      },
      { id: "openFreeMap", title: "OpenFreeMap", style: "https://tiles.openfreemap.org/styles/liberty", available: true },
      { id: "locationIqStreets", title: "LocationIQ Streets", style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationIqKey}`, available: true },
      { id: "locationIqDark", title: "LocationIQ Dark", style: `https://tiles.locationiq.com/v3/dark/vector.json?key=${locationIqKey}`, available: true },
      {
        id: "osm",
        title: "OSM",
        style: styleCustom({
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          maxZoom: 19,
          attribution:
            '© <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
        available: true,
      },
      {
        id: "googleRoad",
        title: "Google Road",
        style: styleCustom({
          tiles: googleKey ? [`google://roadmap/{z}/{x}/{y}?key=${googleKey}`] : [0, 1, 2, 3].map((i) => `https://mt${i}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga`),
          maxZoom: 20,
          attribution: "© Google",
        }),
        available: true,
      },
      {
        id: "mapTilerBasic",
        title: "MapTiler Basic",
        style: `https://api.maptiler.com/maps/basic/style.json?key=${mapTilerKey}`,
        available: Boolean(mapTilerKey),
      },
      {
        id: "mapboxStreets",
        title: "Mapbox Streets",
        style: styleCustom({
          tiles: [`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
          maxZoom: 22,
        }),
        available: Boolean(mapboxAccessToken),
      },
    ],
    [googleKey, hostTilesUrl, locationIqKey, mapTilerKey, mapboxAccessToken],
  );
}

