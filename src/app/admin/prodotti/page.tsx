import React from 'react'
import { prisma } from '@/lib/prisma'
import ProductManager from '@/components/admin/ProductManager'

export default async function AdminProdottiPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { brand: true, category: true, affiliateLink: true },
  })

  const brands = await prisma.brand.findMany({ select: { id: true, name: true } })
  const categories = await prisma.category.findMany({ select: { id: true, name_it: true } })
  const affiliateLinks = await prisma.affiliateLink.findMany({ select: { id: true, label: true } })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Catalogo Discovery
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Prodotti & Creazioni
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci le selezioni di prodotto, prezzi, marchi associati e link di affiliazione.
        </p>
      </div>

      <ProductManager
        initialProducts={products}
        brands={brands}
        categories={categories}
        affiliateLinks={affiliateLinks}
      />
    </div>
  )
}
