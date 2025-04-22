'use client'

import { useEffect, useState } from "react"
import NavBar from "@/components/NavBar/NavBar"
import MensagemCard from "@/components/MensagemCard"
import Image from "next/image"
import HeroImage from "/public/images/hero.jpg"
import { FaYoutube, FaSpotify, FaAmazon, FaDeezer, FaSoundcloud } from "react-icons/fa"

function gerarCorAleatoria(nome: string) {
  const cores = ["#ec4899", "#a855f7", "#f97316", "#10b981", "#3b82f6", "#f43f5e"]
  const index = nome.charCodeAt(0) % cores.length
  return cores[index]
}

interface Mensagem {
  id: number
  autor: string
  conteudo: string
  data: string // após formatação para string
  cor: string
}

export default function MensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [autor, setAutor] = useState("")
  const [conteudo, setConteudo] = useState("")

  // Buscar mensagens ao carregar a página
  useEffect(() => {
    async function fetchMensagens() {
      const res = await fetch("/api/messages")
      const data = await res.json()

      // Adiciona cor a cada mensagem (baseado no nome)
      const mensagensComCor = data.map((msg:Mensagem) => ({
        ...msg,
        cor: gerarCorAleatoria(msg.autor),
        data: new Date(msg.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      }))

      setMensagens(mensagensComCor)
    }

    fetchMensagens()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ autor, conteudo }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.ok) {
      const nova = await res.json()

      setMensagens((prev) => [
        {
          ...nova,
          cor: gerarCorAleatoria(nova.autor),
          data: new Date(nova.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        },
        ...prev,
      ])

      setAutor("")
      setConteudo("")
    }
  }

  return (
    <>
      <NavBar />
      <main className="bg-pink-50 min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-0 py-16 flex flex-col sm:flex-row gap-12">
          
          {/* Coluna Esquerda - Formulário e Mensagens */}
          <div className="flex-1 space-y-10">
            <div className="text-center sm:text-left max-w-2xl">
              <h1 className="text-4xl font-bold text-gray-600 font-display mb-2">
                Mensagens
              </h1>
              <p className="text-gray-700 font-body">
                Veja o que ouvintes estão dizendo e deixe sua mensagem também!
              </p>
            </div>

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-pink-100"
            >
              <input
                type="text"
                placeholder="Seu nome"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-body"
                required
              />
              <textarea
                placeholder="Escreva sua mensagem"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-body"
                rows={4}
                required
              />
              <div className="text-end">
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition font-body"
                >
                  Enviar mensagem
                </button>
              </div>
            </form>

            {/* Lista de mensagens */}
            <section className="space-y-6">
              {mensagens.map((mensagem) => (
                <MensagemCard key={mensagem.id} {...mensagem} />
              ))}
            </section>
          </div>

          {/* Coluna Direita - Imagem vertical */}
          <div className="hidden sm:block w-full max-w-sm h-[700px] relative rounded-2xl overflow-hidden shadow-lg transition duration-500 group hover:shadow-2xl hover:scale-[1.03]">
          <Image
            src={HeroImage}
            alt="Decorativa"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: 'right 20%' }}
          />
          </div>
        </section>
        
      </main>
      <footer className="bg-pink-200 border-t border-pink-200 py-6">
            <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-pink-800 text-sm">
              <p className="text-center sm:text-left font-body">
                © {new Date().getFullYear()} Escuta Essa História. Todos os direitos reservados.
              </p>
              <div className="flex gap-4 text-lg">
                <a href="https://open.spotify.com/show/2WAO8QLQPaCVmS5F8QwTD7" target="_blank" rel="noopener noreferrer" className="text-[#1DB954] hover:scale-110 transition-transform"><FaSpotify /></a>
                <a href="https://youtube.com/seucanal" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:scale-110 transition-transform"><FaYoutube /></a>
                <a href="https://music.amazon.com/podcasts/e4fd67cd-d51f-4629-ac4c-383453fb71ec/escuta-essa-hist%C3%B3ria" target="_blank" rel="noopener noreferrer" className="text-[#FF9900] hover:scale-110 transition-transform"><FaAmazon /></a>
                <a href="https://www.deezer.com/br/show/1000137625" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:scale-110 transition-transform"><FaDeezer /></a>
                <a href="https://soundcloud.com/escutaessahistoriaufam" target="_blank" rel="noopener noreferrer" className="text-[#fe4002] hover:scale-110 transition-transform"><FaSoundcloud /></a>
              </div>
            </div>
          </footer>
    </>
  )
}