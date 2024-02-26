import { parseShips } from "../utils/index.js";

import { USERS, ROOMS, GAMES } from "../store/index.js";
import {
  WebSocketPayload,
  User,
  UserResponse,
  UserWithId,
  Room,
  Game,
  Player,
  AddShips,
  Attack,
  AttackAnswer,
} from "../types/index.js";
import { TYPES, SHIP_ACTION_TYPES } from "../constants.js";

export class MainController {
  public async registerUser(
    userId: number,
    dataMessage: WebSocketPayload<User>
  ): Promise<WebSocketPayload<UserResponse>> {
    const { type, data, id } = dataMessage;

    const responseData = { error: false, errorText: "" };
    const isUserExists = USERS.find(
      (user: UserWithId) =>
        user.name === data.name && user.password === data.password
    );

    if (!isUserExists) {
      USERS.push({ ...data, id: userId });
    }

    return { type, data: { ...data, ...responseData }, id };
  }

  public async createRoom(
    userId: number,
    dataMessage: WebSocketPayload<string>
  ): Promise<WebSocketPayload<Room[]>> {
    const { id } = dataMessage;

    const user = USERS.find((user: UserWithId) => user.id === userId);

    if (user) {
      const room: Room = {
        roomId: userId,
        roomUsers: [{ name: user.name, index: userId }],
      };
      ROOMS.push(room);

      const filteredRooms = ROOMS.filter((room) => room.roomUsers.length < 2);

      return { type: TYPES.UPDATE_ROOM, data: filteredRooms, id };
    } else {
      throw new Error("User not found");
    }
  }

  public async addUserToRoom(
    userId: number,
    dataMessage: WebSocketPayload<{ indexRoom: number }>
  ): Promise<number> {
    const newGame: Game = {
      idGame: GAMES.length,
      state: "waiting",
      players: [
        {
          idPlayer: userId,
          isWinner: false,
          ships: [],
        },
        {
          idPlayer: USERS.filter((user: UserWithId) => user.id !== userId)[0]
            ?.id!,
          isWinner: false,
          ships: [],
        },
      ],
    };

    GAMES.push(newGame);

    const roomIndex = ROOMS.findIndex(
      (room: Room) => room.roomId === dataMessage.data.indexRoom
    );

    if (roomIndex !== -1) {
      ROOMS.splice(roomIndex, 1);
    }

    return newGame.idGame;
  }

  public async addShips(
    userId: number,
    dataMessage: WebSocketPayload<AddShips>
  ): Promise<number> {
    const { data } = dataMessage;

    const game = GAMES.find((game: Game) => game.idGame === data.gameId);

    if (game) {
      const player = game.players.find(
        (player: Player) => player.idPlayer === userId
      );

      if (player) {
        player.ships = parseShips(data.ships);
      }
    }

    return data.gameId;
  }

  public async attack(
    dataMessage: WebSocketPayload<Attack>
  ): Promise<WebSocketPayload<AttackAnswer>> {
    const {
      data: { gameId, indexPlayer, x, y },
      id,
    } = dataMessage;

    let result = "" as SHIP_ACTION_TYPES;

    const game = GAMES.find((game) => game.idGame === gameId);

    if (game) {
      const enemyShips = game.players.find(
        (player) => player.idPlayer !== indexPlayer
      )!.ships;

      const hitShip = enemyShips.find(({ positions }) =>
        positions.some((position) => position.x === x && position.y === y)
      );

      if (hitShip) {
        const leftShipPositions = hitShip.positions.filter(
          (position) => position.x !== x || position.y !== y
        );
        hitShip.positions = leftShipPositions;
        result =
          leftShipPositions.length === 0
            ? SHIP_ACTION_TYPES.KILL
            : SHIP_ACTION_TYPES.SHOT;
      } else {
        result = SHIP_ACTION_TYPES.MISS;
      }

      return {
        type: TYPES.ATTACK,
        data: {
          position: { x, y },
          currentPlayer: indexPlayer,
          status: result,
        },
        id,
      };
    } else {
      throw new Error("Game not found");
    }
  }
}
