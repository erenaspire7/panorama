import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import CallbackService from "./callbackService";

const router = express.Router();

router.post(
  "/create-question",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await CallbackService.createQuestion(data);

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/create-flashcard",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await CallbackService.createFlashcard(data);

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
