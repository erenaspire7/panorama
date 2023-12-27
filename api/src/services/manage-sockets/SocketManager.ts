import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketManager {
  public io: Server;

  private static instance: SocketManager;

  constructor(httpServer: HttpServer, accessOrigins: string[]) {
    this.io = new Server(httpServer, {
      cors: {
        origin: accessOrigins,
      },
    });
  }

  public static getInstance(): SocketManager {
    return SocketManager.instance;
  }

  public static setup(httpServer: HttpServer, accessOrigins: string[]) {
    SocketManager.instance = new SocketManager(httpServer, accessOrigins);
  }
}
