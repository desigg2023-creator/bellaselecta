'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  CheckCircle,
  Eye,
  Upload,
  Globe,
  Tag,
  Sparkles,
  Link2,
  Search,
  AlertCircle,
} from 'lucide-react'

interface ArticleEditorFormProps {
  initialData?: any
  categories: any[]
  products: any[]
  offers: any[]
  brands: any[]
  destinations: any[]
  restaurants: any[]
}

export default function ArticleEditorForm({
  initialData,
  categories,
  products,
  offers,
  brands,
  destinations,
  restaurants,
}: ArticleEditorFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData?.id)

  const [activeTab, setActiveTab] = useState<'it' | 'es' | 'en'>('it')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    categoryId: initialData?.categoryId || categories[0]?.id || '',
    coverImage: initialData?.coverImage || '',
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || 'DRAFT',
    tags: initialData?.tags || '',

    // IT
    title_it: initialData?.title_it || '',
    subtitle_it: initialData?.subtitle_it || '',
    content_it: initialData?.content_it || '',
    seoTitle_it: initialData?.seoTitle_it || '',
    seoDescription_it: initialData?.seoDescription_it || '',

    // ES
    title_es: initialData?.title_es || '',
    subtitle_es: initialData?.subtitle_es || '',
    content_es: initialData?.content_es || '',
    seoTitle_es: initialData?.seoTitle_es || '',
    seoDescription_es: initialData?.seoDescription_es || '',

    // EN
    title_en: initialData?.title_en || '',
    subtitle_en: initialData?.subtitle_en || '',
    content_en: initialData?.content_en || '',
    seoTitle_en: initialData?.seoTitle_en || '',
    seoDescription_en: initialData?.seoDescription_en || '',
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      })
      const result = await res.json()
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, coverImage: result.url }))
        setMessage({ text: 'Immagine caricata con successo!', type: 'success' })
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Errore nel caricamento', type: 'error' })
    }
  }

  const saveArticle = async (newStatus?: string) => {
    setLoading(true)
    setMessage(null)

    const payload = {
      ...formData,
      status: newStatus || formData.status,
    }

    try {
      const endpoint = '/api/admin/articoli'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore durante il salvataggio')

      setMessage({
        text: `Articolo salvato con successo come ${payload.status === 'PUBLISHED' ? 'PUBBLICATO' : 'BOZZA'}!`,
        type: 'success',
      })

      if (!isEditing && data.article?.id) {
        router.push(`/admin/articoli/modifica/${data.article.id}`)
      } else {
        setFormData((prev) => ({ ...prev, status: payload.status }))
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Errore durante il salvataggio', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Action Bar (Top) */}
      <div className="bg-[#FAF4E6] border border-[#E8DFC8] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-30 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase font-bold tracking-wider text-stone-600">
            Stato attuale:
          </span>
          <span
            className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded tracking-wider ${
              formData.status === 'PUBLISHED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {formData.status === 'PUBLISHED' ? 'Pubblicato' : 'Bozza'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing && (
            <a
              href={`/admin/articoli/anteprima/${formData.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-stone-50 border border-[#E5DEC9] text-stone-800 text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#B8922E]" />
              <span>Anteprima Web & Mobile</span>
            </a>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => saveArticle('DRAFT')}
            className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salva come Bozza</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => saveArticle('PUBLISHED')}
            className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#DFBD69]" />
            <span>{formData.status === 'PUBLISHED' ? 'Aggiorna Pubblicazione' : 'Pubblica Articolo'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multilingual Content Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Language Tabs */}
          <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-2 flex space-x-2">
            {[
              { id: 'it', label: 'Italiano (Principale)', flag: '🇮🇹' },
              { id: 'es', label: 'Español', flag: '🇪🇸' },
              { id: 'en', label: 'English', flag: '🇬🇧' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-[#F2EBDC]'
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Localized Inputs */}
          <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Titolo ({activeTab.toUpperCase()}) *
              </label>
              <input
                type="text"
                required={activeTab === 'it'}
                value={(formData as any)[`title_${activeTab}`]}
                onChange={(e) =>
                  setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })
                }
                placeholder="es. Cascate delle Marmore: cosa vedere e come organizzare la visita"
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-3 text-base text-stone-900 focus:outline-none focus:border-[#B8922E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Sottotitolo / Estratto ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={2}
                value={(formData as any)[`subtitle_${activeTab}`]}
                onChange={(e) =>
                  setFormData({ ...formData, [`subtitle_${activeTab}`]: e.target.value })
                }
                placeholder="Breve introduzione editoriale visibile in homepage e nei risultati..."
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B8922E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Contenuto Articolo ({activeTab.toUpperCase()}) (Supporta HTML & Stile)
              </label>
              <textarea
                rows={14}
                value={(formData as any)[`content_${activeTab}`]}
                onChange={(e) =>
                  setFormData({ ...formData, [`content_${activeTab}`]: e.target.value })
                }
                placeholder="Scrivi qui il racconto editoriale..."
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-3 font-mono text-xs text-stone-900 focus:outline-none focus:border-[#B8922E]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Puoi utilizzare tag standard come &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, ecc.
              </p>
            </div>

            {/* SEO section */}
            <div className="pt-4 border-t border-[#EAE3D2] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B8922E] block">
                Ottimizzazione SEO ({activeTab.toUpperCase()})
              </span>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={(formData as any)[`seoTitle_${activeTab}`]}
                  onChange={(e) =>
                    setFormData({ ...formData, [`seoTitle_${activeTab}`]: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={(formData as any)[`seoDescription_${activeTab}`]}
                  onChange={(e) =>
                    setFormData({ ...formData, [`seoDescription_${activeTab}`]: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Category & Media */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Status */}
          <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-stone-900 border-b border-[#EAE3D2] pb-2">
              Organizzazione
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Categoria Principale *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_it}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Tag / Etichette (separate da virgola)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="es. toscana, vino, charme, hotel"
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#B8922E] focus:ring-[#B8922E]"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Metti in Evidenza sulla Portada
                </span>
              </label>
              <p className="text-[10px] text-stone-400 pl-5 mt-0.5">
                L'articolo apparirà nella sezione di rilievo anche se non è l'ultimo pubblicato.
              </p>
            </div>
          </div>

          {/* Media / Cover Image */}
          <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-stone-900 border-b border-[#EAE3D2] pb-2">
              Immagine di Copertina
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                URL Immagine (Unsplash o caricamento)
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2 text-xs text-stone-900 mb-2"
              />

              <label className="bg-white hover:bg-stone-50 border border-[#E5DEC9] text-stone-800 text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-[#B8922E]" />
                <span>Carica dal Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {formData.coverImage && (
              <div className="aspect-[16/10] rounded-lg overflow-hidden border border-[#E5DEC9] bg-stone-900">
                <img
                  src={formData.coverImage}
                  alt="Anteprima"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
