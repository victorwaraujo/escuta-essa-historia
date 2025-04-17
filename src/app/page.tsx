import Link from "next/link";

import NavBar from "../components/NavBar/NavBar";
import HeroCarousel from "../components/Hero/HeroBanner";
import EpisodeCard from "../components/Episodes/EpisodeCards";
import { Mic, MessageSquareText } from "lucide-react";
import { FaEnvelope, FaInstagram } from "react-icons/fa";


const HomePage = () => {
  return (
    <main className="text-gray-900 bg-orange-50 min-h-screen">
      <NavBar />
      <HeroCarousel />

      <section id="episodios" className="max-w-7xl mx-auto py-10 px-6 sm:px-0">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-8">
          Últimos Episódios
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna 1-6: Episódios */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <EpisodeCard
              title="Escuta esse Tripé: Ensino, Pesquisa e Extensão"
              date="15 de abril de 2024"
              tags={["Pesquisa", "Extensão"]}
              audioUrl="/audios/episodio1.mp3"
              imageUrl="/images/ep2.jpg"
              duration= "string"
              participants= {["string"]}
              spotifyUrl="https://open.spotify.com/episode/0eaE0sWbMVaAldfnYYmqwp"
              youtubeUrl="https://youtube.com"
              amazonUrl="https://music.amazon.com"
              deezerUrl=""
              soundcloudUrl=""
            />

            <EpisodeCard
              title="Lugar de Quem? Paisagens em torno de Exus e Caboclos"
              date="9 de abril de 2024"
              tags={["HistóriaDoBrasil", "RegiaoNordeste"]}
              audioUrl="/audios/episodio2.mp3"
              imageUrl="/images/ep1.jpg"
              duration= "string"
              participants= {["string"]}
              spotifyUrl="https://open.spotify.com"
              youtubeUrl=""
              amazonUrl=""
              deezerUrl=""
              soundcloudUrl=""
            />
          </div>

          {/* Coluna 7-9: Mensagens */}
          <div className="lg:col-span-3 bg-pink-50 rounded-2xl p-6 text-center text-pink-800 shadow border border-pink-200 flex flex-col justify-between h-full">
            <h3 className="text-2xl font- font-display text-pink-600 mb-4">Mensagens</h3>
            <p className="italic mb-4">
              “O podcast me faz refletir sobre temas que nunca imaginei. Obrigado por tanto!”
            </p>
            <p className="italic mb-4">
              “A maneira como vocês tratam temas delicados é incrível. Continuem!”
            </p>
            <Link
              href="/mensagens"
              className="inline-block bg-white border border-pink-500 text-pink-600 hover:bg-pink-100 px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition hover:shadow-md"
            >
              <MessageSquareText size={16} className="inline mr-2" />
              Mais mensagens
            </Link>
          </div>

          {/* Coluna 10-12: Sobre */}
          <aside className="lg:col-span-3 bg-pink-50 border border-pink-200 rounded-2xl p-6 shadow text-center text-pink-800 flex flex-col justify-between h-full">
            <h3 className="text-2xl font-medium font-display text-pink-600 mb-4">Sobre</h3>
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-base leading-relaxed">
                🎓 Produzido por estudantes e egressos de História da UFAM.
              </p>
              <p className="text-base leading-relaxed">
                🧠 O objetivo é divulgar os trabalhos de Iniciação Científica do curso.
              </p>
            </div>
            <Link
              href="/episodios/1"
              className="inline-block bg-white border border-pink-500 text-pink-600 hover:bg-pink-100 px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition hover:shadow-md"
            >
              <Mic size={16} className="inline mr-2" />
              Ouça sobre nossa criação
            </Link>
          </aside>
        </div>
      </section>

      <section id="contato" className="bg-pink-400 py-12 px-6 sm:px-12 text-gray-800">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8 sm:p-10 border border-pink-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4 text-center">
            Entre em Contato
          </h2>

          <p className="text-center text-base sm:text-lg mb-6">
            Tem alguma dúvida, sugestão ou elogio? Fale com a gente!
          </p>

          {/* Ícones de redes sociais */}
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
              href="https://instagram.com/seuusuario"
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