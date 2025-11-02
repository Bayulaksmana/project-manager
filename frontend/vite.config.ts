import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      'react-syntax-highlighter/dist/esm': 'react-syntax-highlighter/dist/cjs',
    },
  },
  optimizeDeps: {
    exclude: ["rollup"]
  },
});
