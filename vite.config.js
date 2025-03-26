import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
//import { visualizer } from 'rollup-plugin-visualizer'
import vercel from 'vite-plugin-vercel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Music App',
        id: '/',
        theme_color: '#ff5e3a',
        lang: 'pl',
        icons: [
          { src: 'public/assets/img/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'public/assets/img/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        screenshots: [
          {
            src: 'public/assets/img/pwa-screenshot-desktop.png',
            sizes: '1850x1080',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Home screen showing main navigation and featured content',
          },
          {
            src: 'public/assets/img/pwa-screenshot-mobile.png',
            sizes: '408x906',
            type: 'image/png',
            platform: 'android',
            label: 'Home screen showing main navigation and featured content',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,}'],
      },
    }),
    //visualizer({ open: true }),
    vercel(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
