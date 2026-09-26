import React from 'react'
import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { articles: true, products: true, offers: true },
      },
    },
  })

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Architettura Contenuti
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Gestione Categorie
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Modifica, crea o riorganizza le categorie di BellaSelecta senza toccare il codice sorgente.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  )
}
