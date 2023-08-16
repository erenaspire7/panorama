import express, { Request, Response, NextFunction } from "express";
import AuthService from "./authService";
import BaseResponse from "../utils/response";

const router = express.Router();

router.post(
  "/sign-up",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await AuthService.defaultSignUp(data);

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/sign-in",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await AuthService.defaultSignIn(data);

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result = await AuthService.refresh(data.refreshToken);
    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/forgot-password",
  async (req: Request, res: Response, next: NextFunction) => {}
);

router.post(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {}
);

export default router;
