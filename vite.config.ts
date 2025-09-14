import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "app/frontend/components"),
      "@views": path.resolve(__dirname, "app/views"),
      "@slices": path.resolve(__dirname, "app/frontend/slices"),
    },
  },
  plugins: [RubyPlugin(), tailwindcss()],
});
