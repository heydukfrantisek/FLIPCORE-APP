import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
      // Mimo Next.js by `server-only` skončil výjimkou. Testy potřebují volat
      // repozitář přímo, proto ho v testech nahrazuje prázdný modul.
      "server-only": path.join(rootDir, "src/test/stub-server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
