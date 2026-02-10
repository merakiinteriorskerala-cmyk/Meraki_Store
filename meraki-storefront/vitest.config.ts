import path from "node:path"
import { defineConfig, configDefaults } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "src/lib"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: [...configDefaults.exclude, "src/test/e2e/**"],
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/**",
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/index.ts",
        "src/**/types.ts",
      ],
      reporter: ["text", "json", "html"],
    },
  },
})