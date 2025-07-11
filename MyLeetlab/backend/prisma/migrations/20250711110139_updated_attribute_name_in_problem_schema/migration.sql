/*
  Warnings:

  - You are about to drop the column `editor` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "editor",
ADD COLUMN     "editorial" TEXT;
