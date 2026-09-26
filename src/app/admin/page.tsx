import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  FileText,
  ShoppingBag,
  Tag,
  Languages,
  Sparkles,
  PlusCircle,
  ExternalLink,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const user = await getSessionUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Real-time statistics from SQLite database
  const publishedArticlesCount = await prisma.article.count({ where: { status: 'PUBLISHED' } })
  const draftArticlesCount = await prisma.article.count({ where: { status: 'DRAFT' } })
  const productsCount = await prisma.product.count({ where: { status: 'PUBLISHED' } })
  const activeOffersCount = await prisma.offer.count({ where: { status: 'ACTIVE' } })
  const featuredArticlesCount = await prisma.article.count({ where: { isFeatured: true } })
  const categoriesCount = await prisma.category.count({ where: { isActive: true } })

  // Check pending translations (articles without Spanish or English titles)
  const pendingTranslationsCount = await prisma.article.count({
    where: {
      OR: [{ title_es: '' }, { title_en: '' }],
    },
  })

  // Recent articles
  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

  // AI settings status
  const aiSettings = await prisma.aISettings.findUnique({ where: { id: 'singleton' } })

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B8922E] font-semibold">
            Pannello di Controllo Redazione
          </span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
            Benvenuta in BellaSelecta
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Gestisci tutti i contenuti, prodotti, offerte e relazioni senza scrivere codice.
          </p>
        </div>

        {/* Quick Actions (Botones de acceso rápido) */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/articoli/nuovo"
            className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuovo Articolo</span>
          </Link>
          <Link
            href="/admin/prodotti"
            className="bg-[#FAF4E6] hover:bg-[#F2E8D0] text-[#9A7A24] border border-[#E5DEC9] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuovo Prodotto</span>
          </Link>
          <Link
            href="/admin/offerte"
            className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuova Offerta</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Pubblicati</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{publishedArticlesCount}</div>
          <span className="text-[10px] text-stone-400">Articoli visibili</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Bozze</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">{draftArticlesCount}</div>
          <span className="text-[10px] text-stone-400">Da revisionare</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Prodotti</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{productsCount}</div>
          <span className="text-[10px] text-stone-400">In vetrina</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Offerte</span>
            <Tag className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{activeOffersCount}</div>
          <span className="text-[10px] text-stone-400">Attive ora</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">In Evidenza</span>
            <Sparkles className="w-4 h-4 text-[#B8922E]" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{featuredArticlesCount}</div>
          <span className="text-[10px] text-stone-400">Su homepage</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Traduzioni</span>
            <Languages className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-violet-900">{pendingTranslationsCount}</div>
          <span className="text-[10px] text-stone-400">Da completare</span>
        </div>
      </div>

      {/* AI Status Banner (Requirement 20 & 21: Visible, safe status) */}
      <div className="bg-[#FAF6EE] border border-[#E8DFC8] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${aiSettings?.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-stone-900 text-sm">
                Connessione Intelligenza Artificiale
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                aiSettings?.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
              }`}>
                {aiSettings?.isEnabled ? 'Attiva' : 'Disattivata di default'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {aiSettings?.isEnabled
                ? `Connesso a ${aiSettings.provider}. Pronto per assistere nella redazione.`
                : 'La piattaforma funziona autonomamente al 100% senza alcun costo o chiamata API esterna.'}
            </p>
          </div>
        </div>

        <Link
          href="/admin/ia"
          className="text-xs font-semibold text-[#B8922E] hover:text-[#9A7A24] uppercase tracking-wider self-start sm:self-auto border border-[#DFD6C2] bg-white px-3.5 py-1.5 rounded-lg shadow-sm"
        >
          Gestisci Connessioni IA
        </Link>
      </div>

      {/* Main Content Sections: Recent Articles & Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Articles List */}
        <div className="lg:col-span-8 bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Articoli Recenti
            </h2>
            <Link
              href="/admin/articoli"
              className="text-xs text-[#B8922E] hover:underline uppercase tracking-wider font-semibold"
            >
              Vedi tutti ({publishedArticlesCount + draftArticlesCount})
            </Link>
          </div>

          <div className="divide-y divide-[#EAE3D2]">
            {recentArticles.map((article) => (
              <div key={article.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${
                        article.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {article.status === 'PUBLISHED' ? 'Pubblicato' : 'Bozza'}
                    </span>
                    {article.isFeatured && (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF4E6] text-[#B8922E] border border-[#E8DBBC]">
                        In Evidenza
                      </span>
                    )}
                    <span className="text-xs text-stone-400">
                      {article.category.name_it}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-stone-900 text-sm hover:text-[#B8922E]">
                    {article.title_it}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <Link
                    href={`/admin/articoli/anteprima/${article.id}`}
                    className="text-stone-600 hover:text-stone-900 bg-white border border-[#E5DEC9] px-2.5 py-1 rounded"
                  >
                    Anteprima
                  </Link>
                  <Link
                    href={`/admin/articoli/modifica/${article.id}`}
                    className="text-[#B8922E] hover:text-[#9A7A24] font-semibold bg-white border border-[#E5DEC9] px-2.5 py-1 rounded"
                  >
                    Modifica
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Links & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-[#EAE3D2] pb-3">
              Guida Rapida Redazione
            </h3>
            <ul className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8922E] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Flusso di pubblicazione:</strong> Crea l'articolo, salvalo come bozza, controlla l'anteprima (anche mobile) e pubblicalo solo quando è perfetto.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8922E] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Relazioni automatiche:</strong> Quando colleghi un prodotto o un hotel a un articolo, comparirà automaticamente nei box dedicati.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8922E] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Multilingua:</strong> L'italiano è primario. Puoi aggiungere titoli e testi in spagnolo e inglese quando desideri.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
