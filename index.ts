import "dotenv/config";
import { CreateWebSocketServer } from "./src/websocket_server";
import { httpServer } from "./src/http_server";

const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 8181;
const WEB_SOCKET_PORT: number = Number(process.env.WEB_SOCKET_PORT) || 4000;

httpServer.listen(HTTP_PORT);
new CreateWebSocketServer(WEB_SOCKET_PORT);

console.log(
  `Start static http server on the ${HTTP_PORT} port and websocket server on the ${WEB_SOCKET_PORT} port.`
);
