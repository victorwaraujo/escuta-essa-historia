/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Episode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "deletedAt",
DROP COLUMN "likes",
DROP COLUMN "updatedAt",
ADD COLUMN     "reactions" JSONB;
