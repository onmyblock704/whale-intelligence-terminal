import { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;

export const initWebSocket = (server: any) => {
  if (wss) return wss;

  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("⚡ WebSocket connected");

    socket.send(JSON.stringify({ type: "connected" }));
  });

  return wss;
};

export const broadcastWhale = (whale: any) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({
          type: "whale",
          data: whale,
        })
      );
    }
  });
};