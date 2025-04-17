'use client'

import { useEffect, useState } from "react"
import NavBar from "@/components/NavBar/NavBar"
import EpisodeCard, { EpisodeProps } from "@/components/Episodes/EpisodeCards"
import { FaSpotify, FaYoutube, FaAmazon, FaDeezer, FaSoundcloud } from "react-icons/fa"

const EpisodiosPage = () => {
  const [episodios, setEpisodios] = useState<EpisodeProps[]>([])

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch('/api/episodes')
        const data = await res.json()
        setEpisodios(data)
      } catch (error) {
        console.error('Erro ao buscar episódios:', error)
      }
    }

    fetchEpisodes()
  }, [])

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col">
        <main className="bg-pink-50 flex-1">
          <section className="max-w-7xl mx-auto px-6 sm:px-0 py-16">
            <div className="text-center sm:text-left max-w-3xl mb-12">
              <h1 className="text-4xl font-bold text-gray-600 font-display mb-2">
                Episódios
              </h1>
              <p className="text-gray-700 font-body">
                Explore todos os episódios do nosso podcast! Novos episódios serão adicionados assim que forem publicados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {episodios.map((ep, idx) => (
                <EpisodeCard key={idx} {...ep} />
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-pink-200 border-t border-pink-200 py-6">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-pink-800 text-sm">
            <p className="text-center sm:text-left font-body">
              © {new Date().getFullYear()} Escuta Essa História. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-lg">
              <a href="https://open.spotify.com/show/seu-podcast" target="_blank" rel="noopener noreferrer" className="text-[#1DB954] hover:scale-110 transition-transform"><FaSpotify /></a>
              <a href="https://youtube.com/seucanal" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:scale-110 transition-transform"><FaYoutube /></a>
              <a href="https://music.amazon.com" target="_blank" rel="noopener noreferrer" className="text-[#FF9900] hover:scale-110 transition-transform"><FaAmazon /></a>
              <a href="https://www.deezer.com/br/show/1000137625" target="_blank" rel="noopener noreferrer" className="text-black hover:scale-110 transition-transform"><FaDeezer /></a>
              <a href="https://soundcloud.com/escutaessahistoriaufam" target="_blank" rel="noopener noreferrer" className="text-[#fe4002] hover:scale-110 transition-transform"><FaSoundcloud /></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default EpisodiosPage