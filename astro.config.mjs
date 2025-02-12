// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://kostia2231.github.io",
  base: "astro",
  devToolbar: {
    enabled: false,
  },

  vite: { plugins: [tailwindcss()] },
  integrations: [react()],

  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
