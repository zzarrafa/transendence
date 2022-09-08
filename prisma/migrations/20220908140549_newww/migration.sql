-- CreateTable
CREATE TABLE "Relationship" (
    "id" SERIAL NOT NULL,
    "receiver" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
