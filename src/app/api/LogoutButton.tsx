'use client'

import { useRouter } from 'next/navigation'

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/login')
      router.refresh() 
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-xl hover:bg-red-200 transition text-sm font-medium"
    >
      Sair
    </button>
  )
}

export default LogoutButton