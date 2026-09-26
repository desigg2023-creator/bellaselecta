import React from 'react'
import { prisma } from '@/lib/prisma'
import AISettingsPanel from '@/components/admin/AISettingsPanel'

export default async function AdminAIPage() {
  const settings = await prisma.aISettings.findUnique({
    where: { id: 'singleton' },
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="border-b border-[#EAE3D2] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
          Integrazioni Esterne
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
          Intelligenza Artificiale
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Architettura predisposta per connessioni future. Disattivata per impostazione predefinita per azzerare costi e dipendenze.
        </p>
      </div>

      <AISettingsPanel initialSettings={settings} />
    </div>
  )
}
