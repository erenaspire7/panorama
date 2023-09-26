import express, { Request, Response, NextFunction } from "express";
import BaseResponse from "../utils/response";
import CallbackService from "./callbackService";
import prisma from "../prisma";

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

router.post(
  "/emit-analogy",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    res.locals.io.emit("analogy-event", data);

    await prisma.chat.create({
      data: {
        message: data["message"],
        generated: true,
        analogyId: data["analogyId"],
      },
    });

    return res.status(200).json({});
  }
);

router.post(
  "/analogy-title",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await CallbackService.updateAnalogyTitle(data);

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
