"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play } from "lucide-react"
import { FaSpotify, FaYoutube, FaAmazon } from "react-icons/fa"
import { useState } from "react"

const HeroBanner = () => {
  const [showPlatforms, setShowPlatforms] = useState(false)

  return (
    <section className="w-full bg-gradient-to-b from-pink-100 to-orange-50">
      <div className="relative max-w-7xl mx-auto h-auto sm:h-[650px] overflow-hidden py-16 sm:py-0">

        {/* Decoração de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-pink-300 opacity-20"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-orange-300 opacity-20"></div>
        </div>

        <div className="relative h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start z-10 px-6 sm:px-12">
          
          {/* Texto principal */}
          <div className="w-full sm:w-1/2 text-center sm:text-left space-y-4 mb-6 sm:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl sm:text-7xl font-bold text-gray-900 leading-tight font-display"
            >
              <span className="text-pink-600">Escuta</span> Essa História
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-base sm:text-lg text-pink-700 font-medium font-display"
            >
              PODCAST
            </motion.p>
          </div>

          {/* Imagem Mobile */}
          <div className="relative w-52 h-52 block sm:hidden mb-6">
            <Image
              src="/images/hero.jpg"
              alt="Host do podcast"
              fill
              className="object-cover rounded-full shadow-xl"
            />
          </div>

          {/* Imagem Desktop */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[33%] h-[90%] pr-0 hidden sm:block">
            <div className="group relative h-full overflow-hidden rounded-2xl">
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0)" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/hero.jpg"
                  alt="Host"
                  layout="fill"
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Botão e plataformas */}
        <div className="relative sm:absolute bottom-12 left-0 sm:left-12 w-full flex flex-col items-center sm:items-start px-6 sm:px-0 mt-4 sm:mt-0 z-20">

          {/* Botão principal */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlatforms(!showPlatforms)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl text-lg sm:text-xl"
          >
            <Play size={24} className="text-white" />
            OUÇA AGORA
          </motion.button>

          {/* Mensagem de incentivo */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-3 text-pink-700 text-base sm:text-lg font-medium text-center sm:text-left"
          >
            Dê o play e mergulhe nessa narrativa!
          </motion.p>

          {/* Ícones de plataformas */}
          <AnimatePresence>
            {showPlatforms && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-6 flex gap-6 text-3xl"
              >
                <a
                  href="https://open.spotify.com/show/seu-podcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:scale-110 transition-transform"
                >
                  <FaSpotify />
                </a>
                <a
                  href="https://youtube.com/seucanal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF0000] hover:scale-110 transition-transform"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://music.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF9900] hover:scale-110 transition-transform"
                >
                  <FaAmazon />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner