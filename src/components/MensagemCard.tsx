import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MensagemCardProps {
  id: number // Adicione esta linha
  autor: string
  conteudo: string
  data: string
  cor: string
  isAdmin?: boolean // Nova prop
  onDelete?: (id: number) => void // Nova prop
}

const MensagemCard = ({ 
  id, 
  autor, 
  conteudo, 
  data, 
  cor, 
  isAdmin = false,
  onDelete 
}: MensagemCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const avatarInicial = autor.charAt(0).toUpperCase();

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(id);
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100 flex gap-4 items-start relative">
      {/* Botão de deletar (apenas para admin) - Ajustado o posicionamento */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors border border-red-200"
          aria-label="Excluir mensagem"
        >
          {isDeleting ? (
            <span className="loading loading-spinner loading-xs text-red-500"></span>
          ) : (
            <Trash2 size={18} className="text-red-600" />
          )}
        </button>
      )}
      
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
        style={{ backgroundColor: cor }}
      >
        {avatarInicial}
      </div>
      
      {/* Container do conteúdo com padding à direita */}
      <div className="flex-1 pr-8"> {/* Adicionado pr-8 para evitar sobreposição */}
        <p className="text-base sm:text-lg font-body text-gray-800 mb-2 break-words">
          {conteudo}
        </p>
        <div className="text-xs sm:text-sm text-gray-500 font-body flex justify-between flex-wrap gap-1 break-words">
          <span className="break-words">— {autor}</span>
          <span className="break-words">{data}</span>
        </div>
      </div>
    </div>
  );
};

export default MensagemCard