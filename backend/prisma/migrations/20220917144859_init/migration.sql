/*
  Warnings:

  - You are about to drop the `UserRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRoom" DROP CONSTRAINT "UserRoom_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoom" DROP CONSTRAINT "UserRoom_userId_fkey";

-- DropTable
DROP TABLE "UserRoom";

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "role" INTEGER NOT NULL,
    "isMuted" BOOLEAN NOT NULL,
    "isBanned" BOOLEAN NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
