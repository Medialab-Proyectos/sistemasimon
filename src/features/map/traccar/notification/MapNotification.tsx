import { useEffect, useMemo } from "react";
import { useMapRuntime } from "../MapRuntime";

const statusClass = (enabled: boolean) =>
  [
    "maplibregl-ctrl-icon",
    "grid h-8 w-8 place-items-center text-[color:var(--color-text)]",
    enabled ? "ring-2 ring-[color:var(--color-primary)]/60" : "opacity-90",
  ].join(" ");

class NotificationControl {
  private button?: HTMLButtonElement;
  private container?: HTMLDivElement;
  private readonly eventHandler: (self: NotificationControl) => void;

  constructor(eventHandler: (self: NotificationControl) => void) {
    this.eventHandler = eventHandler;
  }

  onAdd() {
    this.button = document.createElement("button");
    this.button.className = statusClass(false);
    this.button.type = "button";
    this.button.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"
        style="display:block;color:currentColor">
        <path d="M12 22a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 22Z" fill="currentColor"/>
        <path d="M18 16.8V11a6 6 0 1 0-12 0v5.8L4.5 18.3a.9.9 0 0 0 .6 1.5h13.8a.9.9 0 0 0 .6-1.5L18 16.8Z"
          fill="currentColor" opacity="0.9"/>
      </svg>
    `;
    this.button.onclick = () => this.eventHandler(this);

    this.container = document.createElement("div");
    this.container.className = "maplibregl-ctrl-group maplibregl-ctrl";
    this.container.appendChild(this.button);
    return this.container;
  }

  onRemove() {
    this.container?.remove();
  }

  setEnabled(enabled: boolean) {
    if (!this.button) return;
    this.button.className = statusClass(enabled);
  }
}

export function MapNotification({
  enabled,
  onClick,
}: Readonly<{ enabled: boolean; onClick: () => void }>) {
  const { map } = useMapRuntime();
  const control = useMemo(() => new NotificationControl(() => onClick()), [onClick]);

  useEffect(() => {
    if (!map) return;
    map.addControl(control as any, "top-right");
    return () => {
      try {
        map.removeControl(control as any);
      } catch {}
    };
  }, [control, map]);

  useEffect(() => {
    control.setEnabled(enabled);
  }, [control, enabled]);

  return null;
}

MapNotification.handlesMapReady = true;

