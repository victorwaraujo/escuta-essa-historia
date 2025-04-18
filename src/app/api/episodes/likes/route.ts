import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { episodeId, like } = await req.json();

  if (!episodeId) {
    return NextResponse.json({ error: "Missing episodeId" }, { status: 400 });
  }

  try {
    const updated = await prisma.episode.update({
      where: { id: episodeId },
      data: {
        likes: {
          [like ? "increment" : "decrement"]: 1,
        },
      },
    });

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}