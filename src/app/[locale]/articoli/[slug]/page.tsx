import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations, getLocalized } from '@/lib/i18n'
import ProductCard from '@/components/ProductCard'
import OfferCard from '@/components/OfferCard'
import { Clock, Calendar, ArrowLeft, MapPin, Utensils, Hotel, Sparkles, Share2, Tag, Compass } from 'lucide-react'

interface ArticlePageProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  })

  if (!article) return {}

  const title = getLocalized(article, 'seoTitle', locale) || getLocalized(article, 'title', locale)
  const description = getLocalized(article, 'seoDescription', locale) || getLocalized(article, 'subtitle', locale)

  return {
    title: `${title} | BellaSelecta`,
    description,
    openGraph: {
      title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it

  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      relatedProducts: {
        include: {
          product: {
            include: { brand: true, affiliateLink: true },
          },
        },
      },
      relatedOffers: {
        include: {
          offer: {
            include: { brand: true, affiliateLink: true },
          },
        },
      },
      relatedBrands: {
        include: { brand: true },
      },
      relatedRestaurants: {
        include: {
          restaurant: {
            include: { affiliateLink: true },
          },
        },
      },
      relatedDestinations: {
        include: { destination: true },
      },
      relatedExperiences: {
        include: {
          experience: {
            include: { affiliateLink: true },
          },
        },
      },
    },
  })

  if (!article || article.status !== 'PUBLISHED') {
    notFound()
  }

  const title = getLocalized(article, 'title', locale)
  const subtitle = getLocalized(article, 'subtitle', locale)
  const content = getLocalized(article, 'content', locale)
  const categoryName = article.category ? getLocalized(article.category, 'name', locale) : ''

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const tagList = article.tags ? article.tags.split(',').map((t) => t.trim()) : []

  return (
    <article className="pb-24">
      {/* Header & Breadcrumb */}
      <div className="bg-[#FAF6EE] border-b border-[#EAE3D2] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href={`/${locale}/categoria/${article.category.slug}`}
            className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-semibold text-[#B8922E] hover:text-[#9A7A24] mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{categoryName}</span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-[1.18] mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="editorial-lead text-lg sm:text-xl text-stone-600 mb-8 font-light">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E8DFC8] text-xs text-stone-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B8922E]" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B8922E]" />
                <span>4 {t.readingTime}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400">
                Redazione BellaSelecta
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {article.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 mb-12">
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-[#DCD3BE] bg-stone-900">
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="article-content leading-relaxed text-stone-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="pt-8 mt-12 border-t border-[#EAE3D2] flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-stone-400 mr-1" />
            {tagList.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#FAF4E6] text-stone-700 text-xs px-3 py-1 rounded-full border border-[#E5DEC9]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SYSTEM OF RELATIONS (Requirement 7) */}
      {/* 1. Related Destinations & Stays */}
      {(article.relatedDestinations.length > 0 || article.relatedExperiences.length > 0) && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-[#EAE3D2]">
          <div className="mb-6 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#B8922E]" />
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              {t.relatedPlaces}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.relatedDestinations.map(({ destination }) => (
              <div
                key={destination.id}
                className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-lg p-5 flex space-x-4 items-center"
              >
                {destination.coverImage && (
                  <img
                    src={destination.coverImage}
                    alt={getLocalized(destination, 'name', locale)}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B8922E] tracking-wider">
                    Destinazione
                  </span>
                  <h4 className="font-serif font-semibold text-stone-900 text-lg">
                    {getLocalized(destination, 'name', locale)}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {getLocalized(destination, 'description', locale)}
                  </p>
                </div>
              </div>
            ))}

            {article.relatedExperiences.map(({ experience }) => (
              <div
                key={experience.id}
                className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-lg p-5 flex space-x-4 items-center justify-between"
              >
                {experience.coverImage && (
                  <img
                    src={experience.coverImage}
                    alt={getLocalized(experience, 'title', locale)}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 px-3">
                  <span className="text-[10px] uppercase font-bold text-[#B8922E] tracking-wider">
                    {experience.type}
                  </span>
                  <h4 className="font-serif font-semibold text-stone-900 text-base">
                    {getLocalized(experience, 'title', locale)}
                  </h4>
                  {experience.price && (
                    <span className="text-xs font-bold text-stone-800 block mt-1">
                      da {experience.price.toFixed(2)} €
                    </span>
                  )}
                </div>
                {experience.bookingLink && (
                  <a
                    href={experience.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded transition-colors whitespace-nowrap"
                  >
                    Prenota
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Related Restaurants */}
      {article.relatedRestaurants.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <div className="mb-6 flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-[#B8922E]" />
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              {t.relatedDining}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.relatedRestaurants.map(({ restaurant }) => (
              <div
                key={restaurant.id}
                className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-lg p-5 flex space-x-4 items-center"
              >
                {restaurant.coverImage && (
                  <img
                    src={restaurant.coverImage}
                    alt={getLocalized(restaurant, 'name', locale)}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-[#B8922E] tracking-wider">
                      {restaurant.type}
                    </span>
                    <span className="text-xs text-stone-400">• {restaurant.priceRange}</span>
                  </div>
                  <h4 className="font-serif font-semibold text-stone-900 text-lg">
                    {getLocalized(restaurant, 'name', locale)}
                  </h4>
                  <p className="text-xs text-stone-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{restaurant.city} ({restaurant.region})</span>
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {getLocalized(restaurant, 'description', locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Related Products */}
      {article.relatedProducts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <div className="mb-6 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#B8922E]" />
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              {t.relatedProducts}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {article.relatedProducts.map(({ product }) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Related Offers */}
      {article.relatedOffers.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <div className="mb-6 flex items-center space-x-2">
            <Tag className="w-5 h-5 text-rose-700" />
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              {t.relatedOffers}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.relatedOffers.map(({ offer }) => (
              <OfferCard key={offer.id} offer={offer} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
