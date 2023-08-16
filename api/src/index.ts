import express from "express";
import cors from "cors";
import authRoutes from "./auth/authRoutes";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});
