import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "body-map-3d": [
            "three",
            "three/examples/jsm/loaders/GLTFLoader.js",
          ],
        },
      },
    },
  },
});
