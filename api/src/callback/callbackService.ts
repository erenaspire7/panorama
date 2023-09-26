import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import Validator from "../utils/validator";
import BaseResponse from "../utils/response";
import {
  TopicCallbackRequest,
  UpdateAnalogyTitleRequest,
} from "./callbackTypes";
import NotificationService from "../notification/notificationService";

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

      await prisma.question.create({
        data: request,
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

  public static createFlashcard = async (request: TopicCallbackRequest) => {
    try {
      const requiredProps = ["data", "topicId"];

      if (!Validator.interfaceValidator(request, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      let topic = await prisma.topic.findFirstOrThrow({
        where: {
          id: request.topicId,
        },
      });

      await prisma.flashcard.create({
        data: request,
      });

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
}

export default CallbackService;
