'use client'

import React, { useState } from 'react'
import { Upload, Copy, Check, Trash2, Image as ImageIcon } from 'lucide-react'

export default function MediaGallery({ initialMedia }: { initialMedia: any[] }) {
  const [mediaList, setMediaList] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)

    const file = e.target.files[0]
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })
      const result = await res.json()
      if (result.success && result.media) {
        setMediaList([result.media, ...mediaList])
      }
    } catch (err) {
      alert('Errore caricamento')
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="bg-[#FAF6EE] border-2 border-dashed border-[#DFD6C2] rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF0DE] mx-auto flex items-center justify-center text-[#B8922E]">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-stone-900">
            Carica Nuova Fotografia
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Trascina qui l'immagine o selezionala dal tuo computer (JPG, PNG, WebP)
          </p>
        </div>

        <label className="inline-block bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm">
          <span>{uploading ? 'Caricamento...' : 'Sfoglia File'}</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Grid of uploaded media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.map((m) => (
          <div
            key={m.id}
            className="group bg-[#FAF6EE] border border-[#EAE3D2] rounded-lg overflow-hidden flex flex-col shadow-sm"
          >
            <div className="aspect-square bg-stone-100 overflow-hidden relative">
              <img src={m.url} alt={m.altText_it || m.filename} className="w-full h-full object-cover" />
            </div>

            <div className="p-2.5 flex items-center justify-between text-xs border-t border-[#EAE3D2] bg-white">
              <span className="truncate text-stone-600 text-[11px] max-w-[80px]" title={m.originalName}>
                {m.originalName}
              </span>

              <button
                onClick={() => copyUrl(m.url, m.id)}
                className="p-1 hover:bg-[#FAF4E6] rounded text-[#B8922E]"
                title="Copia URL"
              >
                {copiedId === m.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
