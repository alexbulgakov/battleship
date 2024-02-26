import { WebSocketServer, WebSocket } from "ws";
import "dotenv/config";

import { handler } from "../handler.js";

import { WS_PLAYERS } from "../store/index.js";

const PORT = Number(process.env.WEB_SOCKET_PORT) || 3000;
let amountOfId: number = 0;

export const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (webSocket: WebSocket) => {
  const idPlayer = amountOfId++;
  WS_PLAYERS.set(idPlayer, webSocket);

  webSocket.on("message", async (data: Buffer) => {
    await handler(idPlayer, data);
  });

  webSocket.on("error", (e) => {
    console.log(e);
  });
});
