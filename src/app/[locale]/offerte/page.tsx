import React from 'react'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations } from '@/lib/i18n'
import OfferCard from '@/components/OfferCard'
import { Tag, ShieldCheck } from 'lucide-react'

interface OffertePageProps {
  params: { locale: string }
}

export default async function OffertePage({ params }: OffertePageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it

  const offers = await prisma.offer.findMany({
    where: { status: 'ACTIVE' },
    include: { brand: true, category: true, affiliateLink: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-16 pb-20">
      <section className="bg-[#FAF3E0] border-b border-[#DFD0AC] py-16 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-rose-800 text-xs uppercase tracking-[0.25em] font-bold">
            <Tag className="w-4 h-4" />
            <span>Privilegi & Opportunità</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900">
            {t.curatedOffers}
          </h1>
          <p className="editorial-lead text-base sm:text-lg text-stone-600 max-w-xl mx-auto font-light">
            {t.offersSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}
