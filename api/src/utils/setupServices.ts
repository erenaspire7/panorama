import { SocketManager } from "../services/manage-sockets/SocketManager";
import { TaskManager } from "../services/manage-tasks/TaskManager";
import { Server as HttpServer } from "http";

export const setupServices = (
  httpServer: HttpServer,
  accessOrigins: string[]
) => {
  SocketManager.setup(httpServer, accessOrigins);
  TaskManager.setup(10);



};
