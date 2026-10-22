'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full border border-[#B8922E]/40 bg-[#FAF4E6] flex items-center justify-center text-[#B8922E]">
          <span className="font-serif font-bold text-2xl">B</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">BellaSelecta</h1>
          <p className="text-sm text-stone-600 font-light">
            La piattaforma sta aggiornando i propri contenuti. Riprova tra pochi istanti.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => reset()}
            className="bg-[#B8922E] hover:bg-[#9A7A24] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            Ricarica
          </button>
          <Link
            href="/"
            className="bg-[#1C1917] hover:bg-stone-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
