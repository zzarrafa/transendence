/*
  Warnings:

  - Made the column `level` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loses` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wins` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "loses" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "wins" SET NOT NULL;
