import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { config } from "dotenv";

config();

const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT || 4000;
const INTERVAL_TIME = process.env.INTERVAL_TIME || 1000;

export const webss: WebSocketServer = new WebSocketServer({
  port: WEB_SOCKET_PORT,
});

const ping = (): void => {
  webss.clients.forEach((ws: WebSocket & { isAlive?: boolean }) => {
    if (!ws.isAlive) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
};

const readDuplexStream = (duplexStreamData: Duplex) => {
  return async () => {
    for await (let data of duplexStreamData) {
      console.log(data);
    }
  };
};

const interval = setInterval(ping, INTERVAL_TIME);

webss.on("connection", async (webSocket, request: IncomingMessage) => {
  if (!webSocket) {
    return;
  }

  console.log("Web socket server connection successful!");
  const duplexStream = createWebSocketStream(webSocket, {
    encoding: "utf-8",
    decodeStrings: false,
  }).setMaxListeners(0);

  //@ts-ignore
  webSocket.isAlive = true;

  webSocket.on("close", () => {
    duplexStream.destroy();
  });

  webSocket.on("pong", () => {
    //@ts-ignore
    webSocket.isAlive = true;
  });

  duplexStream.on("readable", readDuplexStream(duplexStream));
});

webss.on("close", () => {
  clearInterval(interval);
});
