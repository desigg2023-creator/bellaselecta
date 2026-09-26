'use client'

import React, { useState } from 'react'
import { Locale, uiTranslations, getLocalized } from '@/lib/i18n'
import { Tag, Copy, Check, ExternalLink, Calendar } from 'lucide-react'

interface OfferCardProps {
  offer: any
  locale: Locale
}

export default function OfferCard({ offer, locale }: OfferCardProps) {
  const t = uiTranslations[locale] || uiTranslations.it
  const title = getLocalized(offer, 'title', locale)
  const description = getLocalized(offer, 'description', locale)
  const conditions = getLocalized(offer, 'conditions', locale)
  const [copied, setCopied] = useState(false)

  const targetUrl = offer.affiliateLink?.affiliateUrl || offer.externalUrl || '#'

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="bg-[#FDFBF7] border border-[#EAE3D2] rounded-lg overflow-hidden flex flex-col hover:border-[#B8922E]/80 transition-all duration-300 shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        <img
          src={offer.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop'}
          alt={title}
          className="w-full h-full object-cover"
        />
        {offer.discountPercentage && (
          <span className="absolute top-3 right-3 bg-rose-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
            -{offer.discountPercentage}%
          </span>
        )}
        {offer.brand && (
          <span className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-sm text-[#DFBD69] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
            {offer.brand.name}
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h4 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>

        {/* Promo code badge if present */}
        {offer.promoCode && (
          <div className="bg-[#FAF4E6] border border-[#E8DBBC] rounded p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-stone-700">
              <Tag className="w-3.5 h-3.5 text-[#B8922E]" />
              <span className="font-mono font-bold text-stone-900 tracking-wider">
                {offer.promoCode}
              </span>
            </div>
            <button
              onClick={() => copyCode(offer.promoCode)}
              className="text-[11px] font-semibold text-[#B8922E] hover:text-[#9A7A24] flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copiato!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copia</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
          <div className="flex flex-col">
            {offer.previousPrice && (
              <span className="text-xs text-stone-400 line-through">
                {offer.previousPrice.toFixed(2)} €
              </span>
            )}
            <span className="text-lg font-serif font-bold text-stone-900">
              {offer.offerPrice ? `${offer.offerPrice.toFixed(2)} €` : 'Offerta Esclusiva'}
            </span>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded transition-colors"
          >
            <span>{t.viewOffer}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
