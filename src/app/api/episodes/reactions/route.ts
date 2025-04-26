import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

type ReactionCounts = Record<string, number>

const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥']



export async function POST(req: Request) {
  const { episodeId, emoji } = await req.json()

  if (!EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: "Emoji inválido" }, { status: 400 })
  }

  if (!episodeId || !EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      select: {
        id: true,
        title: true,
        reactions: true,
      }
    })

    const currentReactions: ReactionCounts = episode?.reactions 
      ? (episode.reactions as ReactionCounts) 
      : {}

    const newReactions: ReactionCounts = { ...currentReactions }

    const cookieStore = await cookies()
    const reactionsKey = `episode_${episodeId}_reactions`
    const userReactions = cookieStore.get(reactionsKey)?.value || ''

    if (userReactions.includes(emoji)) {
      return NextResponse.json(
        { error: "Você já reagiu com este emoji" },
        { status: 400 }
      );
    }

    newReactions[emoji] = (newReactions[emoji] || 0) + 1
    console.log("Atualizando episódio:", {
      id: episodeId,
      reactions: newReactions
    })

    await prisma.episode.update({
      where: { id: episodeId },
      data: {
        reactions: newReactions,
      }
    })

    const newUserReactions = userReactions + emoji;
    const response = NextResponse.json({
      success: true,
      reactions: newReactions
    });

    response.cookies.set(reactionsKey, newUserReactions, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error updating reactions:", error)
    return NextResponse.json(
      { error: "Failed to update reactions" },
      { status: 500 }
    )
  }
}