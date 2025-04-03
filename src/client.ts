import { hc } from "hono/client";
import { WebSocketApp } from ".";

console.log("hello browser");

const client = hc<WebSocketApp>('http://localhost:8787')
const ws = client.ws.$ws(0);

ws.addEventListener('open', () => {
    setInterval(() => {
      ws.send(new Date().toString())
    }, 1000)
  })