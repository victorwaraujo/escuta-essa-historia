import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MensagemCardProps {
  id: number;
  autor: string;
  conteudo: string;
  data: string;
  cor: string;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100 flex flex-col sm:flex-row gap-4 items-start relative">
      {/* Avatar - Mostrar apenas em telas maiores */}
      <div className="hidden sm:flex w-12 h-12 rounded-full items-center justify-center text-white font-bold text-xl flex-shrink-0"
        style={{ backgroundColor: cor }}>
        {avatarInicial}
      </div>
      
      {/* Conteúdo principal com layout diferente para mobile */}
      <div className="flex-1 w-full min-w-0"> {/* Garante que o conteúdo use toda a largura no mobile */}
        {/* Linha do autor/data no mobile */}
        <div className="flex items-center gap-3 mb-3 sm:hidden">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: cor }}>
            {avatarInicial}
          </div>
          <div>
            <span className="font-medium text-gray-700"> {autor}</span>
            
          </div>
        </div>
        
        {/* Texto da mensagem */}
        <p className="text-base text-justify sm:text-lg font-body text-gray-800 mb-2 break-words w-full">
          {conteudo}
        </p>
        <span className="text-xs text-gray-500 ml-2">{data}</span>
        
        {/* Rodapé (apenas em desktop) */}
        <div className="hidden sm:flex text-xs sm:text-sm text-gray-500 font-body justify-between flex-wrap gap-1 break-words">
          <span>— {autor}</span>
          <span>{data}</span>
        </div>
      </div>
      
      {/* Botão de deletar (posicionamento responsivo) */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors border border-red-200"
          aria-label="Excluir mensagem"
        >
          {isDeleting ? (
            <span className="loading loading-spinner loading-xs text-red-500"></span>
          ) : (
            <Trash2 size={18} className="text-red-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default MensagemCard;