'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@bellaselecta.it')
  const [password, setPassword] = useState('BellaSelecta2026!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Accesso non riuscito')
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141210] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#1C1A17] border border-stone-800 rounded-xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded border border-[#B8922E] bg-stone-900 mx-auto flex items-center justify-center text-[#B8922E] font-serif font-bold text-2xl shadow-inner">
            B
          </div>
          <h1 className="font-serif text-2xl font-semibold text-white tracking-wider">
            Bella<span className="text-[#DFBD69]">Selecta</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Accesso Riservato Redazione
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/50 border border-rose-800/80 rounded-lg p-3 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Email Amministratore
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141210] border border-stone-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-stone-200 focus:outline-none focus:border-[#B8922E]"
                placeholder="admin@bellaselecta.it"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141210] border border-stone-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-stone-200 focus:outline-none focus:border-[#B8922E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8922E] hover:bg-[#A38025] text-stone-950 font-semibold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md mt-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Accesso in corso...' : 'Accedi al Pannello'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-800">
          <Link
            href="/it"
            className="inline-flex items-center space-x-1.5 text-xs text-stone-400 hover:text-[#DFBD69] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Torna al sito pubblico</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
