import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Adicione ao seu .env.local
const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAdminRoute = path.startsWith('/admin')

  if (isAdminRoute) {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { role?: string }
      if (decoded.role !== 'admin' && isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Falha na verificação do token:', error)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('authToken')
      return response
    }
  }

  return NextResponse.next()
}