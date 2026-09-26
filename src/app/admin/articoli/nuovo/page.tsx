import React from 'react'
import { prisma } from '@/lib/prisma'
import ArticleEditorForm from '@/components/admin/ArticleEditorForm'

export default async function NuovoArticoloPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const products = await prisma.product.findMany({
    select: { id: true, name_it: true },
  })

  const offers = await prisma.offer.findMany({
    select: { id: true, title_it: true },
  })

  const brands = await prisma.brand.findMany({
    select: { id: true, name: true },
  })

  const destinations = await prisma.destination.findMany({
    select: { id: true, name_it: true },
  })

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name_it: true },
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Nuovo Contenuto
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Crea Articolo
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Scrivi e cura la tua selezione. Salvala come bozza o pubblicala quando è pronta.
        </p>
      </div>

      <ArticleEditorForm
        categories={categories}
        products={products}
        offers={offers}
        brands={brands}
        destinations={destinations}
        restaurants={restaurants}
      />
    </div>
  )
}
