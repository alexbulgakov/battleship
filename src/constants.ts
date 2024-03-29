export enum TYPES {
  REG = "reg",
  UPDATE_WINNERS = "update_winners",
  CREATE_ROOM = "create_room",
  ADD_USER_TO_ROOM = "add_user_to_room",
  CREATE_GAME = "create_game",
  UPDATE_ROOM = "update_room",
  ADD_SHIPS = "add_ships",
  START_GAME = "start_game",
  ATTACK = "attack",
  RANDOM_ATTACK = "randomAttack",
  TURN = "turn",
  FINISH = "finish",
}

export type SHIP_TYPES = "small" | "medium" | "large" | "huge";

export type GAME_TYPES = "waiting" | "in-progress" | "finished";

export enum SHIP_ACTION_TYPES {
  KILL = "kill",
  SHOT = "shot",
  MISS = "miss",
}
