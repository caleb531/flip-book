import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  // By default, Vite will assume we are serving from the root of the domain
  // (i.e. /); however, because we are serving Truthy from a subdirectory of my
  // projects domain (e.g. https://projects.calebevans.me/truthy/), we must
  // specify . as the base directory to serve from
  base: './',
  plugins: [
    VitePWA({
      filename: 'service-worker.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Include Google Fonts in service worker cache
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30
              }
            }
          }
        ],
        cleanupOutdatedCaches: true
      },
      manifest: {
        short_name: 'Flip Book',
        name: 'Flip Book',
        description: 'Create flip book-style animations to share with friends. Draw each scene, frame by frame, then export your story to a GIF when you\'re ready to show it off.',
        start_url: '.',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'app-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'app-icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'app-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'app-icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov', 'html']
    }
  }
});
