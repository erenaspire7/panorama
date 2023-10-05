import express, { Request, Response, NextFunction } from "express";
import { tokenChecker } from "../utils/middleware";
import BaseResponse from "../utils/response";
import AnalogyService from "./analogyService";

const router = express.Router();

router.use(tokenChecker);

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await AnalogyService.create(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/retrieve",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await AnalogyService.retrieve(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/history",
  async (req: Request, res: Response, next: NextFunction) => {
    let result: BaseResponse = await AnalogyService.history(
      req.query,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);
export default router;
