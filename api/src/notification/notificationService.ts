import prisma from "../prisma";
import BaseResponse from "../utils/response";

class NotificationService {
  public static create = async (text: string, user_id: string) => {
    await prisma.notification.create({
      data: {
        userId: user_id,
        text: text,
      },
    });
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
}

export default NotificationService;
