import WebSocket from "ws";

import {
  TYPES,
  SHIP_TYPES,
  GAME_TYPES,
  SHIP_ACTION_TYPES,
} from "../constants.js";

export interface User {
  name: string;
  password: string;
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: SHIP_TYPES;
}

export interface ShipCell {
  positions: {
    x: number;
    y: number;
  }[];
  type: SHIP_TYPES;
}

export interface Player {
  idPlayer: number;
  isWinner: boolean;
  ships: ShipCell[];
}

export interface RoomUser {
  name: string;
  index: number;
}

export interface UserResponse extends User {
  error: boolean;
  errorText: string;
}

export interface UserWithId extends User {
  id: number;
}

export interface WebSocketWithId extends WebSocket {
  id: number;
}

export interface WebSocketPayload<T> {
  type: TYPES;
  data: T;
  id: number;
}

export interface Game {
  idGame: number;
  state: GAME_TYPES;
  players: Player[];
}

export interface CreateGame {
  idGame: number;
  idPlayer: number;
}

export interface StartGameDtoModel {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface Room {
  roomId: number;
  roomUsers: RoomUser[];
}

export interface AddShips {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface Attack {
  gameId: number;
  indexPlayer: number;
  x: number;
  y: number;
}

export interface RandomAttack {
  gameId: number;
  indexPlayer: number;
}

export interface AttackAnswer {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: SHIP_ACTION_TYPES;
}

export interface WinnerGame {
  name: string;
  win: number;
}

export interface FinishGame {
  winPlayer: number;
}
