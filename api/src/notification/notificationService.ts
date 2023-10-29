import prisma from "../prisma";
import BaseResponse from "../utils/response";
import Validator from "../utils/validator";
import { getMessaging } from "firebase-admin/messaging";

class NotificationService {
  public static create = async (text: string, user_id: string) => {
    await prisma.notification.create({
      data: {
        userId: user_id,
        text: text,
      },
    });

    const devices = await prisma.devices.findMany({
      where: {
        userId: user_id,
      },
      select: {
        notificationToken: true,
      },
    });

    const messages = devices
      .filter((el) => el.notificationToken != null)
      .map((el) => {
        return {
          token: el.notificationToken!,
          notification: {
            title: "Panorama!",
            body: text,
          },
        };
      });

    for (let message of messages) {
      getMessaging()
        .send(message)
        .then((response) => {
          // console.log("Successfully sent message:", response);
        });
    }
  };

  public static retrieve = async (user_id: string) => {
    let notifications = await prisma.notification.findMany({
      where: {
        userId: user_id,
        isRead: false,
      },
      orderBy: {
        regDate: "desc",
      },
    });

    return new BaseResponse(200, {
      results: notifications,
    });
  };

  public static addDevice = async (data: any, user_id: string) => {
    const requiredProps = ["notificationToken"];

    if (!Validator.interfaceValidator(data, requiredProps)) {
      throw Error("Invalid payload received!");
    }

    let existingDevice = await prisma.devices.findFirst({
      where: {
        userId: user_id,
        notificationToken: data.notificationToken,
      },
    });

    if (existingDevice == null) {
      await prisma.devices.create({
        data: {
          userId: user_id,
          notificationToken: data.notificationToken,
        },
      });
    }

    return new BaseResponse(200, {});
  };
}

export default NotificationService;
