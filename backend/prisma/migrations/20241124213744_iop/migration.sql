/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "status" SET DEFAULT 'RESERVED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address";
