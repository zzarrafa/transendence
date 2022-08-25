/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "fullName",
DROP COLUMN "login",
DROP COLUMN "updatedAt",
ADD COLUMN     "level" INTEGER,
ADD COLUMN     "loses" INTEGER,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "wins" INTEGER;
