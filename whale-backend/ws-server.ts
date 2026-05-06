import { WebSocketServer } from "ws";
import "./http-server";

const wss = new WebSocketServer({ port: 8080 });

console.log("⚡ Whale backend running on ws://localhost:8080");

// 🧠 fake stream (replace later with real blockchain listener)
function generateWhale() {
  const eth = Math.random() * 100;

  return {
    type: "whale",
    data: {
      hash: "0x" + Math.random().toString(16).slice(2),
      from: "0x" + Math.random().toString(16).slice(2, 12),
      to: "0x" + Math.random().toString(16).slice(2, 12),
      value: (eth * 1e18).toString(),
      blockNumber: Math.floor(Math.random() * 1000000),
    },
  };
}

// broadcast loop
setInterval(() => {
  const whale = generateWhale();

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(whale));
    }
  });
}, 2000);