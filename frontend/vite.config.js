import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Permite importar con "@/..." apuntando a /src
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 todavia usa @import/if() internamente. Silenciamos los
        // avisos de deprecacion para mantener la consola limpia.
        silenceDeprecations: [
          'import',
          'legacy-js-api',
          'global-builtin',
          'color-functions',
          'if-function',
        ],
      },
    },
  },
})
