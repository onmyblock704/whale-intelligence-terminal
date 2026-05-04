"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("⚡ WebSocket running on ws://localhost:8080");
// 🧪 fake whale generator (for UI testing)
function generateWhale() {
    return {
        type: "whale",
        data: {
            hash: "0x" + Math.random().toString(16).slice(2),
            from: "0x" + Math.random().toString(16).slice(2, 12),
            to: "0x" + Math.random().toString(16).slice(2, 12),
            value: (Math.random() * 50 * 1e18).toString(),
            blockNumber: Math.floor(Math.random() * 1000000),
        },
    };
}
wss.on("connection", function (socket) {
    console.log("⚡ Client connected");
    var interval = setInterval(function () {
        socket.send(JSON.stringify(generateWhale()));
    }, 2000);
    socket.on("close", function () { return clearInterval(interval); });
});
