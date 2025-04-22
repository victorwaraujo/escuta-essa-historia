import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto'

export async function DELETE(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  if (!token) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string }
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
    }

    const { id } = await request.json()
    
    const deletedEpisode = await prisma.episode.delete({
      where: { id }
    })

    return NextResponse.json(deletedEpisode, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar episódio:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar episódio' },
      { status: 500 }
    )
  }
}