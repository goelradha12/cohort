/*
  Warnings:

  - You are about to drop the `ProblemPlayist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProblemPlayist" DROP CONSTRAINT "ProblemPlayist_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemPlayist" DROP CONSTRAINT "ProblemPlayist_problemId_fkey";

-- DropTable
DROP TABLE "ProblemPlayist";

-- CreateTable
CREATE TABLE "ProblemPlaylist" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemPlaylist_playlistId_problemId_key" ON "ProblemPlaylist"("playlistId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemPlaylist" ADD CONSTRAINT "ProblemPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemPlaylist" ADD CONSTRAINT "ProblemPlaylist_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
