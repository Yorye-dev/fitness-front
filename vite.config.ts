import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },

  server: {
    host: "0.0.0.0",
    strictPort: true,
    watch: {
      // Windows bind mounts through Docker Desktop need polling for HMR.
      usePolling: process.env.WATCH_USE_POLLING === "true",
      interval: 300,
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET ?? "http://localhost:8080",
        changeOrigin: true,
      },
      "/auth": {
        target: process.env.VITE_API_PROXY_TARGET ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
