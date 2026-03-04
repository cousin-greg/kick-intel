-- CreateTable
CREATE TABLE "Streamer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "kickUrl" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "casino" TEXT,
    "casinoSlug" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StreamerSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamerId" INTEGER NOT NULL,
    "followersCount" INTEGER NOT NULL,
    "avgViewers7d" INTEGER NOT NULL DEFAULT 0,
    "peakViewers30d" INTEGER NOT NULL DEFAULT 0,
    "estMonthlyVol" TEXT,
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StreamerSnapshot_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamerId" INTEGER NOT NULL,
    "casino" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "estimatedVolume" TEXT,
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeaderboardEntry_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_username_key" ON "Streamer"("username");

-- CreateIndex
CREATE INDEX "StreamerSnapshot_streamerId_idx" ON "StreamerSnapshot"("streamerId");

-- CreateIndex
CREATE INDEX "StreamerSnapshot_capturedAt_idx" ON "StreamerSnapshot"("capturedAt");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_streamerId_idx" ON "LeaderboardEntry"("streamerId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_casino_idx" ON "LeaderboardEntry"("casino");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_capturedAt_idx" ON "LeaderboardEntry"("capturedAt");
