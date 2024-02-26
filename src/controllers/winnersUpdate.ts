import { GAMES, WS_PLAYERS, WINNERS } from "../store/index.js";
import { TYPES } from "../constants.js";

export const winnersUpdate = async (idGame: number) => {
  const game = GAMES.find((game) => game.idGame === idGame)!;

  game.players.forEach((player) => {
    const webSocket = WS_PLAYERS.get(player.idPlayer)!;

    webSocket.send(
      JSON.stringify({
        type: TYPES.UPDATE_WINNERS,
        data: JSON.stringify({ winnersTable: WINNERS }),
      })
    );
  });
};
