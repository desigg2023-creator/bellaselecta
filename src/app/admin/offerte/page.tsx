import React from 'react'
import { prisma } from '@/lib/prisma'
import OfferManager from '@/components/admin/OfferManager'

export default async function AdminOffertePage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { brand: true, category: true, affiliateLink: true },
  })

  const brands = await prisma.brand.findMany({ select: { id: true, name: true } })
  const categories = await prisma.category.findMany({ select: { id: true, name_it: true } })
  const affiliateLinks = await prisma.affiliateLink.findMany({ select: { id: true, label: true } })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Privilegi & Opportunità Commerciali
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Offerte Selezionate
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci promozioni, codici sconto esclusivi e condizioni di validità per i partner.
        </p>
      </div>

      <OfferManager
        initialOffers={offers}
        brands={brands}
        categories={categories}
        affiliateLinks={affiliateLinks}
      />
    </div>
  )
}
