import { Prisma, User } from "@prisma/client";
import prisma from "./../../prisma";
import BaseResponse from "../../utils/response";
import Validator from "../../utils/validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJWT = async (user: User, txPrisma: any = null) => {
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

const signUp = async (data: any) => {
  try {
    let response = {};

    let requiredProps = ["firstName", "lastName", "email", "password"];

    if (!Validator.interfaceValidator(data, requiredProps)) {
      throw Error("Invalid payload received!");
    }

    if (!Validator.emailValidator(data.email)) {
      throw Error("Invalid Email Provided!");
    }

    let salt = await bcrypt.genSalt();
    data["password"] = await bcrypt.hash(data["password"], salt);

    await prisma.$transaction(
      async (prisma) => {
        const user = await prisma.user.create({
          data: {
            ...data,
            spacedRepetitionPattern: [1, 6, 14, 30],
          },
        });

        response = await generateJWT(user, prisma);
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
      }
    );

    return new BaseResponse(200, response);
  } catch (err) {
    return new BaseResponse(400, {
      message: "Error",
    });
  }
};

export { signUp };
