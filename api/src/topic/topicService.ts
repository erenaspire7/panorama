import { Prisma, QuizType } from "@prisma/client";
import BaseResponse from "../utils/response";
import {
  CreateTopicRequest,
  RetrieveQuestionRequest,
  WriteQuizRequest,
} from "./topicTypes";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
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

      const user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      const gaps = user?.spacedRepetitionPattern!;

      const topic = await prisma.topic.create({
        data: {
          id: id,
          name: data.title,
          userId: user_id,
          data: fileName,
        },
      });

      for (let gap of gaps) {
        const newDate = new Date(topic.regDate);
        newDate.setDate(newDate.getUTCDate() + gap);

        await prisma.schedule.create({
          data: {
            expectedCompletionDate: newDate,
            topicId: topic.id,
          },
        });
      }

      await NotificationService.create(
        "We're currently generating questions and flashcards. You'll be notified once they're ready! 📚✨",
        user_id
      );

      const message = {
        tasks: [
          {
            taskType: "question_generation",
            callbackUrl: `${process.env.API_URL}/api/callback/create-question`,
          },
          {
            taskType: "flashcard_generation",
            callbackUrl: `${process.env.API_URL}/api/callback/create-flashcard`,
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
    data: RetrieveQuestionRequest,
    user_id: string
  ) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
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
        title: topic.name,
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

  public static getQuestions = async (
    data: RetrieveQuestionRequest,
    user_id: string
  ) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
        where: {
          userId: user_id,
          id: data.topicId,
        },
      });

      let question = await prisma.question.findFirstOrThrow({
        where: {
          topicId: data.topicId,
        },
      });

      let results = question.data as Prisma.JsonArray;

      if (data.mode != undefined && data.mode == "write") {
        results = results.filter((el: any) => el["type"] == "default");
      }

      return new BaseResponse(200, {
        results: results,
        title: topic.name,
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

  public static saveWriteQuiz = async (
    data: WriteQuizRequest,
    user_id: string
  ) => {
    try {
      const requiredProps = ["topicId", "answers"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.topic.findFirstOrThrow({
        where: {
          userId: user_id,
          id: data.topicId,
        },
      });

      const id = uuidv4();
      const fileName = `${id}.json`;
      const key = `${user_id}/write/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: "panorama-user-content",
        Key: key,
        Body: JSON.stringify(data.answers),
      });

      await client.send(command);

      await prisma.result.create({
        data: {
          id: id,
          quizType: QuizType.WRITE,
          data: fileName,
          topicId: data.topicId,
        },
      });

      await NotificationService.create(
        "Our AI is currently conducting analysis on your written quiz. You'll be notified once they're ready! 📚✨",
        user_id
      );

      const message = {
        tasks: [
          {
            taskType: "written_quiz_analysis",
            callbackUrl: `${process.env.API_URL}/api/callback/update-result`,
          },
        ],
        data: key,
        resultId: id,
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

  public static loadContent = async (data: any, user_id: string) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
        where: {
          id: data["topicId"],
        },
      });

      const key = `${user_id}/${topic?.data}`;

      const command = new GetObjectCommand({
        Bucket: "panorama-user-content",
        Key: key,
      });

      const response = await client.send(command);

      const content = await response.Body?.transformToString();

      return new BaseResponse(200, {
        title: topic.name,
        content: content,
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

  public static editContent = async (data: any, user_id: string) => {
    try {
      const requiredProps = ["title", "content", "topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirst({
        where: {
          id: data["topicId"],
        },
      });

      const key = `${user_id}/${topic?.data}`;

      const command = new PutObjectCommand({
        Bucket: "panorama-user-content",
        Key: key,
        Body: data["content"],
      });

      await client.send(command);

      const message = {
        tasks: [
          {
            taskType: "question_generation",
            callbackUrl: `${process.env.API_URL}/api/callback/create-question`,
          },
          {
            taskType: "flashcard_generation",
            callbackUrl: `${process.env.API_URL}/api/callback/create-flashcard`,
          },
        ],
        data: key,
        topicId: data["topicId"],
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

  public static loadNotificationSchedule = async (
    data: any,
    user_id: string
  ) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
        where: {
          id: data["topicId"],
          userId: user_id,
        },
      });

      const results = await prisma.schedule.findMany({
        where: {
          topicId: data["topicId"],
        },
      });

      return new BaseResponse(200, {
        results: results,
        title: topic.name,
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

  public static editTopicSpacedRepetittion = async (
    data: any,
    user_id: string
  ) => {
    try {
      const requiredProps = ["newDates", "topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.topic.findFirstOrThrow({
        where: {
          id: data["topicId"],
          userId: user_id,
        },
      });

      for (let el of data["newDates"]) {
        let id = el["id"];
        let date = el["date"];

        await prisma.schedule.update({
          where: {
            id: id,
          },
          data: {
            expectedCompletionDate: date,
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

  public static saveMatchResult = async (data: any, user_id: string) => {
    try {
      const requiredProps = ["timeTaken", "topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.topic.findFirstOrThrow({
        where: {
          userId: user_id,
          id: data.topicId,
        },
      });

      const id = uuidv4();
      const fileName = `${id}.json`;
      const key = `${user_id}/match/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: "panorama-user-content",
        Key: key,
        Body: JSON.stringify({
          timeTaken: data["timeTaken"],
        }),
      });

      await client.send(command);

      await prisma.result.create({
        data: {
          id: id,
          quizType: QuizType.MATCH,
          data: fileName,
          topicId: data.topicId,
          score: data["timeTaken"],
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

  public static generateReport = async (data: any, user_id: string) => {
    try {
      const requiredProps = ["topicId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      const topic = await prisma.topic.findFirstOrThrow({
        where: {
          userId: user_id,
          id: data.topicId,
        },
      });

      let key = `${user_id}/${topic?.data}`;

      const avgQuizScore = await prisma.result.aggregate({
        _avg: {
          score: true,
        },
        where: {
          topicId: data.topicId,
          quizType: QuizType.DEFAULT,
        },
      });

      const avgWriteScore = await prisma.result.aggregate({
        _avg: {
          score: true,
        },
        where: {
          topicId: data.topicId,
          quizType: QuizType.WRITE,
        },
      });

      const bestMatchModeTime = await prisma.result.aggregate({
        _min: {
          score: true,
        },
        where: {
          topicId: data.topicId,
          quizType: QuizType.MATCH,
        },
      });

      const matchModeData = await prisma.result.findMany({
        where: {
          topicId: data.topicId,
          quizType: QuizType.MATCH,
        },
        orderBy: {
          score: "asc",
        },
        take: 5,
      });

      let writtenData = null;

      let writtenMode = await prisma.result.findFirst({
        where: {
          topicId: data.topicId,
          quizType: QuizType.WRITE,
        },
        orderBy: {
          regDate: "desc",
        },
      });

      if (writtenMode != null) {
        let writeKey = `${user_id}/write/${writtenMode.data}`;

        const command = new GetObjectCommand({
          Bucket: "panorama-user-content",
          Key: writeKey,
        });

        const response = await client.send(command);
        const content = await response.Body?.transformToString();

        if (content != null || content != undefined) {
          writtenData = JSON.parse(content);
        }
      }

      const message = {
        tasks: [
          {
            taskType: "additional_resource_generation",
            callbackUrl: `${process.env.API_URL}/api/callback/retrieve-links`,
          },
        ],
        data: key,
        topicId: topic.id,
      };

      await redisClient.publish("task_channel", JSON.stringify(message));

      return new BaseResponse(200, {
        matchModeData: matchModeData,
        writtenModeData: writtenData,
        bestMatchModeTime: bestMatchModeTime._min.score,
        avgQuizScore: avgQuizScore._avg.score,
        avgWriteScore: avgWriteScore._avg.score,
        title: topic.name,
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

  public static getAdditionalLinks = () => {

  }
}

export default TopicService;
