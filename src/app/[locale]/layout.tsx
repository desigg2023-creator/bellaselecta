import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Locale, locales, defaultLocale, getLocalized } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const currentLocale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale
  let settings = null
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  } catch (err) {
    console.warn('Warning: Database not ready in generateMetadata:', err?.message || err)
  }

  const metaTitle = getLocalized(settings, 'defaultMetaTitle', currentLocale) || 'BellaSelecta | Curated Discovery & Italian Lifestyle'
  const metaDescription = getLocalized(settings, 'defaultMetaDescription', currentLocale) || "L'arte della scoperta: selezione editoriale di eccellenze italiane."

  return {
    title: {
      default: metaTitle,
      template: `%s | BellaSelecta`,
    },
    description: metaDescription,
    alternates: {
      canonical: `/${currentLocale}`,
      languages: {
        it: '/it',
        es: '/es',
        en: '/en',
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: 'BellaSelecta',
      locale: currentLocale,
      type: 'website',
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const currentLocale = (locales.includes(params.locale as Locale) ? params.locale : defaultLocale) as Locale

  // Fallback categories in case database is still initializing
  let categories = [
    { id: 'moda', slug: 'moda', name: currentLocale === 'it' ? 'Moda' : currentLocale === 'es' ? 'Moda' : 'Fashion', icon: 'Sparkles' },
    { id: 'bellezza', slug: 'bellezza', name: currentLocale === 'it' ? 'Bellezza' : currentLocale === 'es' ? 'Belleza' : 'Beauty', icon: 'Heart' },
    { id: 'fitness-benessere', slug: 'fitness-benessere', name: currentLocale === 'it' ? 'Fitness & Benessere' : currentLocale === 'es' ? 'Fitness y Bienestar' : 'Fitness & Wellness', icon: 'Activity' },
    { id: 'gastronomia', slug: 'gastronomia', name: currentLocale === 'it' ? 'Gastronomia' : currentLocale === 'es' ? 'Gastronomía' : 'Gastronomy', icon: 'Utensils' },
    { id: 'viaggi', slug: 'viaggi', name: currentLocale === 'it' ? 'Viaggi' : currentLocale === 'es' ? 'Viajes' : 'Travel', icon: 'Compass' },
  ]

  try {
    const categoriesDb = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (categoriesDb && categoriesDb.length > 0) {
      categories = categoriesDb.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: getLocalized(c, 'name', currentLocale),
        icon: c.icon,
      }))
    }
  } catch (err) {
    console.warn('Warning: Database not ready in LocaleLayout:', err?.message || err)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={currentLocale} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer locale={currentLocale} categories={categories} />
    </div>
  )
}
