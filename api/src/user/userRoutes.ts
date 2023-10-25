import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import UserService from "./userService";
import { tokenChecker } from "../utils/middleware";

const router = express.Router();

router.use(tokenChecker);

router.post(
  "/retrieve-default-pattern",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await UserService.loadDefaultSpacedRepetition(
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
