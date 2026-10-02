import { defineConfig, loadEnv } from "vite";

// Vitest doesn't read .env.local the way Next.js does. Load it so the live
// unsupported-claims eval runs when OPENROUTER_API_KEY is set locally.
export default defineConfig(({ mode }) => ({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next"],
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
