import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Locale, defaultLocale, locales, uiTranslations, getLocalized } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'
import ProductCard from '@/components/ProductCard'
import OfferCard from '@/components/OfferCard'
import { ArrowRight, Sparkles, Compass, ShieldCheck, ChevronRight } from 'lucide-react'

interface HomePageProps {
  params: { locale: string }
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  const t = uiTranslations[locale] || uiTranslations.it

  let settings: any = null
  let heroArticle: any = null
  let latestArticles: any[] = []
  let featuredArticles: any[] = []
  let categoriesWithArticles: any[] = []
  let activeOffers: any[] = []
  let spotlightProducts: any[] = []

  try {
    // 1. Fetch site settings to check if a specific hero article was selected from the admin panel
    settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    })

    // 2. Fetch Hero Article (either explicitly selected or latest published featured article)
    if (settings?.featuredArticleId) {
      heroArticle = await prisma.article.findUnique({
        where: { id: settings.featuredArticleId },
        include: { category: true },
      })
    }

    if (!heroArticle || heroArticle.status !== 'PUBLISHED') {
      heroArticle = await prisma.article.findFirst({
        where: { status: 'PUBLISHED', isFeatured: true },
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
      })
    }

    // 3. Fetch Latest Articles
    latestArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        id: heroArticle ? { not: heroArticle.id } : undefined,
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    })

    // 4. Fetch Curated Featured Articles
    featuredArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
        id: heroArticle ? { not: heroArticle.id } : undefined,
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })

    // 5. Fetch Active Categories with their latest articles
    categoriesWithArticles = await prisma.category.findMany({
      where: { isActive: true, showOnHomepage: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 3,
          include: { category: true },
        },
      },
    })

    // 6. Fetch Curated Offers for Homepage
    activeOffers = await prisma.offer.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      include: { brand: true, category: true, affiliateLink: true },
      take: 3,
    })

    // 7. Fetch Featured Products for Discovery spotlight
    spotlightProducts = await prisma.product.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      include: { brand: true, affiliateLink: true },
      take: 4,
    })
  } catch (err) {
    console.warn('Warning: Database error in HomePage:', err?.message || err)
  }

  const heroTitle = heroArticle ? getLocalized(heroArticle, 'title', locale) : ''
  const heroSubtitle = heroArticle ? getLocalized(heroArticle, 'subtitle', locale) : ''
  const heroCategory = heroArticle?.category ? getLocalized(heroArticle.category, 'name', locale) : ''

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION - Editorial Prominent Spotlight */}
      {heroArticle && (
        <section className="relative bg-[#FAF6EE] border-b border-[#EAE3D2] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Image Frame */}
              <div className="lg:col-span-7 relative group">
                <div className="aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-xl border border-[#DFD6C2] bg-stone-900">
                  <img
                    src={heroArticle.coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop'}
                    alt={heroTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-[#1C1917]/90 backdrop-blur-sm text-[#DFBD69] text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-[#B8922E]/40 shadow-sm flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selezione in Primo Piano</span>
                </div>
              </div>

              {/* Text Editorial Box */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8922E]">
                    <span>{heroCategory}</span>
                    <span>•</span>
                    <span className="text-stone-500 font-normal">
                      {heroArticle.publishedAt
                        ? new Date(heroArticle.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>

                  <Link href={`/${locale}/articoli/${heroArticle.slug}`}>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-[1.15] hover:text-[#B8922E] transition-colors">
                      {heroTitle}
                    </h1>
                  </Link>
                </div>

                {heroSubtitle && (
                  <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
                    {heroSubtitle}
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    href={`/${locale}/articoli/${heroArticle.slug}`}
                    className="inline-flex items-center space-x-2 bg-[#1C1917] hover:bg-[#B8922E] text-white px-7 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-200 shadow-md group"
                  >
                    <span>{t.readArticle}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ULTIMI ARTICOLI (Flusso automatico delle pubblicazioni recenti) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EAE3D2] pb-4 mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8922E] block mb-1">
              {t.latestArticles}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
              Scoperte & Nuove Storie
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md">
            {t.latestSubtitle}
          </p>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} layout="horizontal" />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-500 font-light border border-dashed border-[#DFD6C2] rounded-xl bg-[#FAF8F3]">
            <p className="font-serif text-lg text-stone-700 mb-1">Benvenuti su BellaSelecta</p>
            <p className="text-sm">I primi articoli e selezioni editoriali saranno pubblicati a breve.</p>
          </div>
        )}
      </section>

      {/* 3. SELEZIONE IN EVIDENZA (Curated manual selection) */}
      {featuredArticles.length > 0 && (
        <section className="bg-[#FAF4E6]/50 border-t border-b border-[#EAE3D2] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8922E]">
                {t.curatedSelection}
              </span>
              <h2 className="font-serif text-3xl font-semibold text-stone-900">
                La Scelta della Redazione
              </h2>
              <p className="text-sm text-stone-600 font-light">
                {t.curatedSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRODOTTI SELEZIONATI (Curated Discovery Showcase) */}
      {spotlightProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EAE3D2] pb-4 mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8922E] block mb-1">
                Oggetti del Desiderio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                Prodotti & Artigianato Selezionato
              </h2>
            </div>
            <Link
              href={`/${locale}/scopri`}
              className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#B8922E] hover:text-[#9A7A24]"
            >
              <span>Vedi tutti i prodotti</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spotlightProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* 5. OFFERTE CURATE (Offerte esclusive e privilegi selezionati) */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#FAF3E0] border border-[#DFD0AC] rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8C69B] pb-6 mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-rose-800 block mb-1">
                  {t.curatedOffers}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                  Privilegi & Opportunità Esclusive
                </h2>
              </div>
              <Link
                href={`/${locale}/offerte`}
                className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:text-[#B8922E]"
              >
                <span>Tutte le Offerte</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BLOCCHI PER CATEGORIA (Dinamici, gestibili da admin) */}
      {categoriesWithArticles.map((category) => {
        const catName = getLocalized(category, 'name', locale)
        const catDesc = getLocalized(category, 'description', locale)

        if (category.articles.length === 0) return null

        return (
          <section key={category.id} className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EAE3D2] pb-4 mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8922E] block mb-1">
                  Sezione {catName}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                  {catName}
                </h2>
                {catDesc && (
                  <p className="text-xs sm:text-sm text-stone-500 font-light mt-1 max-w-xl">
                    {catDesc}
                  </p>
                )}
              </div>
              <Link
                href={`/${locale}/categoria/${category.slug}`}
                className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:text-[#B8922E]"
              >
                <span>Esplora {catName}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
