import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BellaSelecta | Curated Discovery & Italian Lifestyle',
  description: "L'arte della scoperta: selezione editoriale di eccellenze, luoghi, sapori e stile di vita italiano.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-[#FDFBF7] text-stone-900 antialiased selection:bg-[#B8922E]/20 selection:text-stone-900">
        {children}
      </body>
    </html>
  )
}
