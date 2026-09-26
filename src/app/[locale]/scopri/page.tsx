import React from 'react'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations, getLocalized } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'
import ProductCard from '@/components/ProductCard'
import { Sparkles, Compass, Utensils, MapPin } from 'lucide-react'

interface ScopriPageProps {
  params: { locale: string }
}

export default async function ScopriPage({ params }: ScopriPageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 6,
  })

  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: { brand: true, affiliateLink: true },
    take: 8,
  })

  const destinations = await prisma.destination.findMany({
    where: { isFeatured: true },
    include: { restaurants: true },
    take: 4,
  })

  return (
    <div className="space-y-20 pb-20">
      <section className="bg-[#FAF6EE] border-b border-[#EAE3D2] py-16 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#B8922E] text-xs uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Spazio di Esplorazione</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900">
            {t.navDiscover}
          </h1>
          <p className="editorial-lead text-base sm:text-lg text-stone-600 max-w-xl mx-auto font-light">
            Ispirazioni inedite, perle nascoste del territorio e creazioni d’eccellenza selezionate per te.
          </p>
        </div>
      </section>

      {/* Destinations Spotlight */}
      {destinations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-b border-[#EAE3D2] pb-4 mb-8 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#B8922E]" />
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Luoghi & Destinazioni d’Incanto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative rounded-xl overflow-hidden aspect-[16/10] bg-stone-900 shadow-md border border-[#DFD6C2]"
              >
                {dest.coverImage && (
                  <img
                    src={dest.coverImage}
                    alt={getLocalized(dest, 'name', locale)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFBD69]">
                    {dest.region} • {dest.country}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                    {getLocalized(dest, 'name', locale)}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 line-clamp-2">
                    {getLocalized(dest, 'description', locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Showcase */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-b border-[#EAE3D2] pb-4 mb-8">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Scoperte & Artigianato
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Articles Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="border-b border-[#EAE3D2] pb-4 mb-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Ultime Selezioni & Racconti
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}
