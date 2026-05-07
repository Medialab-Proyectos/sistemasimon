type StyleItem = {
  id: string;
  title: string;
  style: any;
  transformRequest?: (url: string) => { url: string; headers?: Record<string, string> };
};

export class SwitcherControl {
  private map: any;
  private controlContainer?: HTMLDivElement;
  private mapStyleContainer?: HTMLDivElement;
  private styleButton?: HTMLButtonElement;
  private styles: StyleItem[] = [];
  private currentStyle: string | null = null;

  private readonly onBeforeSwitch: () => void;
  private readonly onSwitch: (styleId: string) => void;
  private readonly onAfterSwitch: () => void;

  constructor(
    onBeforeSwitch: () => void,
    onSwitch: (styleId: string) => void,
    onAfterSwitch: () => void,
  ) {
    this.onBeforeSwitch = onBeforeSwitch;
    this.onSwitch = onSwitch;
    this.onAfterSwitch = onAfterSwitch;
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  getDefaultPosition() {
    return "top-right";
  }

  updateStyles(updatedStyles: StyleItem[], defaultStyle: string) {
    this.styles = updatedStyles;
    if (!this.mapStyleContainer) return;

    let selectedStyle: string | null = null;
    for (const style of this.styles) {
      if (style.id === (this.currentStyle || defaultStyle)) {
        selectedStyle = style.id;
        break;
      }
    }
    if (!selectedStyle) {
      selectedStyle = this.styles[0]?.id ?? null;
    }

    while (this.mapStyleContainer.firstChild) {
      this.mapStyleContainer.firstChild.remove();
    }

    let selectedStyleElement: HTMLButtonElement | undefined;

    for (const style of this.styles) {
      const styleElement = document.createElement("button");
      styleElement.type = "button";
      styleElement.innerText = style.title;
      styleElement.dataset.id = style.id;
      styleElement.className =
        "block w-full rounded-lg px-2 py-1 text-left text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-elevated)]";
      styleElement.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement;
        if (!target.classList.contains("active")) {
          this.onSelectStyle(target);
        }
      });
      if (style.id === selectedStyle) {
        selectedStyleElement = styleElement;
        styleElement.classList.add("active", "bg-[color:var(--color-surface-elevated)]");
      }
      this.mapStyleContainer.appendChild(styleElement);
    }

    if (selectedStyleElement && this.currentStyle !== selectedStyle) {
      this.onSelectStyle(selectedStyleElement);
      this.currentStyle = selectedStyle;
    }
  }

  private onSelectStyle(target: HTMLButtonElement) {
    if (!this.map || !this.mapStyleContainer || !this.styleButton) return;
    this.onBeforeSwitch();

    const style = this.styles.find((it) => it.id === target.dataset.id);
    if (!style) return;
    this.map.setStyle(style.style, { diff: false });
    if (typeof this.map.setTransformRequest === "function") {
      this.map.setTransformRequest(style.transformRequest);
    }

    this.onSwitch(style.id);

    this.mapStyleContainer.classList.add("hidden");
    this.styleButton.style.display = "block";

    const elements = this.mapStyleContainer.getElementsByClassName("active");
    while (elements[0]) {
      elements[0].classList.remove(
        "active",
        "bg-[color:var(--color-surface-elevated)]",
      );
    }
    target.classList.add("active", "bg-[color:var(--color-surface-elevated)]");

    this.currentStyle = style.id;
    this.onAfterSwitch();
  }

  onAdd(map: any) {
    this.map = map;
    this.controlContainer = document.createElement("div");
    this.controlContainer.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group");
    this.mapStyleContainer = document.createElement("div");
    this.styleButton = document.createElement("button");
    this.styleButton.type = "button";
    this.mapStyleContainer.className =
      "hidden min-w-[220px] overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/95 p-1 text-xs shadow-lg backdrop-blur";
    this.styleButton.className =
      "maplibregl-ctrl-icon grid h-8 w-8 place-items-center text-[color:var(--color-text)]";
    this.styleButton.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"
        style="display:block;color:currentColor">
        <path d="M9 19 3.8 21.2a.8.8 0 0 1-1.1-.74V5.4c0-.32.19-.6.48-.72L9 2.5v16.5Z" fill="currentColor" opacity="0.85"/>
        <path d="M15 21.5 9 19V2.5l6 2.5v16.5Z" fill="currentColor" opacity="0.65"/>
        <path d="M20.72 3.68 15 5v16.5l5.2-2.2c.29-.12.48-.4.48-.72V4.42a.8.8 0 0 0-.96-.74Z"
          fill="currentColor" opacity="0.85"/>
      </svg>
    `;
    this.styleButton.addEventListener("click", () => {
      if (!this.styleButton || !this.mapStyleContainer) return;
      this.styleButton.style.display = "none";
      this.mapStyleContainer.classList.remove("hidden");
    });
    document.addEventListener("click", this.onDocumentClick);
    this.controlContainer.appendChild(this.styleButton);
    this.controlContainer.appendChild(this.mapStyleContainer);
    return this.controlContainer;
  }

  onRemove() {
    if (
      !this.controlContainer ||
      !this.map ||
      !this.styleButton
    ) {
      return;
    }
    this.styleButton.removeEventListener("click", this.onDocumentClick);
    this.controlContainer.remove();
    document.removeEventListener("click", this.onDocumentClick);
    this.map = undefined;
  }

  private onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (
      this.controlContainer &&
      target &&
      !this.controlContainer.contains(target) &&
      this.mapStyleContainer &&
      this.styleButton
    ) {
      this.mapStyleContainer.classList.add("hidden");
      this.styleButton.style.display = "block";
    }
  }
}

