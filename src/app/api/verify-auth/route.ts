import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: 'Erro de configuração do servidor' },
      { status: 500 }
    )
  }

  const token = request.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.json(
      { message: 'Não autenticado' },
      { status: 401 }
    )
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.json(
      { message: 'Autenticado' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro na verificação do token:', error)
    return NextResponse.json(
      { message: 'Token inválido ou expirado' },
      { status: 401 }
    )
  }
}