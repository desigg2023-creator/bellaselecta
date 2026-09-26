import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleEditorForm from '@/components/admin/ArticleEditorForm'

interface ModificaArticoloPageProps {
  params: { id: string }
}

export default async function ModificaArticoloPage({ params }: ModificaArticoloPageProps) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  })

  if (!article) notFound()

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const products = await prisma.product.findMany({ select: { id: true, name_it: true } })
  const offers = await prisma.offer.findMany({ select: { id: true, title_it: true } })
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } })
  const destinations = await prisma.destination.findMany({ select: { id: true, name_it: true } })
  const restaurants = await prisma.restaurant.findMany({ select: { id: true, name_it: true } })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Modifica Contenuto
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          {article.title_it || 'Modifica Articolo'}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Puoi salvare le modifiche come bozza o aggiornare direttamente l'articolo pubblicato.
        </p>
      </div>

      <ArticleEditorForm
        initialData={article}
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
