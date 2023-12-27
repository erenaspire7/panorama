import express, { Request, Response, NextFunction } from "express";
import { signUp } from "./controller";
import BaseResponse from "../../utils/response";

const router = express.Router();

router.post(
  "/sign-up",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await signUp(data);

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    });

    return res.status(result.statusCode).json(result.data);
  }
);
