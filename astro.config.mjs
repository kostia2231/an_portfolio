// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  vite: { plugins: [tailwindcss()] },
  integrations: [react()],
  output: "server",
  adapter: netlify(),
});
