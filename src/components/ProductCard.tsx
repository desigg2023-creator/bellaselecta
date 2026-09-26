import React from 'react'
import Link from 'next/link'
import { Locale, uiTranslations, getLocalized } from '@/lib/i18n'
import { ExternalLink, Tag } from 'lucide-react'

interface ProductCardProps {
  product: any
  locale: Locale
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = uiTranslations[locale] || uiTranslations.it
  const name = getLocalized(product, 'name', locale)
  const description = getLocalized(product, 'description', locale)
  const targetUrl = product.affiliateLink?.affiliateUrl || product.externalUrl || '#'

  return (
    <div className="group bg-[#FDFBF7] border border-[#EAE3D2] rounded-lg overflow-hidden flex flex-col hover:border-[#B8922E]/60 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-[#FAF6EE] p-4 flex items-center justify-center">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {product.brand && (
          <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
            {product.brand.name}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h4 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#B8922E] transition-colors line-clamp-1">
            {name}
          </h4>
          {description && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-stone-900 text-sm">
              {product.price.toFixed(2)} €
            </span>
            {product.previousPrice && (
              <span className="text-xs text-stone-400 line-through">
                {product.previousPrice.toFixed(2)} €
              </span>
            )}
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#B8922E] hover:text-[#9A7A24] transition-colors"
          >
            <span>{t.viewProduct}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
