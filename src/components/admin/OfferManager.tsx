'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Tag, X } from 'lucide-react'

export default function OfferManager({
  initialOffers,
  brands,
  categories,
  affiliateLinks,
}: {
  initialOffers: any[]
  brands: any[]
  categories: any[]
  affiliateLinks: any[]
}) {
  const [offers, setOffers] = useState(initialOffers)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title_it: '',
    title_es: '',
    title_en: '',
    description_it: '',
    previousPrice: '',
    offerPrice: '',
    discountPercentage: '',
    promoCode: '',
    image: '',
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    affiliateLinkId: affiliateLinks[0]?.id || '',
    conditions_it: '',
    isFeatured: true,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOffers([data.offer, ...offers])
      setIsCreating(false)
    } catch (err: any) {
      alert(err.message || 'Errore')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa offerta?')) return
    await fetch(`/api/admin/offerte?id=${id}`, { method: 'DELETE' })
    setOffers(offers.filter((o) => o.id !== id))
  }

  return (
    <div className="space-y-6">
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Offerta</span>
        </button>
      )}

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-[#FAF6EE] border border-[#B8922E]/40 rounded-xl p-6 space-y-4 shadow-md animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
            <h3 className="font-serif text-lg font-semibold text-stone-900">Nuova Offerta</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-stone-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Titolo Offerta (Italiano) *
              </label>
              <input
                type="text"
                required
                value={formData.title_it}
                onChange={(e) => setFormData({ ...formData, title_it: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Título (Español)
              </label>
              <input
                type="text"
                value={formData.title_es}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Title (English)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Prezzo Precedente (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.previousPrice}
                onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Prezzo Offerta (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                % Sconto
              </label>
              <input
                type="number"
                placeholder="es. 20"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Codice Promozionale
              </label>
              <input
                type="text"
                placeholder="es. BELLA20"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Marchio / Partner
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              >
                <option value="">Nessuno</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_it}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Programma Affiliazione
              </label>
              <select
                value={formData.affiliateLinkId}
                onChange={(e) => setFormData({ ...formData, affiliateLinkId: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              >
                <option value="">Nessuno</option>
                {affiliateLinks.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
              URL Immagine
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-[#EAE3D2]">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-[#E5DEC9] text-xs font-semibold uppercase rounded text-stone-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#B8922E] hover:bg-[#A38025] text-stone-950 text-xs font-semibold uppercase rounded transition-colors shadow-sm"
            >
              Salva Offerta
            </button>
          </div>
        </form>
      )}

      {/* Offers Table */}
      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Offerta</th>
              <th className="py-3 px-4">Partner</th>
              <th className="py-3 px-4">Sconto / Prezzo</th>
              <th className="py-3 px-4">Codice Promo</th>
              <th className="py-3 px-4">Stato</th>
              <th className="py-3 px-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {offers.map((o) => (
              <tr key={o.id} className="hover:bg-[#FAF4E6]">
                <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center space-x-3">
                  {o.image && (
                    <img src={o.image} alt={o.title_it} className="w-8 h-8 rounded object-cover" />
                  )}
                  <span>{o.title_it}</span>
                </td>
                <td className="py-3.5 px-4 text-stone-600">{o.brand?.name || '—'}</td>
                <td className="py-3.5 px-4 font-mono font-medium">
                  {o.discountPercentage && (
                    <span className="text-rose-700 font-bold mr-1">-{o.discountPercentage}%</span>
                  )}
                  {o.offerPrice && <span>{o.offerPrice.toFixed(2)} €</span>}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                  {o.promoCode || '—'}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      o.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {o.status === 'ACTIVE' ? 'Attiva' : 'Scaduta'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="p-1.5 hover:bg-rose-50 rounded border border-rose-200 text-rose-700"
                    title="Elimina"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
