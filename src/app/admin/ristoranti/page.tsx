import React from 'react'
import { prisma } from '@/lib/prisma'
import { Utensils, MapPin, ExternalLink } from 'lucide-react'

export default async function AdminRistorantiPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: { destination: true, affiliateLink: true },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Guida Gastronomica
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Ristoranti & Gastronomia
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Tavole d'eccellenza, osterie autentiche, cantine storiche ed esperienze del gusto.
        </p>
      </div>

      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Locale / Ristorante</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Località</th>
              <th className="py-3 px-4">Fascia Prezzo</th>
              <th className="py-3 px-4">Destinazione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {restaurants.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF4E6]">
                <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center space-x-3">
                  {r.coverImage && (
                    <img src={r.coverImage} alt={r.name_it} className="w-8 h-8 rounded object-cover" />
                  )}
                  <span>{r.name_it}</span>
                </td>
                <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-stone-600">
                  {r.type}
                </td>
                <td className="py-3.5 px-4 text-stone-600">
                  {r.city} ({r.region})
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                  {r.priceRange}
                </td>
                <td className="py-3.5 px-4 text-stone-500">
                  {r.destination ? r.destination.name_it : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
