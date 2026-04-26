import { createServer } from "node:http";
import next from "next";
import { WebSocketServer } from "ws";
import { attachWebSocketHandlers } from "./src/lib/timer/ws-handler";

const port = parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));

  const wss = new WebSocketServer({ noServer: true });
  attachWebSocketHandlers(wss);

  httpServer.on("upgrade", (req, socket, head) => {
    const pathname = new URL(
      req.url ?? "",
      `http://${req.headers.host ?? "localhost"}`,
    ).pathname;

    if (pathname === "/ws/timer") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
    // Next.js HMR upgrade is handled by its own listener (don't destroy socket).
  });

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} (ws: /ws/timer)`,
    );
  });
});
