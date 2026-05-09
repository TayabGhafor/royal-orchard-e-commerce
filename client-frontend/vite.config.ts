import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Same-origin /api in dev (avoids CORS + localhost vs 127.0.0.1 cookie issues). Cursor / IDE preview hosts:
    ...(mode === "development"
      ? {
          allowedHosts: true,
          proxy: {
            "/api": { target: "http://127.0.0.1:5000", changeOrigin: true },
          },
        }
      : {}),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-router-dom")) return "router";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("recharts")) return "charts";
          if (id.includes("@radix-ui")) return "radix";

          // Everything else from node_modules goes into a general vendor chunk.
          return "vendor";
        },
      },
    },
  },
}));
