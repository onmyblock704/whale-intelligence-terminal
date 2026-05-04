import { createServer } from "http";
import next from "next";
import { initWebSocket } from "./lib/ws";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handler(req, res);
  });

  initWebSocket(server);

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});