-- AlterTable
ALTER TABLE "User" ADD COLUMN     "spacedRepetitionPattern" INTEGER[];

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "expectedCompletionDate" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
