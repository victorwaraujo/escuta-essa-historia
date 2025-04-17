import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '0'); // 0 se não passar limit

  const mensagens = await prisma.mensagem.findMany({
    take: limit > 0 ? limit : undefined, // Só aplica o limit se ele for maior que 0
    orderBy: { id: "desc" },
  });

  return NextResponse.json(mensagens);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { autor, conteudo } = body;

  if (!autor || !conteudo) {
    return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
  }

  const novaMensagem = await prisma.mensagem.create({
    data: {
      autor,
      conteudo,
    },
  });

  return NextResponse.json(novaMensagem, { status: 201 });
}