import 'dotenv/config';

import { httpServer } from './http_server/index.js';
import './websocket_server/index.js';

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181;

httpServer.listen(HTTP_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port, good luck!`);