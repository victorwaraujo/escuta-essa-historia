import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Episode } from "@prisma/client"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      title,
      date,
      tags,
      imageUrl,
      duration,
      participants,
      spotifyUrl,
      youtubeUrl,
      amazonUrl,
      deezerUrl,
      soundcloudUrl,
    } = body;

    if (!title || !date || !tags || !imageUrl || !duration || !participants) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const episode = await prisma.episode.create({
      data: {
        title,
        date: new Date(`${date}T00:00:00`),
        tags: tags.join(","), 
        imageUrl,
        duration,
        participants,
        spotifyUrl,
        youtubeUrl,
        amazonUrl,
        deezerUrl,
        soundcloudUrl,
      },
    })

    return NextResponse.json(episode)
  } catch (error) {
    console.error("Erro ao criar episódio:", error)
    return new NextResponse("Erro interno ao criar episódio.", { status: 500 })
  }
}

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get("limit") || "0")
  
      const episodes: Episode[] = await prisma.episode.findMany({
        orderBy: { date: "desc" },
        take: limit > 0 ? limit : undefined,
      })
  
      const episodesFormatted = episodes.map((ep) => ({
        ...ep,
        tags: ep.tags ? ep.tags.split(",").map((tag) => tag.trim()) : [],
        participants: ep.participants
          ? ep.participants.split(",").map((name) => name.trim())
          : [],
        date: formatDate(ep.date.toString()),
        duration: String(ep.duration),
      }))
  
      return NextResponse.json(episodesFormatted)
    } catch (error) {
      console.error("Erro ao buscar episódios:", error)
      return new NextResponse("Erro ao buscar episódios", { status: 500 })
    }
  }