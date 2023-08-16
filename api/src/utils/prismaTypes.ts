import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{}>;

export { User };
