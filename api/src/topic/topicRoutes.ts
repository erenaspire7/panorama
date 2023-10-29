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

router.post(
  "/flashcards",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;
    let result: BaseResponse = await TopicService.getFlashcards(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/questions",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.getQuestions(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/save-write-quiz",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.saveWriteQuiz(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/retrieve-content",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.loadContent(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/retrieve-schedules",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.loadNotificationSchedule(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/save-match-mode",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.saveMatchResult(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/generate-report",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result: BaseResponse = await TopicService.generateReport(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/save-default-quiz",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result = await TopicService.saveDefaultMode(data, res.locals.user_id);

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/edit-spaced-schedules",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result = await TopicService.editTopicSpacedRepetittion(
      data,
      res.locals.user_id
    );

    return res.status(result.statusCode).json(result.data);
  }
);

router.post(
  "/log-study",
  async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    let result = await TopicService.logStudy(data, res.locals.user_id);

    return res.status(result.statusCode).json(result.data);
  }
);

export default router;
