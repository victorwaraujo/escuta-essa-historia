import { NextResponse } from 'next/server'

export async function POST() {
    try {
      const response = NextResponse.json(
        { message: 'Logout realizado com sucesso' },
        { status: 200 }
      )
      
      response.cookies.delete('authToken')
      return response
      
    } catch (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { message: 'Erro durante o logout' },
        { status: 500 }
      )
    }
  }