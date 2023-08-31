/*
  Warnings:

  - A unique constraint covering the columns `[topicId]` on the table `Flashcard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[topicId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_topicId_key" ON "Flashcard"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_topicId_key" ON "Question"("topicId");
