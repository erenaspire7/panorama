import express from "express";
import authRoutes from "./auth/authRoutes";
import folderRoutes from "./folder/folderRoutes";
import topicRoutes from "./topic/topicRoutes";
import callbackRoutes from "./callback/callbackRoutes";
import analogyRoutes from "./analogy/analogyRoutes";
import notificationRoutes from "./notification/notificationRoutes";
import userRoutes from "./user/userRoutes";
import taskRoutes from "./task/taskRoutes";
import { setup } from "./redis";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { initializeApp } from "firebase-admin/app";
import * as admin from "firebase-admin";
import serviceAccount from "./google-service-account.json";

initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app = express();
const port = 4000;

const accessOrigins = ["http://localhost:5173", "https://panorama-b0e75.web.app"];

(async () => {
  await setup();
})();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: accessOrigins,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.options("*", (req, res, next) => {
  if (
    req.headers.origin != undefined &&
    accessOrigins.includes(req.headers.origin)
  ) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
    );
  }
  res.sendStatus(204);
});

app.use((req, res, next) => {
  res.locals.io = io;
  if (
    req.headers.origin != undefined &&
    accessOrigins.includes(req.headers.origin)
  ) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/callback", callbackRoutes);
app.use("/api/analogy", analogyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

httpServer.listen(port);
console.log(`Running a server at http://localhost:${port}`);
