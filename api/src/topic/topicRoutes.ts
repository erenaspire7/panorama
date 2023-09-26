import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import { tokenChecker } from "../utils/middleware";
import TopicService from "./topicService";

const router = express.Router();

router.use(tokenChecker);

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await TopicService.create(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.get(
  "/retrieve",
  async (req: Request, res: Response, next: NextFunction) => {
    let result: BaseResponse = await TopicService.retrieve(res.locals.user_id);

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
