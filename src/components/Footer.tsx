'use client'

import React from 'react'
import Link from 'next/link'
import { Locale, uiTranslations } from '@/lib/i18n'
import { Mail, ShieldCheck } from 'lucide-react'

interface FooterCategory {
  id: string
  slug: string
  name: string
}

interface FooterProps {
  locale: Locale
  categories: FooterCategory[]
}

export default function Footer({ locale, categories }: FooterProps) {
  const t = uiTranslations[locale] || uiTranslations.it

  return (
    <footer className="bg-[#191715] text-[#ECE7DF] border-t border-[#312E2B] mt-24">
      {/* Newsletter VIP / Club Banner */}
      <div className="border-b border-[#312E2B] bg-[#221F1C] py-14 px-6 sm:px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[#DFBD69] text-xs uppercase tracking-[0.25em] font-semibold">
            {t.newsletterTitle}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Iscriviti alla Selezione Riservata
          </h3>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            {t.newsletterSubtitle}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t.newsletterPlaceholder}
              className="flex-1 bg-[#191715] border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-[#DFBD69]"
            />
            <button
              type="submit"
              className="bg-[#B8922E] hover:bg-[#A38025] text-stone-950 font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded transition-colors"
            >
              {t.newsletterButton}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded border border-[#B8922E]/50 bg-stone-900 flex items-center justify-center text-[#B8922E]">
              <span className="font-serif font-bold text-lg">B</span>
            </div>
            <span className="font-serif text-2xl tracking-[0.15em] font-medium text-white">
              Bella<span className="text-[#DFBD69] font-bold">Selecta</span>
            </span>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed font-light">
            {t.footerAbout}
          </p>
          <div className="flex items-center space-x-4 pt-2 text-stone-400">
            {/* Instagram SVG */}
            <a href="https://instagram.com/bellaselecta" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFBD69] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* Facebook SVG */}
            <a href="https://facebook.com/bellaselecta" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFBD69] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="mailto:info@bellaselecta.it" className="hover:text-[#DFBD69] transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Categories column */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBD69]">
            {t.navCategories}
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/${locale}/categoria/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Discovery & Offers column */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBD69]">
            Esplora
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <Link href={`/${locale}/scopri`} className="hover:text-white transition-colors">
                {t.navDiscover}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/offerte`} className="hover:text-white transition-colors text-rose-300">
                {t.navOffers}
              </Link>
            </li>
            {categories.slice(5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/${locale}/categoria/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Editorial & Privacy column */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBD69]">
            Redazione & Etica
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            I contenuti editoriali sono indipendenti. Alcuni articoli possono contenere link di affiliazione selezionati senza alcun costo aggiuntivo per il lettore.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-[#DFBD69] transition-colors py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footerAdmin}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#262320] py-6 px-6 sm:px-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} BellaSelecta. {t.footerLegal}</span>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Cookie Policy</span>
            <span>•</span>
            <span>Dichiarazione Affiliazione</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
