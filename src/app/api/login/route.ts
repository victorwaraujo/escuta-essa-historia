import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })

    return NextResponse.json({ token })
  }

  return NextResponse.json(
    { message: 'Credenciais inválidas' },
    { status: 401 }
  )
}