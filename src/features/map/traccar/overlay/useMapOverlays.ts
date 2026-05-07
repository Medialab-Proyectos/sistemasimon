export type MapOverlayItem = {
  id: string;
  title: string;
  available: boolean;
  source: any;
};

// SCADA: keep a minimal overlay list; host doesn't inject overlay preferences yet.
export default function useMapOverlays(): MapOverlayItem[] {
  return [];
}

