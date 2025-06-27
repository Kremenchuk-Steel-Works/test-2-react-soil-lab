import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 0,
          features: {
            'custom-properties': {
              preserve: false,
            },
          },
        }),
      ],
    },
  },

  build: {
    cssTarget: 'chrome109',
  },
})
