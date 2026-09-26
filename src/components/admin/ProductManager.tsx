'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ExternalLink, ShoppingBag, X } from 'lucide-react'

export default function ProductManager({
  initialProducts,
  brands,
  categories,
  affiliateLinks,
}: {
  initialProducts: any[]
  brands: any[]
  categories: any[]
  affiliateLinks: any[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_it: '',
    name_es: '',
    name_en: '',
    description_it: '',
    price: '',
    previousPrice: '',
    image: '',
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    affiliateLinkId: affiliateLinks[0]?.id || '',
    externalUrl: '',
    isFeatured: true,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProducts([data.product, ...products])
      setIsCreating(false)
    } catch (err: any) {
      alert(err.message || 'Errore')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo prodotto?')) return
    await fetch(`/api/admin/prodotti?id=${id}`, { method: 'DELETE' })
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nuovo Prodotto</span>
        </button>
      )}

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-[#FAF6EE] border border-[#B8922E]/40 rounded-xl p-6 space-y-4 shadow-md animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
            <h3 className="font-serif text-lg font-semibold text-stone-900">Nuovo Prodotto</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-stone-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Nome (Italiano) *
              </label>
              <input
                type="text"
                required
                value={formData.name_it}
                onChange={(e) => setFormData({ ...formData, name_it: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Nombre (Español)
              </label>
              <input
                type="text"
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Name (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                Prezzo (€) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
            </div>
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
                Marchio
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                URL Immagine
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs"
              />
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
                <option value="">Nessuno (Usa Link Esterno)</option>
                {affiliateLinks.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
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
              Salva Prodotto
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Prodotto</th>
              <th className="py-3 px-4">Marchio</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Prezzo</th>
              <th className="py-3 px-4">Affiliazione</th>
              <th className="py-3 px-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAF4E6]">
                <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center space-x-3">
                  {p.image && (
                    <img src={p.image} alt={p.name_it} className="w-8 h-8 rounded object-cover" />
                  )}
                  <span>{p.name_it}</span>
                </td>
                <td className="py-3.5 px-4 text-stone-600">{p.brand?.name || '—'}</td>
                <td className="py-3.5 px-4 text-stone-600">{p.category?.name_it || '—'}</td>
                <td className="py-3.5 px-4 font-mono font-medium">
                  {p.price?.toFixed(2)} €
                  {p.previousPrice && (
                    <span className="text-stone-400 line-through ml-1">
                      {p.previousPrice?.toFixed(2)} €
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.affiliateLink ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {p.affiliateLink ? p.affiliateLink.provider : 'Diretto'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
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
