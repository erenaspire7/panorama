import express, { Request, Response, NextFunction } from "express";
import NotificationService from "./notificationService";
import BaseResponse from "../utils/response";

const router = express.Router();

router.post(
  "/retrieve",
  async (req: Request, res: Response, next: NextFunction) => {
    let result: BaseResponse = await NotificationService.retrieve(
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
