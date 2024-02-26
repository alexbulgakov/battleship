import WebSocket from 'ws';

import { WS_PLAYERS, USERS } from '../store/index.js';

export const updateRoom = (response: string) => {
  WS_PLAYERS.forEach((webSocket: WebSocket, userId: number) => {
    const isMatchingUser = USERS.some(user => user.id === userId);

    if (isMatchingUser) {
      webSocket.send(response);
    }
  });
};