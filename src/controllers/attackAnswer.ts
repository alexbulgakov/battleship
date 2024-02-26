import { GAMES, WS_PLAYERS } from "../store/index.js";

export const attackAnswer = async (idGame: number, response: string) => {
  const game = GAMES.find((game) => game.idGame === idGame);

  if (game) {
    game.players.forEach((player) => {
      const webSocket = WS_PLAYERS.get(player.idPlayer)!;

      webSocket.send(response);
    });
  }
};
