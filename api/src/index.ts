import express from "express";
import cors from "cors";
import authRoutes from "./auth/authRoutes";
import folderRoutes from "./folder/folderRoutes";
import topicRoutes from "./topic/topicRoutes";
import callbackRoutes from "./callback/callbackRoutes";
import { setup } from "./redis";

const app = express();
const port = 4000;

(async () => {
  await setup();
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/callback", callbackRoutes);

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});
