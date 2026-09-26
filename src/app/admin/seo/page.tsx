import React from 'react'
import { prisma } from '@/lib/prisma'
import { Search, Globe, CheckCircle2, ExternalLink } from 'lucide-react'

export default async function AdminSEOPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Visibilità Motori di Ricerca
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Gestione SEO & Metadati
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configura i titoli, le descrizioni sociali Open Graph e la mappa del sito senza toccare codice.
        </p>
      </div>

      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-[#EAE3D2] pb-2">
          Metadati Predefiniti (Homepage & Piattaforma)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Meta Title (Italiano)
            </label>
            <input
              type="text"
              defaultValue={settings?.defaultMetaTitle_it || ''}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Meta Description (Italiano)
            </label>
            <textarea
              rows={3}
              defaultValue={settings?.defaultMetaDescription_it || ''}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Meta Title (Español)
              </label>
              <input
                type="text"
                defaultValue={settings?.defaultMetaTitle_es || ''}
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Meta Title (English)
              </label>
              <input
                type="text"
                defaultValue={settings?.defaultMetaTitle_en || ''}
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Technical SEO Status checklist */}
        <div className="pt-4 border-t border-[#EAE3D2] space-y-3">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-[#B8922E]">
            Stato Architettura SEO
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 bg-white p-3 rounded-lg border border-[#EAE3D2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Etichette <strong>hreflang</strong> attive (it, es, en)</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 bg-white p-3 rounded-lg border border-[#EAE3D2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>URL <strong>canonical</strong> automatici</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 bg-white p-3 rounded-lg border border-[#EAE3D2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Metatag <strong>Open Graph</strong> dinamici</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 bg-white p-3 rounded-lg border border-[#EAE3D2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dati strutturati <strong>JSON-LD Schema.org</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
