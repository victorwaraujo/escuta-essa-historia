-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tags" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "participants" TEXT NOT NULL,
    "spotifyUrl" TEXT,
    "youtubeUrl" TEXT,
    "amazonUrl" TEXT,
    "deezerUrl" TEXT,
    "soundcloudUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);
