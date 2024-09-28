-- CreateTable
CREATE TABLE "Foodtype" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "Foodtype_pkey" PRIMARY KEY ("id")
);
