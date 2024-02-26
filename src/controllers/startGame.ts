import { GAMES, WS_PLAYERS } from "../store/index.js";
import { Game, Player } from "../types/index.js";
import { TYPES } from "../constants.js";

export const startGame = async (idGame: number): Promise<boolean> => {
  const game = GAMES.find((game: Game) => game.idGame === idGame);

  const everyPlayerWithShip = game?.players.every(
    (player) => player.ships.length > 0
  );

  if (game && everyPlayerWithShip) {
    game.state = "in-progress";

    game.players.forEach((player: Player) => {
      const webSocket = WS_PLAYERS.get(player.idPlayer)!;

      const response = JSON.stringify({
        type: TYPES.START_GAME,
        data: JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.idPlayer,
        }),
        id: 0,
      });

      webSocket.send(response);
    });
    return true;
  } else {
    return false;
  }
};
