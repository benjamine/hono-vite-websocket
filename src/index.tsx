import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { renderer } from './renderer';

const app = new Hono()

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
