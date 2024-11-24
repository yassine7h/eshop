/*
  Warnings:

  - You are about to drop the column `adresses` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adresses",
ADD COLUMN     "adresse" TEXT;
