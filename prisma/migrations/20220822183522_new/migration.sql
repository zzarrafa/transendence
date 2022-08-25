-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "twoFactorAuthenticationSecret" TEXT NOT NULL,
    "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");
