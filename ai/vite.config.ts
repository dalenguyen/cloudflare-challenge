/// <reference types="vitest" />

import analog from "@analogjs/platform";
import { defineConfig, Plugin, splitVendorChunkPlugin } from "vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: "src/public",

    build: {
      outDir: "../dist/./ai/client",
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
      target: ["es2020"],
    },
    server: {
      fs: {
        allow: ["."],
      },
    },
    plugins: [
      analog({
        nitro: {
          output: {
            // this will generate the compiled files under
            // ai/dist & the worker files will be under ai/dist/_worker.js folder
            // test the build locally for cloudflare:
            // BUILD_PRESET=cloudflare-pages npx nx build ai
            dir: "./dist",
            serverDir: "./dist/_worker.js",
          },
        },
      }),

      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/test-setup.ts"],
      include: ["**/*.spec.ts"],
      reporters: ["default"],
      cache: {
        dir: `../node_modules/.vitest`,
      },
    },
    define: {
      "import.meta.vitest": mode !== "production",
    },
  };
});
