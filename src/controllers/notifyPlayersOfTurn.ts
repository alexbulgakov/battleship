import { WS_PLAYERS, GAMES } from "../store/index.js";
import { TYPES } from "../constants.js";

export let currentPlayerIndex: number = 0;

export const notifyPlayersOfTurn = async (
  idGame: number,
  idPlayerForTurn: number
) => {
  const game = GAMES.find((game) => game.idGame === idGame);

  if (game) {
    game.players.forEach((player) => {
      const webSocket = WS_PLAYERS.get(player.idPlayer)!;

      const response = JSON.stringify({
        type: TYPES.TURN,
        data: JSON.stringify({ currentPlayerIndex: idPlayerForTurn }),
        id: 0,
      });

      currentPlayerIndex = idPlayerForTurn;

      webSocket.send(response);
    });
  }
};
