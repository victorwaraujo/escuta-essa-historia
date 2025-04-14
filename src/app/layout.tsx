import type { Metadata } from "next"
import { Yeseva_One, Poppins } from "next/font/google"
import "./globals.css"

const yeseva = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Escuta Essa História",
  description: "Podcast de história",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${yeseva.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}