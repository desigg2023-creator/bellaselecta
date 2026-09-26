'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Check, X, Layers, AlertCircle } from 'lucide-react'

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name_it: '',
    name_es: '',
    name_en: '',
    description_it: '',
    slug: '',
    showOnHomepage: true,
    showInMenu: true,
    sortOrder: 1,
  })

  const handleEdit = (cat: any) => {
    setEditingCategory(cat)
    setFormData({
      name_it: cat.name_it,
      name_es: cat.name_es || '',
      name_en: cat.name_en || '',
      description_it: cat.description_it || '',
      slug: cat.slug,
      showOnHomepage: cat.showOnHomepage,
      showInMenu: cat.showInMenu,
      sortOrder: cat.sortOrder,
    })
    setIsCreating(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/categorie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setCategories([...categories, { ...data.category, _count: { articles: 0, products: 0, offers: 0 } }])
        setIsCreating(false)
      } else if (editingCategory) {
        const res = await fetch('/api/admin/categorie', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCategory.id, ...formData }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setCategories(
          categories.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c))
        )
        setEditingCategory(null)
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicura di voler eliminare questa categoria?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categorie?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Errore eliminazione')
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Button to open creation modal/form */}
      {!isCreating && !editingCategory && (
        <button
          onClick={() => {
            setIsCreating(true)
            setFormData({
              name_it: '',
              name_es: '',
              name_en: '',
              description_it: '',
              slug: '',
              showOnHomepage: true,
              showInMenu: true,
              sortOrder: categories.length + 1,
            })
          }}
          className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Aggiungi Nuova Categoria</span>
        </button>
      )}

      {/* Inline Create / Edit Box */}
      {(isCreating || editingCategory) && (
        <form
          onSubmit={handleSave}
          className="bg-[#FAF6EE] border border-[#B8922E]/40 rounded-xl p-6 space-y-4 shadow-md animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              {isCreating ? 'Nuova Categoria' : `Modifica: ${editingCategory.name_it}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false)
                setEditingCategory(null)
              }}
              className="text-stone-400 hover:text-stone-600"
            >
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
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs text-stone-900"
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
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs text-stone-900"
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
                className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
              Descrizione Editoriale (Italiano)
            </label>
            <textarea
              rows={2}
              value={formData.description_it}
              onChange={(e) => setFormData({ ...formData, description_it: e.target.value })}
              className="w-full bg-white border border-[#E5DEC9] rounded p-2 text-xs text-stone-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center space-x-2 text-xs text-stone-800">
              <input
                type="checkbox"
                checked={formData.showOnHomepage}
                onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                className="rounded text-[#B8922E]"
              />
              <span>Mostra blocco in Homepage</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-stone-800">
              <input
                type="checkbox"
                checked={formData.showInMenu}
                onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                className="rounded text-[#B8922E]"
              />
              <span>Mostra nel Menù di Navigazione</span>
            </label>

            <div className="flex items-center space-x-2 text-xs text-stone-800">
              <span>Ordine:</span>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-16 bg-white border border-[#E5DEC9] rounded p-1 text-xs text-center"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-[#EAE3D2]">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false)
                setEditingCategory(null)
              }}
              className="px-4 py-2 border border-[#E5DEC9] text-xs font-semibold uppercase rounded hover:bg-white text-stone-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#B8922E] hover:bg-[#A38025] text-stone-950 text-xs font-semibold uppercase rounded transition-colors shadow-sm"
            >
              {loading ? 'Salvataggio...' : 'Salva Categoria'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Nome Categoria</th>
              <th className="py-3 px-4">Traduzioni</th>
              <th className="py-3 px-4">Contenuti Collegati</th>
              <th className="py-3 px-4">Homepage</th>
              <th className="py-3 px-4">Ordine</th>
              <th className="py-3 px-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#FAF4E6]">
                <td className="py-3.5 px-4 font-semibold text-stone-900 text-sm">
                  {cat.name_it}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <span title={cat.name_es ? `ES: ${cat.name_es}` : 'Spagnolo mancante'}>
                      {cat.name_es ? '🇪🇸' : '⚪'}
                    </span>
                    <span title={cat.name_en ? `EN: ${cat.name_en}` : 'Inglese mancante'}>
                      {cat.name_en ? '🇬🇧' : '⚪'}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-stone-600">
                  {cat._count?.articles || 0} articoli • {cat._count?.products || 0} prodotti •{' '}
                  {cat._count?.offers || 0} offerte
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cat.showOnHomepage ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {cat.showOnHomepage ? 'Sì' : 'No'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-stone-500">{cat.sortOrder}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 hover:bg-white rounded border border-[#E5DEC9] text-stone-700"
                    title="Modifica"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
