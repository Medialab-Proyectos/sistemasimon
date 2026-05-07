import { Navigate, Route, Routes } from "react-router-dom";
import ScadaModule from "./remote/ScadaModule";

export function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/scada/commands/center" replace />} />
        <Route path="/scada/*" element={<ScadaModule config={{
          themeMode: "dark",
          positions: [
            { deviceId: 1, latitude: 4.60971, longitude: -74.08175 },
            { deviceId: 2, latitude: 4.7, longitude: -74.1 },
          ],
          devicesById: {
            1: { id: 1, name: "Device 1" },
            2: { id: 2, name: "Device 2" },
          },
        }} />} />
        <Route path="*" element={<Navigate to="/scada/map" replace />} />
      </Routes>
    </div>
  );
}
