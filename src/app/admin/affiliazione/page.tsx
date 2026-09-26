import React from 'react'
import { prisma } from '@/lib/prisma'
import { Link2, ExternalLink, BarChart2 } from 'lucide-react'

export default async function AdminAffiliazionePage() {
  const affiliateLinks = await prisma.affiliateLink.findMany({
    include: {
      _count: {
        select: { products: true, offers: true, restaurants: true, experiences: true },
      },
    },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Monetizzazione & Partner
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Programmi di Affiliazione
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci i diversi network (Booking.com, Amazon, Awin, brand partner), i tracking ID e monitora i clic.
        </p>
      </div>

      <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF0DE] border-b border-[#EAE3D2] text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Etichetta Programma</th>
              <th className="py-3 px-4">Provider / Network</th>
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Contenuti Collegati</th>
              <th className="py-3 px-4">Stato</th>
              <th className="py-3 px-4 text-right">URL Affiliato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D2]">
            {affiliateLinks.map((a) => (
              <tr key={a.id} className="hover:bg-[#FAF4E6]">
                <td className="py-3.5 px-4 font-semibold text-stone-900">{a.label}</td>
                <td className="py-3.5 px-4 text-stone-600 font-medium">{a.provider}</td>
                <td className="py-3.5 px-4 font-mono text-stone-700">{a.trackingId || '—'}</td>
                <td className="py-3.5 px-4 text-stone-600">
                  {a._count.products} prodotti • {a._count.offers} offerte • {a._count.experiences} hotel
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      a.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {a.status === 'ACTIVE' ? 'Attivo' : 'Inattivo'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href={a.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B8922E] hover:underline inline-flex items-center space-x-1"
                  >
                    <span className="truncate max-w-[150px] inline-block">{a.affiliateUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
