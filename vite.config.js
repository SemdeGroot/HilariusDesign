// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Hardcode to root for Netlify
  server: {
    allowedHosts: ["treasonably-noncerebral-samir.ngrok-free.dev"]
  }
});