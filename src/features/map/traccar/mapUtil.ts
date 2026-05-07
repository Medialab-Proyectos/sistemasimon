import { parse, stringify } from "wellknown";
import circle from "@turf/circle";

export const findFonts = (map: any) => {
  const style = typeof map?.getStyle === "function" ? map.getStyle() : null;
  const glyphs = style?.glyphs || "";
  if (typeof glyphs === "string" && glyphs.startsWith("https://tiles.openfreemap.org")) {
    return ["Noto Sans Regular"];
  }
  return ["Open Sans Regular", "Arial Unicode MS Regular"];
};

// ---- Geofence helpers (ported from TraccarWeb) ----

export const reverseCoordinates = (it: any): any => {
  if (!it) return it;
  if (Array.isArray(it)) {
    if (it.length === 2 && typeof it[0] === "number" && typeof it[1] === "number") {
      return [it[1], it[0]];
    }
    return it.map((v) => reverseCoordinates(v));
  }
  return { ...it, coordinates: reverseCoordinates(it.coordinates) };
};

export const geofenceToFeature = (theme: any, item: any) => {
  let geometry: any;
  if (typeof item?.area === "string" && item.area.includes("CIRCLE")) {
    const coordinates = item.area
      .replace(/CIRCLE|\(|\)|,/g, " ")
      .trim()
      .split(/ +/);
    const options = { steps: 32, units: "meters" as const };
    const polygon = circle([Number(coordinates[1]), Number(coordinates[0])], Number(coordinates[2]), options);
    geometry = polygon.geometry;
  } else {
    geometry = reverseCoordinates(parse(item.area));
  }
  return {
    id: item.id,
    type: "Feature",
    geometry,
    properties: {
      id: item.id,
      name: item.name,
      color: item.attributes?.color || theme?.palette?.geometry?.main || "#00F1C7",
      width: item.attributes?.mapLineWidth || 2,
      opacity: item.attributes?.mapLineOpacity || 1,
    },
  };
};

export const geometryToArea = (geometry: any) => stringify(reverseCoordinates(geometry));

