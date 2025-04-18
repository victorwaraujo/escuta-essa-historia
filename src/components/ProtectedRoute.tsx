'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyToken = () => {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('authToken')

      if (!token) {
        console.error('Token não encontrado')
        router.push('/login')
        return
      }

      // Aqui, apenas verifica se o token existe, sem validar conteúdo.
      setIsLoading(false)
    }

    verifyToken()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}