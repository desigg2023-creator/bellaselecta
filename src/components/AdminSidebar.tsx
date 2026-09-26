'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Layers,
  Tag,
  Compass,
  Utensils,
  Briefcase,
  Image,
  Languages,
  Search,
  Link2,
  Bot,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'

interface AdminSidebarProps {
  user?: { name: string; email: string; role: string } | null
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Articoli', href: '/admin/articoli', icon: FileText },
    { label: 'Prodotti', href: '/admin/prodotti', icon: ShoppingBag },
    { label: 'Categorie', href: '/admin/categorie', icon: Layers },
    { label: 'Offerte', href: '/admin/offerte', icon: Tag },
    { label: 'Viaggi', href: '/admin/viaggi', icon: Compass },
    { label: 'Ristoranti & Food', href: '/admin/ristoranti', icon: Utensils },
    { label: 'Marchi & Partner', href: '/admin/marchi', icon: Briefcase },
    { label: 'Multimedia', href: '/admin/media', icon: Image },
    { label: 'Traduzioni', href: '/admin/traduzioni', icon: Languages },
    { label: 'SEO & Meta', href: '/admin/seo', icon: Search },
    { label: 'Affiliazione', href: '/admin/affiliazione', icon: Link2 },
    {
      label: 'Intelligenza Artificiale',
      href: '/admin/ia',
      icon: Bot,
      badge: 'Pronta',
    },
    { label: 'Impostazioni', href: '/admin/impostazioni', icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-64 bg-[#181614] text-stone-300 flex flex-col border-r border-stone-800 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800/80">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded border border-[#B8922E] bg-stone-900 flex items-center justify-center text-[#B8922E] font-serif font-bold text-lg">
            B
          </div>
          <div>
            <span className="font-serif font-semibold text-lg text-white tracking-wider block">
              Bella<span className="text-[#DFBD69]">Selecta</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">
              Pannello Redazione
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all text-xs font-medium tracking-wide ${
                isActive
                  ? 'bg-[#B8922E]/15 text-[#DFBD69] font-semibold border-l-2 border-[#B8922E]'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFBD69]' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-stone-800 text-[10px] text-stone-400 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Quick External Link */}
      <div className="p-4 border-t border-stone-800/80 bg-stone-950/40 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/it"
            target="_blank"
            className="flex items-center space-x-1.5 text-stone-400 hover:text-[#DFBD69] transition-colors"
          >
            <span>Vedi Sito Pubblico</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-stone-500 hover:text-rose-400 transition-colors p-1"
            title="Esci"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {user && (
          <div className="text-[11px] text-stone-500 truncate">
            Collegato come: <span className="text-stone-300 font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
