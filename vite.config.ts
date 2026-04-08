import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react({
      // Exclude content scripts and background from React transform
      // to prevent injecting document-referencing HMR code into service worker
      include: ["src/pages/**/*.tsx"],
    }),
    tailwindcss(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "esnext",
  },
});
