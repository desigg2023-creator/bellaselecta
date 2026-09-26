import React from 'react'
import { prisma } from '@/lib/prisma'
import { Briefcase, Globe, ExternalLink } from 'lucide-react'

export default async function AdminMarchiPage() {
  const brands = await prisma.brand.findMany({
    include: {
      category: true,
      _count: { select: { products: true, offers: true, relatedArticles: true } },
    },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Partnership Commerciali
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Marchi & Aziende
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci collaborazioni commerciali, sponsorizzazioni, profili brand e collegamenti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {b.logo && (
                <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-lg object-cover border" />
              )}
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">{b.name}</h3>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                  {b.location || 'Italia'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-light line-clamp-2">
              {b.description_it}
            </p>

            <div className="pt-3 border-t border-[#EAE3D2] flex items-center justify-between text-xs text-stone-500">
              <span>{b._count.products} prodotti</span>
              <span>{b._count.offers} offerte</span>
              {b.website && (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8922E] hover:underline flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Sito web</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
