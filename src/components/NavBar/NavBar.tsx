"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-pink-400 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between bg-pink-400">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png" 
            alt="Logo"
            width={48}
            height={48}
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </div>

        {/* Menu Desktop */}
        <ul className="hidden sm:flex gap-6 text-sm font-display font-bold text-white">
          <li className="transition hover:text-pink-700">
            <Link href="#episodios">EPISÓDIOS</Link>
          </li>
          <li className="transition hover:text-pink-700">
            <Link href="#episodios">MENSAGENS</Link>
          </li>
          <li className="transition hover:text-pink-700">
            <Link href="#sobre">SOBRE</Link>
          </li>
          <li className="transition hover:text-pink-700">
            <Link href="#contato">CONTATO</Link>
          </li>
        </ul>

        {/* Botão Mobile */}
        <button
          className="sm:hidden text-purple-900"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile com animação */}
      <div
        className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 py-4 bg-white text-purple-900 font-medium border-t border-pink-100">
          <li><Link href="#episodios" onClick={toggleMenu}>EPISÓDIOS</Link></li>
          <li><Link href="#sobre" onClick={toggleMenu}>SOBRE</Link></li>
          <li><Link href="#contato" onClick={toggleMenu}>CONTATO</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar