import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
// import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { serve } from '@hono/node-server';
import { renderer } from './renderer';

const app = new Hono()

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

app.use(renderer)

app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <script type='module' src='/static/client.js'></script>
        ) : (
          <script type='module' src='/src/client.ts'></script>
        )}
      </head>
      <body>
        <h1>Hello</h1>
        (check the console)
      </body>
    </html>
  )
})

const wsApp = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

export type WebSocketApp = typeof wsApp

export default app

const server = serve({
  ...app,
  port: 5174,
});

injectWebSocket(server)