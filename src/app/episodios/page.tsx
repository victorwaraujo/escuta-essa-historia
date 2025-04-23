'use client'

import { useEffect, useState } from "react"
import NavBar from "@/components/NavBar/NavBar"
import EpisodeCard, { EpisodeProps } from "@/components/Episodes/EpisodeCards"
import { FaSpotify, FaYoutube, FaAmazon, FaDeezer, FaSoundcloud } from "react-icons/fa"

const EpisodiosPage = () => {
  const [episodios, setEpisodios] = useState<EpisodeProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
        
        const res = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Falha na verificação');
        
        const { isAdmin } = await res.json();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error('Erro na checagem:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch('/api/episodes')
        const data = await res.json()
        setEpisodios(data)
      } catch (error) {
        console.error('Erro ao buscar episódios:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisodes()
  }, [])

  return (
    <>
      <NavBar />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-pink-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">Carregando episódios...</p>
          </div>
        </div>
      ) : (
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

              {isAdmin && (
                <div className="w-full sm:w-auto flex justify-end mb-4"> {/* Container para alinhar à direita */}
                  <a
                    href="/admin"
                    className="inline-flex items-center gap-2 bg-white border-2 border-pink-500 text-pink-600 
                              hover:bg-pink-50 px-5 py-2 rounded-full transition-all duration-200 shadow-sm
                              hover:shadow-md font-medium text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Adicionar Episódio
                  </a>
                </div>
              )}

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
                <a href="https://open.spotify.com/show/2WAO8QLQPaCVmS5F8QwTD7" target="_blank" rel="noopener noreferrer" className="text-[#1DB954] hover:scale-110 transition-transform"><FaSpotify /></a>
                <a href="https://youtube.com/seucanal" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:scale-110 transition-transform"><FaYoutube /></a>
                <a href="https://music.amazon.com/podcasts/e4fd67cd-d51f-4629-ac4c-383453fb71ec/escuta-essa-hist%C3%B3ria" target="_blank" rel="noopener noreferrer" className="text-[#FF9900] hover:scale-110 transition-transform"><FaAmazon /></a>
                <a href="https://www.deezer.com/br/show/1000137625" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:scale-110 transition-transform"><FaDeezer /></a>
                <a href="https://soundcloud.com/escutaessahistoriaufam" target="_blank" rel="noopener noreferrer" className="text-[#fe4002] hover:scale-110 transition-transform"><FaSoundcloud /></a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}

export default EpisodiosPage