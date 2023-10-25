import NotificationService from "../notification/notificationService";
import prisma from "../prisma";
import { Schedule } from "@prisma/client";
import BaseResponse from "../utils/response";

class TaskService {
  public static triggerDailyNotifications = async () => {
    const schedules: Schedule[] = await prisma.$queryRaw`
      SELECT * FROM "Schedule"
      WHERE "completed" = false 
      AND "notified" = false 
      AND DATE("expectedCompletionDate") = CURRENT_DATE
    `;

    for (let schedule of schedules) {
      let topic = await prisma.topic.findFirst({
        where: {
          id: schedule.topicId,
        },
      });

      if (topic != null) {
        let text = `Don't forget to dive into ${
          topic!.name
        } today and make progress towards your academic goals! Your dedication is the key to success.`;

        await NotificationService.create(text, topic!.userId);

        await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            notified: true,
          },
        });
      }
    }

    return new BaseResponse(200, {});
  };
}

export default TaskService;
