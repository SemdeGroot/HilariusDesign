import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In GH Actions kun je VITE_BASE="/repo/"
// User-site (username.github.io) => "/"
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base
});
