export interface DeviceLite {
  id: number;
  name?: string | null;
  uniqueId?: string | null;
  category?: string | null;
  status?: string | null;
  attributes?: Record<string, unknown> | null;
}

export interface PositionLite {
  id?: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  course?: number | null;
  speed?: number | null;
  fixTime?: string | null;
  attributes?: Record<string, unknown> | null;
}

