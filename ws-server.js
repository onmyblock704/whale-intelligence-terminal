const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

console.log("⚡ WebSocket running on port", PORT);

wss.on("connection", (ws) => {
  console.log("📡 Client connected");

  ws.send(JSON.stringify({
    type: "init",
    data: { message: "connected to whale stream" }
  }));

  ws.on("message", (msg) => {
    console.log("📩 received:", msg.toString());
  });
});

// 🔥 test stream
setInterval(() => {
  const event = {
    type: "whale_eth",
    data: {
      hash: "0x" + Math.random().toString(16).slice(2),
      from: "0x" + Math.random().toString(16).slice(2, 8),
      value: (Math.random() * 100).toFixed(2) + " ETH",
      blockNumber: Math.floor(Math.random() * 10000000),
    },
  };

  console.log("📤 sending event");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
}, 2000);