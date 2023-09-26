import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import Validator from "../utils/validator";
import { AnalogyRequest } from "./analogyTypes";
import BaseResponse from "../utils/response";
import { redisClient } from "../redis";

class AnalogyService {
  public static create = async (data: AnalogyRequest, user_id: string) => {
    try {
      const requiredProps = ["message"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      let analogy;

      // Check If Analogy Exists
      if (data.analogyId != undefined || data.analogyId != null) {
        analogy = await prisma.analogy.findFirstOrThrow({
          where: {
            id: data.analogyId,
            userId: user_id,
          },
        });
      } else {
        analogy = await prisma.analogy.create({
          data: {
            userId: user_id,
          },
        });

        // Generate Title
        const msg = {
          tasks: [
            {
              taskType: "title_generation",
              callbackUrl: "http://localhost:4000/api/callback/analogy-title",
            },
          ],
          analogyId: analogy.id,
          text: data.message,
        };

        await redisClient.publish("task_channel", JSON.stringify(msg));
      }

      await prisma.chat.create({
        data: {
          message: data.message!,
          analogyId: analogy.id,
          generated: false,
        },
      });

      const message = {
        tasks: [
          {
            taskType: "analogy_generation",
            callbackUrl: "http://localhost:4000/api/callback/emit-analogy",
          },
        ],
        analogyId: analogy.id,
      };

      await redisClient.publish("task_channel", JSON.stringify(message));

      return new BaseResponse(200, {
        analogyId: analogy.id,
      });
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

  public static retrieve = async (data: AnalogyRequest, user_id: string) => {
    try {
      const requiredProps = ["analogyId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.analogy.findFirstOrThrow({
        where: {
          id: data.analogyId,
          userId: user_id,
        },
      });

      let chats = await prisma.chat.findMany({
        where: {
          analogyId: data.analogyId,
        },
        select: {
          message: true,
          generated: true,
        },
        orderBy: {
          regDate: "asc",
        },
      });

      return new BaseResponse(200, {
        results: chats,
      });
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
export default AnalogyService;
