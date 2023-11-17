import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import { tokenChecker } from "../utils/middleware";
import TaskService from "./taskService";

const router = express.Router();

router.post(
  "/trigger-daily-notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    let result: BaseResponse = await TaskService.triggerDailyNotifications();

    return res.status(200).json({});
  }
);

export default router;
