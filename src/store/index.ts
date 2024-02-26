import WebSocket from "ws";

import { Game, Room, UserWithId, WinnerGame } from "../types/index.js";

export const GAMES: Game[] = [];

export const ROOMS: Room[] = [];

export const USERS: UserWithId[] = [];

export const WS_PLAYERS = new Map<number, WebSocket>();

export const WINNERS: WinnerGame[] = [];
