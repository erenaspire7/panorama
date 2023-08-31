import {
  SignInRequest,
  SignInVerifier,
  SignUpRequest,
  SignUpVerifier,
} from "./authTypes";
import { User } from "../utils/prismaTypes";
import BaseResponse from "../utils/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import "dotenv/config";

class AuthService {
  public static refresh = async (refreshToken: string) => {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (user != undefined) {
      console.log(process.env.JWT_REFRESH_SECRET!);
      try {
        await jwt.verify(user.refreshToken!, process.env.JWT_REFRESH_SECRET!);

        const tokenObj = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };

        const token = jwt.sign(tokenObj, process.env.JWT_TOKEN_SECRET!, {
          expiresIn: process.env.JWT_TOKEN_LIFE,
        });

        return new BaseResponse(200, {
          token: token,
        });
      } catch (err) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            refreshToken: null,
          },
        });
      }
    }

    return new BaseResponse(404, {
      message: "Invalid Refresh Token! Please log in again",
    });
  };

  static generateJWT = async (user: User, txPrisma: any = null) => {
    const tokenObj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(tokenObj, process.env.JWT_TOKEN_SECRET!, {
      expiresIn: process.env.JWT_TOKEN_LIFE,
    });

    const refreshToken = jwt.sign(tokenObj, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
    });

    let prismaClient = txPrisma ?? prisma;

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    let response = {
      token: token,
      refreshToken: refreshToken,
    };

    return response;
  };

  public static defaultSignUp = async (data: SignUpRequest) => {
    try {
      let response = {};

      await prisma.$transaction(
        async (prisma) => {
          let request = new SignUpVerifier(data);

          await request.hashPassword();

          const user = await prisma.user.create({
            data: request.deserialize(),
          });

          response = await this.generateJWT(user, prisma);
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
        }
      );

      return new BaseResponse(200, response);
    } catch (e: any) {
      let message, statusCode;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          message = "Duplicate Email! Please sign up using another email";
          statusCode = 400;
        } else {
          console.log(e.message);
          message = "Server Error";
          statusCode = 500;
        }
      } else {
        message = e.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };

  public static defaultSignIn = async (data: SignInRequest) => {
    try {
      let request = new SignInVerifier(data);

      let user = await prisma.user.findFirst({
        where: {
          email: request.email,
        },
      });

      if (user != null && user != undefined) {
        let res = await bcrypt.compare(request.password, user.password!);

        if (res) {
          const response = await this.generateJWT(user, null);

          return new BaseResponse(200, response);
        }
      }

      throw Error("Incorrect login details!");
    } catch (e: any) {
      let message, statusCode;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = "Server Error";
        statusCode = 500;
      } else {
        message = e.message;
        statusCode = 400;
      }

      return new BaseResponse(statusCode, {
        message: message,
      });
    }
  };
}

export default AuthService;
