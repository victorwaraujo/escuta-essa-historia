'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaLock } from 'react-icons/fa'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de autenticação para administradores
    if (email === 'admin@podcast.com' && password === '123456') {
      router.push('/admin') // redireciona para página admin
    } else {
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <main className="bg-pink-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-pink-200 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-pink-100 text-pink-600 p-4 rounded-full mb-4">
            <FaLock size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-700 font-display">Área Administrativa</h1>
          <p className="text-sm text-gray-600 font-body text-center mt-2">
            Faça login para acessar o painel de gerenciamento do podcast.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 font-body">
              E-mail
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="admin@podcast.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 font-body">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 font-body">{error}</p>}

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
