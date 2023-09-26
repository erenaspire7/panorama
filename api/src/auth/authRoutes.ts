import express, { Request, Response, NextFunction } from "express";
import AuthService from "./authService";
import BaseResponse from "../utils/response";

const router = express.Router();

router.post(
  "/sign-up",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await AuthService.defaultSignUp(data);

    res.cookie("refreshToken", result.data.refreshToken!, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    });

    return res.status(result.statusCode).json({
      token: result.data.token,
    });
  }
);

router.post(
  "/sign-in",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await AuthService.defaultSignIn(data);

    res.cookie("refreshToken", result.data.refreshToken!, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      secure: false,
    });

    return res.status(result.statusCode).json({
      token: result.data.token,
    });
  }
);

router.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    let refreshToken = req.cookies.refreshToken;

    let result = await AuthService.refresh(refreshToken);

    if (result.statusCode == 404) {
      res.clearCookie("refreshToken");
    }

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

router.post(
  "/sign-out",
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refreshToken");

    return res.status(200).json({});
  }
);

export default router;
