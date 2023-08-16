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
      try {
        await jwt.verify(user.refreshToken!, process.env.JWT_REFRESH_SECRET!);

        const tokenObj = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };

        const token = jwt.sign(tokenObj, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_SECRET_TOKEN_LIFE,
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

  static generateJWT = async (user: User) => {
    const tokenObj = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(tokenObj, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_SECRET_TOKEN_LIFE,
    });

    const refreshToken = jwt.sign(tokenObj, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
    });

    await prisma.user.update({
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
      // Validate + Hash
      let request = new SignUpVerifier(data);

      await request.hashPassword();

      const user = await prisma.user.create({
        data: request.deserialize(),
      });

      const response = await this.generateJWT(user);

      return new BaseResponse(200, response);
    } catch (e: any) {
      let message, statusCode;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          message = "Duplicate Email! Please sign up using another email";
          statusCode = 400;
        } else {
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
          const response = await this.generateJWT(user);

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
