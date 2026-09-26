import React from 'react'
import { prisma } from '@/lib/prisma'
import MediaGallery from '@/components/admin/MediaGallery'

export default async function AdminMediaPage() {
  const mediaList = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Asset Visivi
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Biblioteca Multimedia
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Carica, gestisci e riutilizza fotografie ad alta risoluzione per articoli, prodotti e categorie.
        </p>
      </div>

      <MediaGallery initialMedia={mediaList} />
    </div>
  )
}
