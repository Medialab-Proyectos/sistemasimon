import { useEffect, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import { MainToolbar } from "./traccar/MainToolbar";
import { DeviceList } from "./traccar/DeviceList";

export function DevicesSidebar({
  selectedDeviceId,
  onSelectDevice,
}: Readonly<{
  selectedDeviceId: number | null;
  onSelectDevice: (deviceId: number | null) => void;
}>) {
  useScada();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(keyword.trim()), 500);
    return () => clearTimeout(id);
  }, [keyword]);

  return (
    <aside className="scada-right-panel h-full w-[360px] shrink-0">
      <div className="flex h-full flex-col">
        <div className="scada-right-panel__header">
          <MainToolbar keyword={keyword} setKeyword={setKeyword} />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <DeviceList
            keyword={debouncedKeyword}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={(id) => onSelectDevice(id)}
          />
        </div>
      </div>
    </aside>
  );
}

