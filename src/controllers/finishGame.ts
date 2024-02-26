import { GAMES, WS_PLAYERS } from "../store/index.js";
import { TYPES } from "../constants.js";

export const finishGame = async (idGame: number, winnerId: number) => {
  const game = GAMES.find((game) => game.idGame === idGame)!;

  game.players.forEach((player) => {
    const webSocket = WS_PLAYERS.get(player.idPlayer)!;

    webSocket.send(
      JSON.stringify({
        type: TYPES.FINISH,
        data: JSON.stringify({ winPlayer: winnerId }),
      })
    );
  });
};
