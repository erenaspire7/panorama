import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import Validator from "../utils/validator";
import BaseResponse from "../utils/response";
import {
  TopicCallbackRequest,
  UpdateAnalogyTitleRequest,
  UpdateResultRequest,
} from "./callbackTypes";
import NotificationService from "../notification/notificationService";
import { request } from "http";

class CallbackService {
  public static createQuestion = async (request: TopicCallbackRequest) => {
    try {
      const requiredProps = ["data", "topicId"];

      if (!Validator.interfaceValidator(request, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.topic.findFirstOrThrow({
        where: {
          id: request.topicId,
        },
      });

      let question = await prisma.question.findFirst({
        where: {
          topicId: request.topicId,
        },
      });

      if (question == null) {
        await prisma.question.create({
          data: request,
        });
      } else {
        await prisma.question.update({
          where: {
            topicId: request.topicId,
          },
          data: {
            data: request.data,
          },
        });
      }

      return new BaseResponse(200, {});
    } catch (err: any) {
      let message, statusCode;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        message = "Server Error";
        statusCode = 500;
      } else {
        message = err.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };

  public static createFlashcard = async (request: TopicCallbackRequest) => {
    try {
      const requiredProps = ["data", "topicId"];

      if (!Validator.interfaceValidator(request, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
        where: {
          id: request.topicId,
        },
      });

      let flashcard = await prisma.flashcard.findFirst({
        where: {
          topicId: request.topicId,
        },
      });

      if (flashcard == null) {
        await prisma.flashcard.create({
          data: request,
        });
      } else {
        await prisma.flashcard.update({
          where: {
            topicId: request.topicId,
          },
          data: {
            data: request.data,
          },
        });
      }

      await NotificationService.create(
        "Great news! The questions and flashcards are now ready for you! 🎉📚✨",
        topic.userId
      );

      return new BaseResponse(200, {});
    } catch (err: any) {
      let message, statusCode;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        message = "Server Error";
        statusCode = 500;
      } else {
        message = err.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };

  public static updateAnalogyTitle = async (
    request: UpdateAnalogyTitleRequest
  ) => {
    try {
      const requiredProps = ["analogyId", "title"];

      if (!Validator.interfaceValidator(request, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.analogy.update({
        where: {
          id: request.analogyId,
        },
        data: {
          title: request.title,
        },
      });

      return new BaseResponse(200, {});
    } catch (err: any) {
      let message, statusCode;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        message = "Server Error";
        statusCode = 500;
      } else {
        message = err.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };

  public static updateResult = async (request: UpdateResultRequest) => {
    try {
      const requiredProps = ["resultId", "score"];

      if (!Validator.interfaceValidator(request, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.result.update({
        where: {
          id: request.resultId,
        },
        data: {
          score: request.score,
        },
      });

      return new BaseResponse(200, {});
    } catch (err: any) {
      let message, statusCode;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        message = "Server Error";
        statusCode = 500;
      } else {
        message = err.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };
}

export default CallbackService;
