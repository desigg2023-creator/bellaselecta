import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full border border-[#B8922E]/40 bg-[#FAF4E6] flex items-center justify-center text-[#B8922E]">
          <span className="font-serif font-bold text-2xl">B</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">404 - Pagina non trovata</h1>
          <p className="text-sm text-stone-600 font-light">
            La pagina richiesta non è disponibile o è stata spostata.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-[#1C1917] hover:bg-[#B8922E] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  )
}
