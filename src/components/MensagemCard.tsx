interface MensagemCardProps {
  autor: string
  conteudo: string
  data: string
  cor: string
}

const MensagemCard = ({ autor, conteudo, data, cor }: MensagemCardProps) => {
  const avatarInicial = autor.charAt(0).toUpperCase()

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100 flex gap-4 items-start">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
        style={{ backgroundColor: cor }}
      >
        {avatarInicial}
      </div>
      <div className="flex-1">
        <p className="text-base sm:text-lg font-body text-gray-800 mb-2 break-words">
          {conteudo}
        </p>
        <div className="text-xs sm:text-sm text-gray-500 font-body flex justify-between flex-wrap gap-1 break-words">
          <span className="break-words">— {autor}</span>
          <span className="break-words">{data}</span>
        </div>
      </div>
    </div>
  )
}

export default MensagemCard