import { mainController } from "../handler.js";
import { notifyPlayersOfTurn } from "./notifyPlayersOfTurn.js";
import { attackAnswer } from "./attackAnswer.js";
import { finishGame } from "./finishGame.js";
import { winnersUpdate } from "./winnersUpdate.js";

import {
  transformResponseToJSON,
  checkWinner,
  updateWinners,
  findEnemyIdPlayer,
} from "../utils/index.js";

import { WebSocketPayload, Attack } from "../types/index.js";
import { SHIP_ACTION_TYPES } from "../constants.js";

export const attack = async (dataMessage: WebSocketPayload<Attack>) => {
  const { indexPlayer, gameId } = dataMessage.data;

  let result = await mainController.attack(
    dataMessage as WebSocketPayload<Attack>
  );
  const response = transformResponseToJSON(result);

  await attackAnswer(gameId, response);

  if (result.data.status === SHIP_ACTION_TYPES.KILL) {
    const isWinner = checkWinner(gameId);
    if (isWinner) {
      await finishGame(gameId, indexPlayer);
      updateWinners(indexPlayer);
      await winnersUpdate(gameId);
      return;
    }
  }
  const enemyId = findEnemyIdPlayer(gameId, indexPlayer);

  const nextTurnPlayerId =
    result.data.status === SHIP_ACTION_TYPES.MISS ? enemyId : indexPlayer;

  await notifyPlayersOfTurn(gameId, nextTurnPlayerId);
};
