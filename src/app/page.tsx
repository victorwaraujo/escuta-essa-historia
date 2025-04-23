"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar/NavBar";
import HeroCarousel from "../components/Hero/HeroBanner";
import EpisodeCard from "../components/Episodes/EpisodeCards";
import { Mic, MessageSquareText } from "lucide-react";
import { FaEnvelope, FaInstagram, FaSpotify, FaYoutube, FaAmazon, FaDeezer, FaSoundcloud } from "react-icons/fa";

interface Episodio {
  id: number;
  title: string;
  date: string;
  tags: string[];
  audioUrl: string;
  imageUrl: string;
  duration: string;
  participants: string[];
  likes: number;
  spotifyUrl?: string;
  youtubeUrl?: string;
  amazonUrl?: string;
  deezerUrl?: string;
  soundcloudUrl?: string;
}

interface Mensagem {
  id: number;
  autor: string;
  conteudo: string;
  data: string;
}

const HomePage = () => {
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [boxHeight, setBoxHeight] = useState<number | null>(null);
  const episodioColRef = useRef<HTMLDivElement | null>(null);

  const [showLinks, setShowLinks] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchData() {
      const epRes = await fetch("/api/episodes?limit=2");
      const epData = await epRes.json();
      setEpisodios(epData);

      const msgRes = await fetch("/api/messages?limit=2");
      const msgData = await msgRes.json();
      setMensagens(msgData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (episodioColRef.current) {
        setBoxHeight(episodioColRef.current.offsetHeight);
      }
    });

    if (episodioColRef.current) {
      resizeObserver.observe(episodioColRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [episodios]);

  const handleClick = () => {
    setShowLinks(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setShowLinks(false);
    }, 5000);
  };

  return (
    <main className="text-gray-900 bg-pink-50 min-h-screen">
      <NavBar />
      <HeroCarousel />

      <section id="episodios" className="max-w-7xl mx-auto py-10 px-6 sm:px-0">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-8">
          Últimos Episódios
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Episódios */}
          <div ref={episodioColRef} className="lg:col-span-6 flex flex-col gap-6">
            {episodios.map((ep) => (
              <EpisodeCard key={ep.id} {...ep} />
            ))}
          </div>

          {/* Mensagens */}
          <div
            className="lg:col-span-3 bg-purple-100 rounded-2xl p-6 text-center text-pink-800 shadow border border-pink-200 flex flex-col justify-between max-h-[400px] sm:max-h-full overflow-hidden"
            style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
          >
            <h3 className="text-2xl font-display text-pink-600 mb-4">Mensagens</h3>

            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto px-2 pt-4">
                <div className="flex flex-col justify-center min-h-full">
                  {mensagens.map((msg) => (
                    <div key={msg.id} className="italic mb-4">
                      <p>“{msg.conteudo}”</p>
                      <p className="text-sm text-gray-600 mt-1">- {msg.autor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/mensagens"
              className="inline-block bg-white border border-pink-500 text-pink-600 hover:bg-pink-100 px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition hover:shadow-md mt-4"
            >
              <MessageSquareText size={16} className="inline mr-2" />
              Mais mensagens
            </Link>
          </div>

          {/* Sobre */}
          <aside
            className="lg:col-span-3 bg-purple-100 border border-pink-200 rounded-2xl p-6 shadow text-center text-pink-800 flex flex-col justify-between max-h-[400px] sm:max-h-full overflow-hidden"
            style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
          >
            <h3 className="text-2xl font-medium font-display text-pink-600 mb-4">Sobre</h3>
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-base leading-relaxed">
                🎓 Produzido por estudantes e egressos de História da UFAM.
              </p>
              <p className="text-base leading-relaxed">
                🧠 O objetivo é divulgar os trabalhos de Iniciação Científica do curso.
              </p>
            </div>

            <div>
              <button
                onClick={handleClick}
                className="inline-block bg-white border border-pink-500 text-pink-600 hover:bg-pink-100 px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition hover:shadow-md"
              >
                <Mic size={16} className="inline mr-2" />
                Ouça sobre nossa criação
              </button>

              {showLinks && (
                <div className="mt-4 flex justify-center gap-4 text-2xl animate-fade-in transition-opacity duration-300">
                  <a href="https://open.spotify.com/episode/6zK0MFZhDOwDh6I2GYEpZ4" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform"><FaSpotify /></a>
                  <a href="https://youtube.com/watch?v=sua-url" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:scale-110 transition-transform"><FaYoutube /></a>
                  <a href="https://music.amazon.com/podcasts/e4fd67cd-d51f-4629-ac4c-383453fb71ec/episodes/47d6887f-8827-430c-b714-23109c8369f6/escuta-essa-hist%C3%B3ria-escuta-essa-hist%C3%B3ria---apresenta%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:scale-110 transition-transform"><FaAmazon /></a>
                  <a href="https://dzr.page.link/zeKnxhqaZvN8NaXc6" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:scale-110 transition-transform"><FaDeezer /></a>
                  <a href="https://soundcloud.com/escutaessahistoriaufam/escuta-essa-historia" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:scale-110 transition-transform"><FaSoundcloud /></a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-pink-500 py-12 px-6 sm:px-12 text-gray-800">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8 sm:p-10 border border-pink-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4 text-center">
            Entre em Contato
          </h2>
          <p className="text-center text-base sm:text-lg mb-6">
            Tem alguma dúvida, sugestão ou elogio? Fale com a gente!
          </p>
          <div className="flex justify-center gap-6 text-3xl mt-4">
            <a
              href="mailto:escutaessahistoria@ufam.edu.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-gray-800 transition-colors"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://www.instagram.com/escutaessahistoria_/?igsh=MXE2M2N1YjZqdWF3OQ%3D%3D#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:opacity-80 transition-opacity"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;