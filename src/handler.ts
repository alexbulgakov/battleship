import { MainController } from './controllers/mainController.js';
import { updateRoom } from './controllers/updateRoom.js';
import { createGame } from './controllers/createGame.js';
import { startGame } from './controllers/startGame.js';
import { notifyPlayersOfTurn, currentPlayerIndex } from './controllers/notifyPlayersOfTurn.js';
import { attack } from './controllers/attack.js';

import { transformResponseToJSON, findEnemyIdPlayer } from './utils/index.js';

import { WebSocketPayload, User, AddShips, Attack } from './types/index.js';
import { WS_PLAYERS } from './store/index.js';
import { TYPES } from './constants.js';

export const mainController = new MainController();

export const handler = async (userId: number, dataMessage: Buffer) => {
  const webSocket = WS_PLAYERS.get(userId);
  if (!webSocket) {
    return;
  }

  try {
    let result;
    let parsedDataMessage = JSON.parse(dataMessage.toString());

    if (parsedDataMessage.data) {
      const data = JSON.parse(parsedDataMessage.data);
      parsedDataMessage = { ...parsedDataMessage, data };
    }

    switch (parsedDataMessage.type) {
      case TYPES.REG:
        result = await mainController.registerUser(userId, parsedDataMessage as WebSocketPayload<User>);
        webSocket.send(transformResponseToJSON(result));
        break;
      case TYPES.CREATE_ROOM:
        result = await mainController.createRoom(userId, parsedDataMessage as WebSocketPayload<string>);
        updateRoom(transformResponseToJSON(result));
        break;
      case TYPES.ADD_USER_TO_ROOM:
        result = await mainController.addUserToRoom(userId, parsedDataMessage as WebSocketPayload<{ indexRoom: number }>);
        createGame(result);
        break;
      case TYPES.ADD_SHIPS:
        const idGame = await mainController.addShips(userId, parsedDataMessage as WebSocketPayload<AddShips>);

        const isStarted = await startGame(idGame);

        if (isStarted) {
          const enemyIdPlayer = findEnemyIdPlayer(idGame, parsedDataMessage.data.indexPlayer);

          if (enemyIdPlayer) {
            await notifyPlayersOfTurn(idGame, enemyIdPlayer);
          }
        }
        break;
      case TYPES.ATTACK:
        const { indexPlayer } = parsedDataMessage.data as Attack;

        if (indexPlayer !== currentPlayerIndex) {
          return;
        }

        await attack(parsedDataMessage as WebSocketPayload<Attack>);
        break;
      case TYPES.RANDOM_ATTACK:
        const randomAttack = { ...parsedDataMessage.data, x: Math.random() * 10, y: Math.random() * 10 };
        await attack({ ...parsedDataMessage, data: { ...randomAttack } });
        break;
      default:
        console.log('Unknown message type');
    }
  } catch (e) {
    console.log(e);
  }
};