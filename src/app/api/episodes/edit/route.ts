import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;


export async function PUT(request: Request) {
  try {
    const cookieStore = cookies() as unknown as { get: (name: string) => { value: string } | undefined };
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 403 });
    }

    const { id, ...episodeData } = await request.json();
    
    const updatedEpisode = await prisma.episode.update({
        where: { id: String(id) },
        data: {
          title: episodeData.title,
          date: new Date(episodeData.date),
          tags: Array.isArray(episodeData.tags) ? episodeData.tags.join(',') : episodeData.tags,
          imageUrl: episodeData.imageUrl,
          duration: episodeData.duration,
          participants: Array.isArray(episodeData.participants) ? episodeData.participants.join(',') : episodeData.participants,
          spotifyUrl: episodeData.spotifyUrl,
          youtubeUrl: episodeData.youtubeUrl,
          amazonUrl: episodeData.amazonUrl,
          deezerUrl: episodeData.deezerUrl,
          soundcloudUrl: episodeData.soundcloudUrl,
        }
      });

    return NextResponse.json({ 
      message: 'Episódio atualizado com sucesso',
      episode: updatedEpisode
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao editar episódio:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Erro ao processar a requisição' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}