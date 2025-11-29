import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_TARGET = process.env.VITE_API_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // Proxy everything under /api to the Flask server; changeOrigin handles host header.
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
