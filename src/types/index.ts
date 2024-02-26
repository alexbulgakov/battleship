import { TYPES } from "../constants";

export interface RegistrationRequest {
  type: typeof TYPES.REG;
  data: {
    name: string;
    password: string;
  };
  id: number;
}

export interface RegistrationResponse {
  type: typeof TYPES.REG;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export interface UpdateWinners {
  type: typeof TYPES.UPDATE_WINNERS;
  data: [
    {
      name: string;
      password: string;
    }
  ];
  id: number;
}
