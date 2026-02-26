import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    allowedHosts: ["treasonably-noncerebral-samir.ngrok-free.dev"]
  }
});