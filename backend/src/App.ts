import express from "express";
import SocketIO from "socket.io";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";

const secret = "dsfmrjvgiklordsijgrdsgoijmpdtsoinhdftrhydtr576j5j764573h66543";

import { createServer, Server } from "http";
import { BoardGameEvent } from "./constants/boardgame";
import { ChatMessage } from "../typings";
import routes from "./routes";
import MapHandler from "./events/socket/MapHandler";
import { advanceTheRound } from "./lib/boardGame";

export class ChatServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(morgan("dev"));
    this._app.use(express.json());
    this._app.use(cors());
    //this._app.options("*", cors);
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = new SocketIO.Server(this.server, {
      pingInterval: 10000,
      pingTimeout: 10000,
      cors: {
        origin: "*",
      },
    });

    // auth
    this.io.use((socket: ExtSocket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        next(new Error("Token not provided"));
        socket.disconnect();
      }
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          next(new Error("JWT error"));
          socket.disconnect();
        }
        socket.user = decoded;
        next();
      });
    });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("⚡️ Server running on port %s", this.port);
    });

    this._app.use(routes);

    this._app.post("/advanceRound", async (req, res) => {
      res.json(await advanceTheRound(this.io, req.body)).end();
    });

    this.io.on(BoardGameEvent.CONNECT, (socket: ExtSocket) => {
      // verify auth.
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.disconnect();
      }
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          socket.disconnect();
        }
        socket.user = decoded;
      });

      console.log("💻 Connected client on port %s.", this.port);
      if (!socket.user) return socket.disconnect();
      socket.join(socket.user.team.toString());

      socket.on(BoardGameEvent.MESSAGE, (m: ChatMessage) => {
        console.log("[server](message): %s", JSON.stringify(m));
        this.io.emit("message", m);
      });

      socket.on(BoardGameEvent.DISCONNECT, () => {
        console.log("Client disconnected");
      });

      socket.on("ping", (cb: any) => {
        if (typeof cb === "function") cb();
      });

      MapHandler(this.io, socket);
    });
  }

  get app(): express.Application {
    return this._app;
  }
}

export interface ExtSocket extends SocketIO.Socket {
  user?: Express.User;
}
