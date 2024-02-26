import { WS_PLAYERS, GAMES } from '../store/index.js';
import { TYPES } from '../constants.js';

export const createGame = (idGame: number) => {
  const game = GAMES.find((game) => game.idGame === idGame && game.players.length === 2);

  if (game) {
    game.players.forEach((player) => {
      const webSocket = WS_PLAYERS.get(player.idPlayer)!;

      const response = JSON.stringify({
        type: TYPES.CREATE_GAME,
        data: JSON.stringify({ idGame, idPlayer: player.idPlayer }),
        id: 0,
      });

      webSocket.send(response);
    });
  }
};