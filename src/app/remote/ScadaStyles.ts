import tailwindCss from "../../styles/tailwind.css?inline";
import globalsCss from "../../styles/globals.css?inline";
import maplibreCss from "maplibre-gl/dist/maplibre-gl.css?inline";

// Inyectar estilos en el DOM del host
const injectStyles = () => {
  if (typeof document !== 'undefined') {
    // Evitar inyectar si ya existe
    if (document.querySelector('style[data-scada-styles]')) return;

    const style = document.createElement('style');
    style.dataset.scadaStyles = 'true';
    style.textContent = tailwindCss + globalsCss + maplibreCss;
    document.head.appendChild(style);
  }
};

// Ejecutar la inyección al importar el módulo
injectStyles();

// Exportar algo para que el import funcione
export const scadaStylesLoaded = true;

