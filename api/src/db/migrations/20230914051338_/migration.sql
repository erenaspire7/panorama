/*
  Warnings:

  - The values [GAP_FILL] on the enum `QuizType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuizType_new" AS ENUM ('DEFAULT', 'MATCH', 'WRITE');
ALTER TABLE "Result" ALTER COLUMN "quizType" TYPE "QuizType_new" USING ("quizType"::text::"QuizType_new");
ALTER TYPE "QuizType" RENAME TO "QuizType_old";
ALTER TYPE "QuizType_new" RENAME TO "QuizType";
DROP TYPE "QuizType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_folderId_fkey";

-- AlterTable
ALTER TABLE "Analogy" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
