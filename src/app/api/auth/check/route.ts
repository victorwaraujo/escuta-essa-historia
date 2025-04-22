import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role?: string }

    return NextResponse.json({
      isAuthenticated: true,
      isAdmin: payload.role === 'admin'
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return NextResponse.json({ isAuthenticated: false, isAdmin: false })
  }
}