/*
  Warnings:

  - Made the column `twoFactorAuthenticationSecret` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isTwoFactorAuthenticationEnabled` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "twoFactorAuthenticationSecret" SET NOT NULL,
ALTER COLUMN "isTwoFactorAuthenticationEnabled" SET NOT NULL;
