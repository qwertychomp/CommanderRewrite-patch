import { defineConfig } from "astro/config";
import { ViteImageOptimizer as viteImageOptimizer } from "vite-plugin-image-optimizer";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  vite: {
      resolve: {
          preserveSymlinks: true
      },
      plugins: [
        viteImageOptimizer()
      ]
  },
  devToolbar: {
      enabled: false
  },
  integrations: [tailwind()]
});