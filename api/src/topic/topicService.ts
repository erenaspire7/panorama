import { Prisma } from "@prisma/client";
import BaseResponse from "../utils/response";
import { CreateTopicRequest } from "./topicTypes";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma";
import { redisClient } from "../redis";
import Validator from "../utils/validator";

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
      const requiredProps = ["name", "content", "folderId"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.folder.findFirstOrThrow({
        where: {
          id: data.folderId,
          userId: user_id,
        },
      });

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
          name: data.name,
          folderId: data.folderId,
          data: fileName,
        },
      });

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
        data: "8201d9e5-6715-4ba5-a94f-74f73ec4875e/d77b6144-f99f-41bc-a9a4-aff73966e614.txt",
        topicId: "d77b6144-f99f-41bc-a9a4-aff73966e614",
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
}

export default TopicService;
