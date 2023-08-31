import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import { tokenChecker } from "../utils/middleware";
import FolderService from "./folderService";

const router = express.Router();

router.use(tokenChecker);

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await FolderService.create(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  let result: BaseResponse = await FolderService.get(
    req.query,
    res.locals.user_id
  );

  return res.status(result.statusCode).json(result.data);
});

export default router;
