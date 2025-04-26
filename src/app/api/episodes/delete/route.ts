import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies() as unknown as { get: (name: string) => { value: string } | undefined }
    const token = cookieStore.get('authToken')?.value

    if (!token) {
      return NextResponse.json({ message: 'Token não encontrado - Faça login novamente' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string, email?: string }
    console.log('Token decodificado:', decoded)

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ message: 'ID do episódio é obrigatório' }, { status: 400 })
    }

    await prisma.episode.delete({ where: { id: String(id) } })

    return NextResponse.json({ message: 'Episódio deletado com sucesso' }, { status: 200 })

  } catch (error) {
    console.error('Erro no servidor:', error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Token inválido: ' + error.message }, { status: 401 })
    }

    return NextResponse.json({ message: 'Erro ao processar a requisição' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
