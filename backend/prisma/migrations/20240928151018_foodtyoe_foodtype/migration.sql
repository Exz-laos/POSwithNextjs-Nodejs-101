/*
  Warnings:

  - You are about to drop the `Foodtype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FoodSize" DROP CONSTRAINT "FoodSize_foodTypeId_fkey";

-- DropTable
DROP TABLE "Foodtype";

-- CreateTable
CREATE TABLE "FoodType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "FoodType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodSize" ADD CONSTRAINT "FoodSize_foodTypeId_fkey" FOREIGN KEY ("foodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
