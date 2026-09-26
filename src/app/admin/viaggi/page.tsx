import React from 'react'
import { prisma } from '@/lib/prisma'
import { Compass, MapPin, Hotel, Plus } from 'lucide-react'

export default async function AdminViaggiPage() {
  const destinations = await prisma.destination.findMany({
    include: {
      restaurants: true,
      experiences: true,
      _count: { select: { relatedArticles: true } },
    },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Itinerari & Territorio
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Viaggi & Destinazioni
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci destinazioni d'incanto, hotel di charme, dimore storiche e percorsi sensoriali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {d.coverImage && (
                <div className="aspect-[16/9] overflow-hidden bg-stone-900">
                  <img src={d.coverImage} alt={d.name_it} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#B8922E] tracking-wider">
                  {d.region} • {d.country}
                </span>
                <h3 className="font-serif text-xl font-semibold text-stone-900">{d.name_it}</h3>
                <p className="text-xs text-stone-600 font-light line-clamp-3">
                  {d.description_it}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#FAF0DE] border-t border-[#EAE3D2] flex items-center justify-between text-xs text-stone-600">
              <span>{d.restaurants.length} ristoranti collegati</span>
              <span>{d.experiences.length} hotel/esperienze</span>
              <span className="font-semibold text-stone-800">{d._count.relatedArticles} articoli</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
