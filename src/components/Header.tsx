'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Globe, ChevronDown, Sparkles, Menu, X, ShieldCheck } from 'lucide-react'
import { Locale, languageNames, uiTranslations } from '@/lib/i18n'

interface HeaderCategory {
  id: string
  slug: string
  name: string
  icon?: string | null
}

interface HeaderProps {
  locale: Locale
  categories: HeaderCategory[]
}

export default function Header({ locale, categories }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = uiTranslations[locale] || uiTranslations.it
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLanguageChange = (newLocale: Locale) => {
    // Replace locale in path or redirect to home with new locale
    const segments = pathname.split('/')
    if (['it', 'es', 'en'].includes(segments[1])) {
      segments[1] = newLocale
      router.push(segments.join('/'))
    } else {
      router.push(`/${newLocale}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/${locale}/cerca?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
  }

  return (
    <header className="w-full bg-[#FDFBF7] border-b border-[#EAE3D2] sticky top-0 z-40 transition-all duration-200">
      {/* Top micro bar */}
      <div className="bg-[#1C1917] text-[#D6CEBE] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B8922E] animate-pulse"></span>
            <span className="tracking-widest uppercase font-medium text-[11px]">
              {t.siteTagline}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center space-x-1.5 text-stone-300 hover:text-white transition-colors py-0.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#B8922E]" />
                <span className="font-semibold text-xs uppercase">{locale}</span>
                <span>{languageNames[locale].flag}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <div className="absolute right-0 mt-1 w-32 bg-stone-900 border border-stone-800 rounded shadow-xl py-1 hidden group-hover:block z-50">
                {(['it', 'es', 'en'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-800 transition-colors ${
                      loc === locale ? 'text-[#DFBD69] font-bold' : 'text-stone-300'
                    }`}
                  >
                    <span>{languageNames[loc].name}</span>
                    <span>{languageNames[loc].flag}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/admin/login"
              className="text-[11px] text-stone-400 hover:text-[#DFBD69] transition-colors flex items-center space-x-1 pl-2 border-l border-stone-700"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Redazione</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Logo & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-700 hover:text-stone-900"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO AREA - With reserved space for custom image logo in the future */}
        <div className="flex-1 text-center lg:text-left flex items-center justify-center lg:justify-start">
          <Link href={`/${locale}`} className="group inline-flex items-center space-x-3">
            {/* Logo Emblem Placeholder (ready for SVG / PNG logo upload later) */}
            <div className="w-10 h-10 rounded border border-[#B8922E]/40 bg-[#FAF4E6] flex items-center justify-center text-[#B8922E] shadow-sm group-hover:border-[#B8922E] transition-all">
              <span className="font-serif font-bold text-xl tracking-tighter">B</span>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium text-stone-900 uppercase">
                Bella<span className="font-bold text-[#B8922E]">Selecta</span>
              </span>
              <span className="text-[9px] tracking-[0.28em] text-stone-500 uppercase -mt-0.5">
                Curated Discovery & Lifestyle
              </span>
            </div>
          </Link>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 bg-[#F7F3EB] hover:bg-[#EFE8DA] px-3.5 py-2 rounded-full border border-[#E5DEC9] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#B8922E]" />
            <span className="hidden sm:inline">{t.searchButton}</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar (Expands smoothly) */}
      {searchOpen && (
        <div className="bg-[#FAF6EE] border-t border-b border-[#EAE3D2] px-4 py-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="flex-1 bg-transparent text-sm text-stone-800 placeholder-stone-400 outline-none py-1"
            />
            <button
              type="submit"
              className="bg-[#1C1917] text-white hover:bg-[#B8922E] text-xs uppercase tracking-widest px-4 py-1.5 rounded transition-colors"
            >
              {t.searchButton}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-1 text-sm"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* Desktop Category Navigation */}
      <nav className="hidden lg:block border-t border-[#EAE3D2]/70 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center space-x-8 py-2.5">
          <Link
            href={`/${locale}`}
            className="text-xs uppercase tracking-[0.16em] font-medium text-stone-700 hover:text-[#B8922E] transition-colors py-1"
          >
            {t.navHome}
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/categoria/${cat.slug}`}
              className="text-xs uppercase tracking-[0.16em] font-medium text-stone-700 hover:text-[#B8922E] transition-colors py-1 relative group"
            >
              {cat.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B8922E] transition-all group-hover:w-full"></span>
            </Link>
          ))}

          <Link
            href={`/${locale}/scopri`}
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#B8922E] hover:text-[#9A7A24] transition-colors py-1 flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{t.navDiscover}</span>
          </Link>

          <Link
            href={`/${locale}/offerte`}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-rose-700 hover:text-rose-900 transition-colors py-1"
          >
            {t.navOffers}
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-t border-[#EAE3D2] px-6 py-6 space-y-4 shadow-lg animate-fadeIn">
          <div className="space-y-3">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold uppercase tracking-wider text-stone-800 hover:text-[#B8922E]"
            >
              {t.navHome}
            </Link>

            <div className="pt-2 pb-1 text-xs font-semibold text-stone-400 uppercase tracking-widest">
              {t.navCategories}
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/categoria/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone-700 hover:text-[#B8922E] pl-2 border-l-2 border-transparent hover:border-[#B8922E]"
              >
                {cat.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-[#EAE3D2] space-y-2">
              <Link
                href={`/${locale}/scopri`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-medium text-[#B8922E]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.navDiscover}</span>
              </Link>
              <Link
                href={`/${locale}/offerte`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-rose-700"
              >
                {t.navOffers}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
