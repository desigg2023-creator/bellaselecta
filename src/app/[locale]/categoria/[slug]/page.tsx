import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations, getLocalized } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'
import ProductCard from '@/components/ProductCard'
import OfferCard from '@/components/OfferCard'

interface CategoryPageProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) return {}

  const title = getLocalized(category, 'seoTitle', locale) || getLocalized(category, 'name', locale)
  const description = getLocalized(category, 'seoDescription', locale) || getLocalized(category, 'description', locale)

  return {
    title: `${title} | BellaSelecta`,
    description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      },
      products: {
        where: { status: 'PUBLISHED' },
        include: { brand: true, affiliateLink: true },
        take: 6,
      },
      offers: {
        where: { status: 'ACTIVE' },
        include: { brand: true, affiliateLink: true },
        take: 4,
      },
    },
  })

  if (!category || !category.isActive) {
    notFound()
  }

  const categoryName = getLocalized(category, 'name', locale)
  const categoryDesc = getLocalized(category, 'description', locale)

  return (
    <div className="space-y-16 pb-20">
      {/* Category Editorial Hero */}
      <section className="relative bg-[#FAF6EE] border-b border-[#EAE3D2] py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8922E]">
            Selezione Editoriale
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900">
            {categoryName}
          </h1>
          {categoryDesc && (
            <p className="editorial-lead text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
              {categoryDesc}
            </p>
          )}
        </div>
      </section>

      {/* Articles in this Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="border-b border-[#EAE3D2] pb-4 mb-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Storie & Articoli su {categoryName}
          </h2>
        </div>

        {category.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {category.articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-stone-400 bg-[#FAF7F0] rounded-lg border border-dashed border-[#DFD8C7]">
            Nessun articolo pubblicato al momento in questa sezione.
          </div>
        )}
      </section>

      {/* Products in this Category */}
      {category.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-b border-[#EAE3D2] pb-4 mb-8">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Prodotti & Marchi Consigliati
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Offers in this Category */}
      {category.offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-b border-[#EAE3D2] pb-4 mb-8">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Offerte & Vantaggi Esclusivi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
