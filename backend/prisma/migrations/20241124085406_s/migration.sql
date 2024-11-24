/*
  Warnings:

  - You are about to drop the column `adresse` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adresse",
ADD COLUMN     "address" TEXT;
