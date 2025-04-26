"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Mic, Clock, Play, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiSpotify, SiYoutube, SiAmazon } from "react-icons/si";
import Image from "next/image";
import { FaDeezer, FaSoundcloud } from "react-icons/fa";

export interface EpisodeProps {
  id: number;
  title: string;
  date: string;
  tags: string[];
  imageUrl: string;
  duration: string;
  participants: string[];
  spotifyUrl?: string;
  youtubeUrl?: string;
  amazonUrl?: string;
  deezerUrl?: string;
  soundcloudUrl?: string;
  onEpisodeDeleted?: () => void;
  reactions?: Record<string, number>;
  
}

type PlatformIcon = {
  icon: React.ReactNode;
  link: string;
};

const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥'] 


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
  onEpisodeDeleted,
  reactions: serverReactions = {},
  
}: EpisodeProps) => {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Omit<EpisodeProps, 'id' | 'likes' | 'onEpisodeDeleted'>>({
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
  });

  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [showEmojis, setShowEmojis] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  

  const loadReactions = useCallback(() => {
    // Use apenas serverReactions para evitar duplicação
    setReactions(serverReactions || {});
  }, [serverReactions]);

  const parsePortugueseDate = (dateString: string): string => {
    if (!dateString) return '';
    
    // Mapeamento dos meses em português
    const months: Record<string, number> = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
  
    // Extrai dia, mês e ano da string
    const parts = dateString.split(' de ');
    if (parts.length !== 3) return '';
  
    const day = parseInt(parts[0]);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2]);
  
    if (isNaN(day) || isNaN(year) || !months.hasOwnProperty(monthName)) {
      return '';
    }
  
    const month = months[monthName] + 1; // JavaScript months are 0-indexed
  
    // Formata como YYYY-MM-DD
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleEditClick = () => {
    setEditedData({
      title,
      date: parsePortugueseDate(date), // Usa a nova função aqui
      tags,
      imageUrl,
      duration,
      participants,
      spotifyUrl,
      youtubeUrl,
      amazonUrl,
      deezerUrl,
      soundcloudUrl,
    });
    setIsEditing(true);
  };

  const validatePlatformLinks = (data: typeof editedData) => {
    return (
      data.spotifyUrl ||
      data.youtubeUrl ||
      data.amazonUrl ||
      data.deezerUrl ||
      data.soundcloudUrl
    );
  };

  // Função para salvar as edições
  const handleSaveEdit = async () => {
    try {
      // Valida se pelo menos um link de plataforma foi fornecido
      if (!validatePlatformLinks(editedData)) {
        alert('Por favor, insira pelo menos um link de plataforma (Spotify, YouTube, etc.)');
        return;
      }
  
      // Garante que a data seja "2025-04-18T00:00:00"
      const dateString = editedData.date
        ? `${editedData.date}T00:00:00`
        : undefined;
  
      const response = await fetch('/api/episodes/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...editedData,
          date: dateString,
        }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Falha ao atualizar episódio');
      }
  
      await response.json();
      alert('Episódio atualizado com sucesso!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao editar episódio:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Função para atualizar um campo específico
  const handleFieldChange = <K extends keyof typeof editedData>(
    field: K,
    value: typeof editedData[K]
  ) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  useEffect(() => {
  setReactions(serverReactions || {}); // Sincroniza com o servidor
  setHasMounted(true);
  }, [serverReactions]);  

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
        
        const res = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!res.ok) throw new Error('Falha na verificação')
        
        const { isAdmin } = await res.json()
        setIsAdmin(isAdmin)
      } catch (error) {
        console.error('Erro na checagem:', error)
        setIsAdmin(false)
      }
    }
    
    
  
    checkAdminStatus()
  }, [])

  useEffect(() => {
    if (showPlatforms) {
      const timer = setTimeout(() => {
        setShowPlatforms(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPlatforms]);


  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este episódio?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/episodes/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: String(id) }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao deletar episódio');
      }
  
      // 1. Primeiro mostra a mensagem de sucesso
      alert('Episódio deletado com sucesso!');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      // 2. Chama a callback se existir
      if (onEpisodeDeleted) {
        onEpisodeDeleted();
      }
      
      
    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!hasMounted) return;
  
    const reactionsKey = `episode_${id}_reactions`;
    const userReactions = localStorage.getItem(reactionsKey) || '';
  
    if (userReactions.includes(emoji)) {
      alert('Você já reagiu com este emoji!');
      return;
    }
  
    // Atualização otimista
    const newReactions = {
      ...reactions,
      [emoji]: (reactions[emoji] || 0) + 1
    };
    setReactions(newReactions);
    setShowEmojis(false);
  
    // Efeito visual
    const emojiId = `${Date.now()}-${emoji}`;
    setFloatingEmojis(prev => [...prev, emojiId]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(id => id !== emojiId));
    }, 1000);
  
    // Atualiza localStorage
    localStorage.setItem(reactionsKey, userReactions + emoji);
  
    try {
      const response = await fetch("/api/episodes/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId: id, emoji }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Atualize as reações com a resposta do servidor
        setReactions(data.reactions);
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro ao registrar reação:", error);
      setReactions(reactions); // Rollback sem duplicar
    }
  };

  if (!hasMounted) {
    return (
      <div className="bg-white border border-pink-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 animate-pulse">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gray-200"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handlePlayClick = () => setShowPlatforms(true);

  

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
      icon: <FaDeezer size={28} className="text-purple-500 hover:scale-110 transition-transform" />,
      link: deezerUrl,
    },
    soundcloudUrl && {
      icon: <FaSoundcloud size={28} className="text-orange-600" />,
      link: soundcloudUrl,
    },
  ].filter(Boolean) as PlatformIcon[];

  return (
    <div className="relative bg-white border border-pink-100 text-gray-900 rounded-3xl p-6 flex flex-col  gap-6 shadow-md hover:shadow-pink-300/50 hover:shadow-2xl transition-all duration-300 text-sm sm:text-base overflow-hidden">
      {/* Botões de admin (topo direito) */}
      {isAdmin && (
        <>
          <div className="absolute top-3 right-3 z-20">
            <AnimatePresence>
              {!isDeleting ? (
                <motion.button
                  onClick={handleDelete}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors border border-red-200"
                  aria-label="Excluir episódio"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={18} className="text-red-600" />
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ 
                    scale: [1, 1.2, 0.8, 1.5, 0],
                    opacity: [1, 0.8, 0.5, 0.2, 0],
                    rotate: [0, 5, -5, 10, -15, 0]
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="p-2 bg-white rounded-full shadow-lg border border-red-200 origin-center"
                >
                  <motion.div
                    animate={{ 
                      opacity: [1, 0],
                      scale: [1, 0.5]
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </motion.div>
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          x: Math.cos(i * 60 * Math.PI/180) * 20,
                          y: Math.sin(i * 60 * Math.PI/180) * 20
                        }}
                        transition={{ 
                          duration: 0.8,
                          delay: i * 0.05
                        }}
                        className="absolute w-1 h-1 bg-red-200 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute top-3 right-14 z-20">
            <motion.button
              onClick={handleEditClick}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors border border-blue-200"
              aria-label="Editar episódio"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </motion.button>
          </div>
        </>
      )}

      {/* Modal de edição */}
      
      <AnimatePresence>
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-pink-600">Editar Episódio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campo Título */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  value={editedData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full p-2 border border-pink-200 rounded-lg"
                  required
                />
              </div>

              {/* Campo Participantes */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Participantes *</label>
                <input
                  type="text"
                  value={editedData.participants.join(', ')}
                  onChange={(e) => handleFieldChange('participants', e.target.value.split(',').map(p => p.trim()))}
                  className="w-full p-2 border border-pink-200 rounded-lg"
                  placeholder="Ex: Monize, Rafael e Stefany"
                  required
                />
              </div>

              {/* Campo Duração */}
              <div>
                <label className="block text-sm font-medium mb-1">Duração *</label>
                <input
                  type="time"
                  value={editedData.duration}
                  onChange={(e) => handleFieldChange('duration', e.target.value)}
                  className="w-full p-2 border border-pink-200 rounded-lg"
                  step="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: HH:MM:SS</p>
              </div>

              {/* Campo Data */}
              <div>
                <label className="block text-sm font-medium mb-1">Data *</label>
                <input
                  type="date"
                  value={editedData.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className="w-full p-2 border border-pink-200 rounded-lg"
                  required
                />
              </div>

              {/* Campo Tags */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula) *</label>
                <input
                  type="text"
                  value={editedData.tags.join(', ')}
                  onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()))}
                  className="w-full p-2 border border-pink-200 rounded-lg"
                  placeholder="Ex: Amazonas, Podcast, Historia"
                  required
                />
              </div>

              {/* Campo Imagem URL */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">URL da Imagem *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedData.imageUrl}
                    onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                    className="flex-1 p-2 border border-pink-200 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                    className="bg-pink-100 text-pink-700 px-3 rounded-lg border border-pink-200 hover:bg-pink-200"
                  >
                    Upload
                  </button>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("upload_preset", "podcast_uploads");

                      try {
                        const res = await fetch(
                          `https://api.cloudinary.com/v1_1/dgrap26b6/image/upload`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        );

                        const data = await res.json();
                        handleFieldChange('imageUrl', data.secure_url);
                      } catch (error) {
                        console.error("Erro no upload da imagem:", error);
                        alert("Erro ao fazer upload da imagem");
                      }
                    }}
                  />
                </div>
                {editedData.imageUrl && (
                  <div className="mt-2 w-full h-40 relative rounded-lg border border-pink-200 overflow-hidden">
                    <Image
                      src={editedData.imageUrl}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>

              {/* Links das plataformas */}
              <div className="col-span-2 border-t pt-4 mt-2">
                <h4 className="font-medium mb-3">Links das Plataformas</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <SiSpotify className="text-green-500" /> Spotify
                    </label>
                    <input
                      type="url"
                      value={editedData.spotifyUrl || ''}
                      onChange={(e) => handleFieldChange('spotifyUrl', e.target.value)}
                      className="w-full p-2 border border-pink-200 rounded-lg"
                      placeholder="URL do Spotify"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <SiYoutube className="text-red-500" /> YouTube
                    </label>
                    <input
                      type="url"
                      value={editedData.youtubeUrl || ''}
                      onChange={(e) => handleFieldChange('youtubeUrl', e.target.value)}
                      className="w-full p-2 border border-pink-200 rounded-lg"
                      placeholder="URL do YouTube"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <SiAmazon className="text-yellow-500" /> Amazon Music
                    </label>
                    <input
                      type="url"
                      value={editedData.amazonUrl || ''}
                      onChange={(e) => handleFieldChange('amazonUrl', e.target.value)}
                      className="w-full p-2 border border-pink-200 rounded-lg"
                      placeholder="URL do Amazon Music"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <FaDeezer className="text-purple-500" /> Deezer
                    </label>
                    <input
                      type="url"
                      value={editedData.deezerUrl || ''}
                      onChange={(e) => handleFieldChange('deezerUrl', e.target.value)}
                      className="w-full p-2 border border-pink-200 rounded-lg"
                      placeholder="URL do Deezer"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <FaSoundcloud className="text-orange-500" /> SoundCloud
                    </label>
                    <input
                      type="url"
                      value={editedData.soundcloudUrl || ''}
                      onChange={(e) => handleFieldChange('soundcloudUrl', e.target.value)}
                      className="w-full p-2 border border-pink-200 rounded-lg"
                      placeholder="URL do SoundCloud"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Conteúdo principal - Linha superior (imagem + detalhes) */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Imagem */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xl bg-pink-100 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            width={128}
            height={128}
            quality={100}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Detalhes do episódio */}
        <div className="flex-1 flex flex-col">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="bg-pink-300/40 text-pink-900 text-xs font-medium px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Linha inferior - Reações e Play (MOBILE) */}
      <div className="sm:hidden flex flex-col gap-3">
        {/* Botão play mobile */}
        <div className="flex justify-start">
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

        {/* Reações mobile */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className="relative text-sm text-pink-600 hover:text-pink-800 font-bold transition-colors whitespace-nowrap"
          >
            Reagir
          </button>
          {showEmojis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-2 bg-white p-2 rounded-full shadow-lg absolute bottom-10 left-0 z-20"
            >
              {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => handleReaction(emoji)}>
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
          
          <div className="flex gap-1 overflow-x-auto max-w-full px-4">
            {Object.entries(reactions || {})
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([emoji, count]) => (
                <motion.span 
                  key={emoji}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="inline-flex items-center justify-center bg-white rounded-full px-1.5 py-0.5 shadow-sm flex-shrink-0"
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-xs ml-0.5">{count}</span>
                </motion.span>
              ))
            }
          </div>
        </div>
      </div>

      {/* Linha inferior - Reações e Play (DESKTOP) */}
      <div className="hidden sm:flex items-center mt-auto justify-between">
        {/* Reações desktop */}
        <div className="relative flex-1 min-w-0 mr-2"> {/* Adicionei flex-1 e min-w-0 */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-sm text-pink-600 hover:text-pink-800 font-bold transition-colors whitespace-nowrap" 
            >
              Reagir
            </button>
            
            {/* Emojis flutuantes */}
            <div className="absolute top-0 left-0">
              <AnimatePresence>
                {floatingEmojis.map((id) => {
                  const emoji = id.split('-')[1];
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -30, scale: 1.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute text-xl"
                    >
                      {emoji}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Lista de emojis selecionáveis */}
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-2 bg-white p-2 rounded-full shadow-lg absolute bottom-full mb-2 z-10" 
              >
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-xl hover:scale-125 transition-transform"
                    title={`Reagir com ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Contadores de reações (ajustado para mobile) */}
            <div className="flex gap-1 overflow-x-auto max-w-[120px] sm:max-w-none"> {/* Adicionei overflow e max-width */}
              {Object.entries(reactions || {})
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([emoji, count]) => (
                  <motion.span 
                    key={emoji}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="inline-flex items-center justify-center bg-white rounded-full px-1.5 py-0.5 shadow-sm flex-shrink-0" 
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-xs ml-0.5">{count}</span>
                  </motion.span>
                ))
              }
            </div>
          </div>
        </div>

        {/* Botão play desktop */}
        <div className="flex items-center gap-3">
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

      
    </div>
  );
};

export default EpisodeCard;