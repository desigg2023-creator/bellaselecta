import React from 'react'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations, getLocalized } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'
import ProductCard from '@/components/ProductCard'
import OfferCard from '@/components/OfferCard'
import { Search as SearchIcon } from 'lucide-react'

interface SearchPageProps {
  params: { locale: string }
  searchParams: { q?: string }
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it
  const query = searchParams.q ? searchParams.q.trim() : ''

  let articles: any[] = []
  let products: any[] = []
  let offers: any[] = []

  if (query) {
    // Search articles across multilingual title and content
    articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title_it: { contains: query } },
          { title_es: { contains: query } },
          { title_en: { contains: query } },
          { content_it: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      include: { category: true },
    })

    // Search products
    products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name_it: { contains: query } },
          { name_es: { contains: query } },
          { name_en: { contains: query } },
          { description_it: { contains: query } },
        ],
      },
      include: { brand: true, affiliateLink: true },
    })

    // Search offers
    offers = await prisma.offer.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title_it: { contains: query } },
          { title_es: { contains: query } },
          { title_en: { contains: query } },
          { promoCode: { contains: query } },
        ],
      },
      include: { brand: true, affiliateLink: true },
    })
  }

  const totalResults = articles.length + products.length + offers.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
          Risultati di Ricerca
        </h1>
        {query ? (
          <p className="text-sm text-stone-500">
            Trovati <span className="font-bold text-stone-900">{totalResults}</span> risultati per &ldquo;
            <span className="text-[#B8922E] font-medium">{query}</span>&rdquo;
          </p>
        ) : (
          <p className="text-sm text-stone-500">
            Inserisci un termine per cercare articoli, prodotti ed offerte.
          </p>
        )}
      </div>

      {totalResults === 0 && query && (
        <div className="p-12 text-center text-stone-400 bg-[#FAF7F0] rounded-lg border border-dashed border-[#DFD8C7] max-w-xl mx-auto">
          {t.noResults}
        </div>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 border-b border-[#EAE3D2] pb-3">
            Articoli ({articles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 border-b border-[#EAE3D2] pb-3">
            Prodotti ({products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Offers */}
      {offers.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 border-b border-[#EAE3D2] pb-3">
            Offerte ({offers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
