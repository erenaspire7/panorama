import { Prisma } from "@prisma/client";
import BaseResponse from "../utils/response";
import Validator from "../utils/validator";
import prisma from "../prisma";

class UserService {
  public static editDefaultSpacedRepetition = async (
    data: any,
    user_id: string
  ) => {
    try {
      const requiredProps = ["pattern"];

      if (!Validator.interfaceValidator(data, requiredProps)) {
        throw Error("Invalid payload received!");
      }

      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          spacedRepetitionPattern: data["pattern"],
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



  public static loadDefaultSpacedRepetition = async (user_id: string) => {
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: user_id,
        },
      });

      return new BaseResponse(200, {
        results: user.spacedRepetitionPattern,
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

export default UserService;
