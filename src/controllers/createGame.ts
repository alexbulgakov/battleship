import { WebSocket, RawData } from "ws";

import { TYPES } from "../constants";

export class Create {
  public ws: WebSocket;

  public connection = (ws: WebSocket): void => {
    this.ws = ws;

    ws.on("message", this.message);

    ws.on("error", (err) => {
      console.log(err);
    });

    ws.send("Websocket server ready");
  };

  private message = (data: RawData): void => {
    const parsedData = JSON.parse(data.toString());

    const newData = JSON.stringify({
      name: parsedData.name,
      index: 0,
      error: false,
      errorText: "",
    });

    const messageData = {
      type: TYPES.REG,
      data: newData,
      id: 0,
    };

    this.ws.send(JSON.stringify(messageData));
  };
}
