import type { VehicleInfo } from "../components/VehicleInfoCard";

const MOCK_VEHICLES: VehicleInfo[] = [
  {
    plate: "ABC 123",
    imei: "357815090548774",
    iccid: "8956032028441846206",
    vehicleType: "Transporte urbano",
    connected: true,
  },
  {
    plate: "DEF 256",
    imei: "823456902896758",
    iccid: "8989076512345676549",
    vehicleType: "Transporte interurbano",
    connected: true,
  },
  {
    plate: "GHI 789",
    imei: "456123789012345",
    iccid: "8956032028441846207",
    vehicleType: "Carga pesada",
    connected: false,
  },
];

export function useMockDeviceSearch() {
  const search = (query: string): VehicleInfo | null => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();
    const found = MOCK_VEHICLES.find((v) =>
      v.plate.toLowerCase().includes(q) ||
      v.imei.includes(q) ||
      v.iccid.includes(q),
    );
    return found ?? null;
  };

  return { search, loading: false };
}