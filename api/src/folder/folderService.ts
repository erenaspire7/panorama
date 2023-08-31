import { CreateFolderRequest } from "./folderTypes";
import BaseResponse from "../utils/response";
import Validator from "../utils/validator";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

class FolderService {
  public static create = async (data: CreateFolderRequest, user_id: string) => {
    try {
      let requiredProps = ["name"];
      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.folder.create({
        data: {
          name: data.name,
          desc: data.desc,
          userId: user_id,
        },
      });

      return new BaseResponse(200, {
        message: "Success",
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

  public static get = async (query_params: any, user_id: string) => {
    try {
      let page = query_params.page ?? 1;
      let limit = query_params.limit ?? 5;

      page = parseInt(page);
      limit = parseInt(limit);

      let total = await prisma.folder.count({
        where: {
          userId: user_id,
        },
      });

      let totalPages = Math.ceil(total / limit);

      let folders = await prisma.folder.findMany({
        where: {
          userId: user_id,
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      let data = {
        results: folders,
        page: page,
        limit: limit,
        totalPages: totalPages,
      };

      return new BaseResponse(200, data);
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

export default FolderService;
