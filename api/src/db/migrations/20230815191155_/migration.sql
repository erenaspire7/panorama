-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "regDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_key" ON "Otp"("userId");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
