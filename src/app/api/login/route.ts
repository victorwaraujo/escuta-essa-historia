import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(request: NextRequest) {
  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: 'Erro de configuração do servidor' },
      { status: 500 }
    )
  }

  try {
    const { email, password } = await request.json()

    if (email?.trim() !== ADMIN_EMAIL.trim() || password?.trim() !== ADMIN_PASSWORD.trim()) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { 
        email,
        role: 'admin' // Isso é essencial para identificar o usuário como admin
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    )


    const response = NextResponse.json(
      { message: 'Login realizado com sucesso' },
      { status: 200 }
    )

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 60 segundos (1 minuto)
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { message: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}