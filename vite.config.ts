import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { createRequire } from "node:module";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tailwindcss from "@tailwindcss/vite";

const require = createRequire(import.meta.url);
require("./package.json");

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: false,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    tailwindcss(),
    react(),
    // Ensure the CSS is injected from the federation-exposed chunks
    // (the host doesn't import the remote's app entry).
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction(outputChunk) {
        return (
          outputChunk.fileName.includes("__federation_expose_ScadaModule") ||
          outputChunk.fileName.includes("__federation_expose_ScadaStyles")
        );
      },
    }),
    federation({
      name: "scada",
      filename: "remoteEntry.js",
      exposes: {
        "./ScadaModule": "./src/app/remote/ScadaModule.tsx",
        "./ScadaStyles": "./src/app/remote/ScadaStyles.ts",
      },

      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
});
