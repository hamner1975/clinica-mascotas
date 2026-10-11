import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Veterinaria Mascotas',
        short_name: 'Vet. Mascotas',
        description: 'Clinica veterinaria: servicios, citas y farmacia online.',
        lang: 'es',
        theme_color: '#db0505',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // La API siempre desde la red (no cachear datos).
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
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
