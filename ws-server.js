const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: 8080 });

console.log(`⚡ WebSocket running on port ${8080}`);

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", () => {
  console.log("📡 Client connected");
});

/* 🔥 KEEP simulation for now (works in production too) */
setInterval(() => {
  const types = ["whale_eth", "erc20_transfer", "dex_swap"];

  const type = types[Math.floor(Math.random() * types.length)];

  const event = {
    type,
    data: {
      hash: "0x" + Math.random().toString(16).slice(2, 14),
      from: "0x" + Math.random().toString(16).slice(2, 10),
      value: Math.floor(Math.random() * 100) + " ETH",
      blockNumber: Math.floor(Math.random() * 10000000),
    },
  };

  broadcast(event);
}, 2000);