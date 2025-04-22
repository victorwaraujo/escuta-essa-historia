-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT;
