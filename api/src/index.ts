import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { setupServices } from "./utils/setupServices";

const app = express();
const port = 4000;
const accessOrigins = [
  "http://localhost:5173",
  "https://panorama-b0e75.web.app",
];

const httpServer = createServer(app);
setupServices(httpServer, accessOrigins);

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

httpServer.listen(port);
console.log(`Running a server at http://localhost:${port}`);
