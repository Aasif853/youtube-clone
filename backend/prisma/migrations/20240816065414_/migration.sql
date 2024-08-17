-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoUrl" TEXT,
ALTER COLUMN "username" DROP NOT NULL;
