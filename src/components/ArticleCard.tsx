import React from 'react'
import Link from 'next/link'
import { Locale, uiTranslations, getLocalized } from '@/lib/i18n'
import { Clock, ArrowUpRight } from 'lucide-react'

interface ArticleCardProps {
  article: any
  locale: Locale
  layout?: 'standard' | 'horizontal' | 'compact'
}

export default function ArticleCard({ article, locale, layout = 'standard' }: ArticleCardProps) {
  const t = uiTranslations[locale] || uiTranslations.it
  const title = getLocalized(article, 'title', locale)
  const subtitle = getLocalized(article, 'subtitle', locale)
  const categoryName = article.category ? getLocalized(article.category, 'name', locale) : ''

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  if (layout === 'horizontal') {
    return (
      <article className="group bg-[#FDFBF7] border border-[#EAE3D2] rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300">
        <div className="md:w-5/12 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-stone-200">
          <img
            src={article.coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {article.isFeatured && (
            <span className="absolute top-3 left-3 bg-[#1C1917] text-[#DFBD69] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
              {t.featuredBadge}
            </span>
          )}
        </div>

        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-stone-500">
              <span className="font-semibold text-[#B8922E]">{categoryName}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>

            <Link href={`/${locale}/articoli/${article.slug}`}>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-[#B8922E] transition-colors leading-tight">
                {title}
              </h3>
            </Link>

            {subtitle && (
              <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 font-light">
                {subtitle}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-[#F0EBE0] flex items-center justify-between">
            <span className="text-xs text-stone-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>4 {t.readingTime}</span>
            </span>

            <Link
              href={`/${locale}/articoli/${article.slug}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#1C1917] group-hover:text-[#B8922E] transition-colors"
            >
              <span>{t.readArticle}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-[#FDFBF7] border border-[#EAE3D2] rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
        <img
          src={article.coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {article.isFeatured && (
          <span className="absolute top-3 left-3 bg-[#1C1917] text-[#DFBD69] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
            {t.featuredBadge}
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-stone-500">
            <span className="font-semibold text-[#B8922E]">{categoryName}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <Link href={`/${locale}/articoli/${article.slug}`}>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-[#B8922E] transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          {subtitle && (
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
              {subtitle}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#F0EBE0] flex items-center justify-between text-xs">
          <span className="text-stone-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>3 {t.readingTime}</span>
          </span>

          <Link
            href={`/${locale}/articoli/${article.slug}`}
            className="inline-flex items-center space-x-1 font-semibold uppercase tracking-wider text-[#1C1917] group-hover:text-[#B8922E] transition-colors"
          >
            <span>{t.readArticle}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
