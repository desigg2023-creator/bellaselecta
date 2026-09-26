'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Smartphone,
  Monitor,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react'

export default function ArticlePreviewPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [locale, setLocale] = useState<'it' | 'es' | 'en'>('it')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/articoli/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.article) setArticle(data.article)
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const handlePublish = async () => {
    if (!article) return
    setPublishing(true)
    try {
      const res = await fetch('/api/admin/articoli', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, status: 'PUBLISHED' }),
      })
      const data = await res.json()
      if (data.success) {
        setArticle((prev: any) => ({ ...prev, status: 'PUBLISHED' }))
      }
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE] text-stone-500 text-sm">
        Caricamento anteprima...
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE] text-stone-500 text-sm">
        Articolo non trovato.
      </div>
    )
  }

  const title = article[`title_${locale}`] || article.title_it
  const subtitle = article[`subtitle_${locale}`] || article.subtitle_it
  const content = article[`content_${locale}`] || article.content_it
  const categoryName = article.category ? article.category[`name_${locale}`] || article.category.name_it : ''

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Top Preview Control Bar */}
      <header className="bg-stone-950 border-b border-stone-800 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/articoli/modifica/${article.id}`}
            className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Torna all'Editor</span>
          </Link>

          <span className="text-stone-700">|</span>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded tracking-wider ${
                article.status === 'PUBLISHED'
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
              }`}
            >
              {article.status === 'PUBLISHED' ? 'Pubblicato' : 'Bozza'}
            </span>
            <span className="text-xs text-stone-400 font-serif font-medium truncate max-w-xs">
              {title}
            </span>
          </div>
        </div>

        {/* Device Switcher & Language */}
        <div className="flex items-center space-x-3">
          {/* Device toggle */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded flex items-center space-x-1 text-xs transition-colors ${
                device === 'desktop'
                  ? 'bg-[#B8922E] text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Vista Desktop"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded flex items-center space-x-1 text-xs transition-colors ${
                device === 'mobile'
                  ? 'bg-[#B8922E] text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Vista Mobile"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile (390px)</span>
            </button>
          </div>

          {/* Language preview toggle */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-1 flex space-x-1 text-xs">
            {(['it', 'es', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2 py-1 rounded uppercase font-semibold transition-colors ${
                  locale === l ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Quick Publish button if still draft */}
          {article.status !== 'PUBLISHED' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-[#B8922E] hover:bg-[#A38025] text-stone-950 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{publishing ? 'Pubblicazione...' : 'Approva & Pubblica'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className={`bg-[#FDFBF7] shadow-2xl transition-all duration-300 overflow-hidden ${
            device === 'mobile'
              ? 'w-[390px] min-h-[844px] rounded-[44px] border-[10px] border-stone-800 shadow-2xl my-4'
              : 'w-full max-w-5xl rounded-xl border border-stone-800'
          }`}
        >
          {/* Simulated site Header banner inside preview */}
          <div className="bg-[#1C1917] text-[#D6CEBE] text-[10px] py-1 px-4 text-center tracking-widest uppercase">
            Anteprima BellaSelecta • Lingua: {locale.toUpperCase()}
          </div>

          <div className="border-b border-[#EAE3D2] px-6 py-4 flex justify-between items-center bg-[#FAF6EE]">
            <span className="font-serif text-xl tracking-widest font-medium text-stone-900 uppercase">
              Bella<span className="font-bold text-[#B8922E]">Selecta</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#B8922E] font-semibold">
              {categoryName}
            </span>
          </div>

          {/* Render Article Exactly as live */}
          <div className="p-6 sm:p-12 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B8922E]">
                {categoryName}
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="editorial-lead text-sm sm:text-lg text-stone-600 font-light">
                  {subtitle}
                </p>
              )}
            </div>

            {article.coverImage && (
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-md border border-[#DFD6C2]">
                <img
                  src={article.coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className="article-content text-stone-800 leading-relaxed text-sm sm:text-base pt-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
