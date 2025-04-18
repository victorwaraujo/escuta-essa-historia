"use client";
import { useState, useEffect } from "react";
import { Calendar, Mic, Clock, ThumbsUp, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiSpotify, SiYoutube, SiAmazon } from "react-icons/si";
import Image from "next/image";
import { FaDeezer, FaSoundcloud } from "react-icons/fa";

export interface EpisodeProps {
  id: number; // <- ADICIONADO
  title: string;
  date: string;
  tags: string[];
  audioUrl: string;
  imageUrl: string;
  duration: string;
  participants: string[];
  likes: number; // <- ADICIONADO
  spotifyUrl?: string;
  youtubeUrl?: string;
  amazonUrl?: string;
  deezerUrl?: string;
  soundcloudUrl?: string;
}

type PlatformIcon = {
  icon: React.ReactNode;
  link: string;
};

const EpisodeCard = ({
  id,
  title,
  date,
  tags,
  imageUrl,
  duration,
  participants,
  spotifyUrl,
  youtubeUrl,
  amazonUrl,
  deezerUrl,
  soundcloudUrl,
  likes: initialLikes, // <- INICIAL
}: EpisodeProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  const handleLike = async () => {
    setLikes((prev) => prev + 1);

    const idHeart = Date.now();
    setFloatingHearts((prev) => [...prev, idHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heartId) => heartId !== idHeart));
    }, 1000);

    // Enviar like para o backend
    try {
      await fetch("/api/episodes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ episodeId: id, like: true }),
      });
    } catch (error) {
      console.error("Erro ao curtir episódio:", error);
    }
  };

  const handlePlayClick = () => setShowPlatforms(true);

  useEffect(() => {
    if (showPlatforms) {
      const timer = setTimeout(() => {
        setShowPlatforms(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPlatforms]);

  const platformIcons: PlatformIcon[] = [
    spotifyUrl && {
      icon: <SiSpotify size={28} className="text-green-500" />,
      link: spotifyUrl,
    },
    youtubeUrl && {
      icon: <SiYoutube size={28} className="text-red-500" />,
      link: youtubeUrl,
    },
    amazonUrl && {
      icon: <SiAmazon size={28} className="text-yellow-500" />,
      link: amazonUrl,
    },
    deezerUrl && {
      icon: <FaDeezer size={28} className="text-gray-900" />,
      link: deezerUrl,
    },
    soundcloudUrl && {
      icon: <FaSoundcloud size={28} className="text-orange-600" />,
      link: soundcloudUrl,
    },
  ].filter(Boolean) as PlatformIcon[];

  return (
    <div className="relative bg-white border border-pink-100 text-gray-900 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 shadow-md hover:shadow-pink-300/50 hover:shadow-2xl transition-all duration-300 text-sm sm:text-base overflow-hidden">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xl bg-pink-100">
        <Image
          src={imageUrl}
          alt={title}
          width={128}
          height={128}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>

          <div className="flex items-center gap-2 text-gray-700 mb-1 text-xs sm:text-sm">
            <Mic size={16} /> <span>{participants.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mb-1 text-xs sm:text-sm">
            <Clock size={14} /> <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mb-1 text-xs sm:text-sm">
            <Calendar size={14} /> <span>{date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-pink-300/40 text-pink-900 text-xs font-medium px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="relative flex items-center gap-2 text-pink-600">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm font-medium hover:text-pink-800 transition-colors"
            >
              <ThumbsUp size={16} />
              Curtir
            </button>
            <span className="text-xs text-gray-700">{likes}</span>

            <div className="absolute top-0 left-0">
              <AnimatePresence>
                {floatingHearts.map((id) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -30, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute text-pink-500"
                  >
                    ❤️
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Botão play (mobile) */}
          <div className="sm:hidden">
            <AnimatePresence mode="wait">
              {!showPlatforms ? (
                <motion.button
                  key="play-mobile"
                  onClick={handlePlayClick}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center 
                    shadow-lg hover:bg-pink-700 active:bg-pink-800 transition-all duration-200"
                >
                  <Play size={18} />
                </motion.button>
              ) : (
                <motion.div
                  key="icons-mobile"
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {platformIcons.map(({ icon, link }, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      {icon}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop play icons */}
      <div className="hidden sm:flex items-center gap-3 absolute bottom-4 right-4">
        <AnimatePresence mode="wait">
          {!showPlatforms ? (
            <motion.button
              key="play-desktop"
              onClick={handlePlayClick}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center 
                shadow-lg hover:bg-pink-700 active:bg-pink-800 transition-all duration-200"
            >
              <Play size={20} />
            </motion.button>
          ) : (
            <motion.div
              key="icons-desktop"
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {platformIcons.map(({ icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  {icon}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EpisodeCard;