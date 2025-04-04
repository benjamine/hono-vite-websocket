import { defineConfig } from 'vite'

import build from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

// import { cloudflare } from '@cloudflare/vite-plugin'
// import ssrHotReload from 'vite-plugin-ssr-hot-reload'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/ws": {
        target: "ws://localhost:5174",
        ws: true,
      },
    }
  },
  plugins: [
    // ssrHotReload(), cloudflare()
    devServer({
      entry: 'src/index.tsx',
      adapter, // Cloudflare Adapter
    }),
    build(),
  ]
})
