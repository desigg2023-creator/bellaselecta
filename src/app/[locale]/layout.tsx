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
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })

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

  // Fetch active categories from database (never hardcoded)
  const categoriesDb = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const categories = categoriesDb.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: getLocalized(c, 'name', currentLocale),
    icon: c.icon,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={currentLocale} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer locale={currentLocale} categories={categories} />
    </div>
  )
}
