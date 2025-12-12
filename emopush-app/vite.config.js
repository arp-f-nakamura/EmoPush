import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const GAS_EXEC =
  "https://script.google.com/macros/s/AKfycbzK9356C7GSJbFZRHPfz5nYwaxn91vpEB8Q0jaYyVhTzk9kXuNyUacbCwANe2GNkqY1/exec";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/gas": {
        target: GAS_EXEC,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gas/, ""),
      },
    },
  },
});
