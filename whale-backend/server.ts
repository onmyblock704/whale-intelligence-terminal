import "./http-server";
import { startListener } from "./listener";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

export const broadcast = (data: any) => {
  wss.clients.forEach((c) => {
    if (c.readyState === 1) {
      c.send(JSON.stringify(data));
    }
  });
};

wss.on("connection", () => {
  console.log("⚡ client connected");
});

startListener(broadcast);

console.log("⚡ Whale Intelligence backend running");