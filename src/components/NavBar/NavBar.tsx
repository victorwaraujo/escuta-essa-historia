"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  const links = [
    { href: "/", label: "INÍCIO" },
    { href: "/episodios", label: "EPISÓDIOS" },
    { href: "/mensagens", label: "MENSAGENS" },
    { href: "/#contato", label: "CONTATO" },
  ]

  return (
    <nav className="bg-pink-500 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/images/logo21.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              unoptimized={true}
            />
          </div>
        </Link>

        <ul className="hidden sm:flex gap-6 text-sm font- font-bold text-white">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition hover:text-pink-100 ${
                  pathname === href ? "underline underline-offset-4" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="sm:hidden text-white"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white text-pink-700 font-medium border-t border-pink-100 ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 py-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className="block w-full hover:text-pink-500 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar