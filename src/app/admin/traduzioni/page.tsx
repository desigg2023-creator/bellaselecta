import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Languages, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react'

export default async function AdminTraduzioniPage() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title_it: true,
      title_es: true,
      title_en: true,
      status: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Internazionalizzazione (i18n)
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Stato delle Traduzioni
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Verifica la disponibilità dei contenuti nelle tre lingue previste: Italiano (principale), Spagnolo e Inglese.
        </p>
      </div>

      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Articolo (Italiano)</th>
              <th className="py-3 px-4 text-center">🇮🇹 Italiano</th>
              <th className="py-3 px-4 text-center">🇪🇸 Español</th>
              <th className="py-3 px-4 text-center">🇬🇧 English</th>
              <th className="py-3 px-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {articles.map((art) => {
              const hasEs = Boolean(art.title_es && art.title_es.trim() !== '')
              const hasEn = Boolean(art.title_en && art.title_en.trim() !== '')

              return (
                <tr key={art.id} className="hover:bg-[#FAF4E6]">
                  <td className="py-3.5 px-4 font-semibold text-stone-900 max-w-md truncate">
                    {art.title_it}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completo</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {hasEs ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tradotto</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-700 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Bozza / Mancante</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {hasEn ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tradotto</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-700 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Bozza / Mancante</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/articoli/modifica/${art.id}`}
                      className="inline-flex items-center space-x-1 bg-white border border-[#E5DEC9] text-stone-700 hover:text-stone-900 px-2.5 py-1 rounded"
                    >
                      <Edit3 className="w-3 h-3 text-[#B8922E]" />
                      <span>Traduci</span>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
