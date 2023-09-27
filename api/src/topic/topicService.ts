import { Prisma } from "@prisma/client";
import BaseResponse from "../utils/response";
import { CreateTopicRequest, RetrieveFlashcardsRequest } from "./topicTypes";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma";
import { redisClient } from "../redis";
import Validator from "../utils/validator";
import NotificationService from "../notification/notificationService";

const client = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

class TopicService {
  public static create = async (data: CreateTopicRequest, user_id: string) => {
    try {
      const requiredProps = ["title", "content"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const id = uuidv4();
      const fileName = `${id}.txt`;
      const key = `${user_id}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: "panorama-user-content",
        Key: key,
        Body: data.content,
      });

      await client.send(command);

      const topic = await prisma.topic.create({
        data: {
          id: id,
          name: data.title,
          userId: user_id,
          data: fileName,
        },
      });

      await NotificationService.create(
        "We're currently generating questions and flashcards. You'll be notified once they're ready! 📚✨",
        user_id
      );

      const message = {
        tasks: [
          {
            taskType: "question_generation",
            callbackUrl: "http://localhost:4000/api/callback/create-question",
          },
          {
            taskType: "flashcard_generation",
            callbackUrl: "http://localhost:4000/api/callback/create-flashcard",
          },
        ],
        data: key,
        topicId: topic.id,
      };

      await redisClient.publish("task_channel", JSON.stringify(message));

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

  public static retrieve = async (user_id: string) => {
    try {
      let topics = await prisma.topic.findMany({
        where: {
          userId: user_id,
        },
      });

      return new BaseResponse(200, {
        results: topics,
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

  public static getFlashcards = async (
    data: RetrieveFlashcardsRequest,
    user_id: string
  ) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      let topics = await prisma.topic.findFirstOrThrow({
        where: {
          userId: user_id,
          id: data.topicId,
        },
      });

      let flashcard = await prisma.flashcard.findFirstOrThrow({
        where: {
          topicId: data.topicId,
        },
      });

      return new BaseResponse(200, {
        results: flashcard.data as Prisma.JsonArray,
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

export default TopicService;
