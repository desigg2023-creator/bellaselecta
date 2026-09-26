import React from 'react'
import { prisma } from '@/lib/prisma'
import { Settings, Image, Sparkles, CheckCircle } from 'lucide-react'

export default async function AdminImpostazioniPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  })

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title_it: true },
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Configurazione Piattaforma
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Impostazioni Generali
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Identità del brand, spazio dedicato al logo definitivo e canali di contatto.
        </p>
      </div>

      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
        {/* LOGO AREA - Explicitly reserved for custom logo upload */}
        <div className="space-y-4 border-b border-[#EAE3D2] pb-6">
          <div className="flex items-center space-x-2">
            <Image className="w-5 h-5 text-[#B8922E]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Logo Ufficiale BellaSelecta (Spazio Riservato)
            </h3>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Come richiesto, questo spazio è appositamente predisposto. Quando il tuo logo sarà pronto (file SVG o PNG trasparente), potrai caricarlo o inserire l'URL qui sotto per sostituire istantaneamente l'emblema tipografico attuale su tutto il sito.
          </p>

          <div className="p-4 bg-white border border-[#DFD6C2] rounded-lg flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded border-2 border-dashed border-[#B8922E] bg-[#FAF6EE] flex items-center justify-center text-[#B8922E] font-serif font-bold text-2xl">
              B
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-stone-800">
                Spazio Logo Pronto
              </span>
              <p className="text-[11px] text-stone-400">
                Al momento è attiva la raffinata combinazione tipografica editoriale in Playfair Display.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Name & Taglines */}
        <div className="space-y-4 border-b border-[#EAE3D2] pb-6">
          <h3 className="font-serif text-lg font-semibold text-stone-900">
            Identità & Tagline Multilingua
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Nome Piattaforma
            </label>
            <input
              type="text"
              defaultValue={settings?.siteName || 'BellaSelecta'}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Tagline (Italiano)
            </label>
            <input
              type="text"
              defaultValue={settings?.siteTagline_it || ''}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Tagline (Español)
              </label>
              <input
                type="text"
                defaultValue={settings?.siteTagline_es || ''}
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Tagline (English)
              </label>
              <input
                type="text"
                defaultValue={settings?.siteTagline_en || ''}
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Homepage Hero Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#B8922E]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Controllo Articolo in Primo Piano (Hero Portada)
            </h3>
          </div>
          <p className="text-xs text-stone-600 font-light">
            Scegli manualmente quale articolo mostrare come protagonista in grande formato in cima alla Homepage.
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Articolo Protagonista Selezionato
            </label>
            <select
              defaultValue={settings?.featuredArticleId || ''}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
            >
              <option value="">Automatico (Ultimo articolo in evidenza)</option>
              {articles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.title_it}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
