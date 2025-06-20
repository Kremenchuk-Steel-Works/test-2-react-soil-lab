import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import postcssPresetEnv from "postcss-preset-env"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 0,
          features: {
            "custom-properties": {
              preserve: false,
            },
          },
        }),
      ],
    },
  },

  build: {
    cssTarget: "chrome109",
  },
})
