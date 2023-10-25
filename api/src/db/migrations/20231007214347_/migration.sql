-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "notified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "completed" SET DEFAULT false;
