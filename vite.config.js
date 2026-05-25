import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemapPlugin from 'vite-plugin-sitemap'

export default defineConfig({
  base: '/iitk-gamedev-club-website/',
  plugins: [
    react(),
    sitemapPlugin({
      hostname: 'https://iitkgame.dev'
    })
  ]
})
