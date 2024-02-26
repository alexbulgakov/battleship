import { WebSocketPayload, Ship, ShipCell } from "../types/index.js";
import { USERS, WINNERS, GAMES } from "../store/index.js";

import { currentPlayerIndex } from "../controllers/notifyPlayersOfTurn.js";

export const transformResponseToJSON = (
  response: WebSocketPayload<unknown>
) => {
  return JSON.stringify({ ...response, data: JSON.stringify(response.data) });
};

export const parseShips = (ships: Ship[]): ShipCell[] => {
  if (!ships.length) {
    throw new Error("No ships found");
  }

  return ships.map(({ position: { x, y }, direction, length, type }) => {
    const shipCells: { x: number; y: number }[] = [];
    shipCells.push({ x, y });

    for (let i = 0; i < length; i++) {
      shipCells.push({
        x: direction ? x : x + i,
        y: direction ? y + i : y,
      });
    }

    return { type, positions: shipCells };
  });
};

export const updateWinners = (winnerId: number) => {
  const winnerName = USERS.find((user) => user.id === winnerId)?.name!;

  const winner = WINNERS.find((winner) => winner.name === winnerName);

  if (winner) {
    winner.win++;
  } else {
    WINNERS.push({ name: winnerName, win: 1 });
  }
};

export const findEnemyIdPlayer = (
  idGame: number,
  currentPlayerIndex: number
) => {
  const game = GAMES.find((game) => game.idGame === idGame)!;

  const enemyPlayer = game.players.find(
    (player) => player.idPlayer !== currentPlayerIndex
  )!;

  return enemyPlayer.idPlayer!;
};

export const checkWinner = (gameId: number) => {
  const game = GAMES.find((game) => game.idGame === gameId)!;

  const enemyShips = game.players.find(
    (player) => player.idPlayer !== currentPlayerIndex
  )?.ships!;

  return enemyShips!.every((ship) => ship.positions.length === 0);
};
