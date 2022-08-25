-- AlterTable
ALTER TABLE "User" ALTER COLUMN "twoFactorAuthenticationSecret" DROP NOT NULL,
ALTER COLUMN "isTwoFactorAuthenticationEnabled" DROP NOT NULL;
