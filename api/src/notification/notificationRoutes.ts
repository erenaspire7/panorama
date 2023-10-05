import express, { Request, Response, NextFunction } from "express";
import NotificationService from "./notificationService";
import BaseResponse from "../utils/response";
import { tokenChecker } from "../utils/middleware";

const router = express.Router();
router.use(tokenChecker);

router.post(
  "/retrieve",
  async (req: Request, res: Response, next: NextFunction) => {
    let result: BaseResponse = await NotificationService.retrieve(
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/add-device",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await NotificationService.addDevice(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
