import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FileText, PlusCircle, Sparkles, Eye, Edit3, Trash2, CheckCircle, Clock } from 'lucide-react'

export default async function AdminArticoliListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
            Gestione Editoriale
          </span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
            Articoli
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Crea, modifica, visualizza in anteprima e gestisci lo stato di pubblicazione.
          </p>
        </div>

        <Link
          href="/admin/articoli/nuovo"
          className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nuovo Articolo</span>
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Articolo</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Stato</th>
                <th className="py-3.5 px-4">In Evidenza</th>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D2]">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-[#FAF4E6] transition-colors">
                  <td className="py-4 px-4 font-medium text-stone-900 max-w-xs">
                    <div className="font-serif text-sm font-semibold truncate">
                      {art.title_it}
                    </div>
                    {art.subtitle_it && (
                      <div className="text-[11px] text-stone-500 font-light truncate mt-0.5">
                        {art.subtitle_it}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-[#F2EBDC] text-stone-700 px-2.5 py-1 rounded text-[11px] font-medium">
                      {art.category.name_it}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        art.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {art.status === 'PUBLISHED' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Pubblicato</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Bozza</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {art.isFeatured ? (
                      <span className="text-[#B8922E] flex items-center space-x-1 font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sì</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">No</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-stone-500 text-[11px]">
                    {art.publishedAt
                      ? new Date(art.publishedAt).toLocaleDateString('it-IT')
                      : 'Non pubbl.'}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/articoli/anteprima/${art.id}`}
                      className="inline-flex items-center space-x-1 bg-white border border-[#E5DEC9] text-stone-700 hover:text-stone-900 px-2.5 py-1 rounded text-xs transition-colors shadow-2xs"
                      title="Anteprima"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Anteprima</span>
                    </Link>
                    <Link
                      href={`/admin/articoli/modifica/${art.id}`}
                      className="inline-flex items-center space-x-1 bg-[#1C1917] hover:bg-[#B8922E] text-white px-2.5 py-1 rounded text-xs transition-colors"
                      title="Modifica"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifica</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
