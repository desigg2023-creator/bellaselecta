'use client'

import React, { useState } from 'react'
import {
  Bot,
  Power,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  RefreshCw,
  Sliders,
} from 'lucide-react'

export default function AISettingsPanel({ initialSettings }: { initialSettings: any }) {
  const [isEnabled, setIsEnabled] = useState(initialSettings?.isEnabled || false)
  const [provider, setProvider] = useState(initialSettings?.provider || 'OPENAI')
  const [apiKey, setApiKey] = useState(initialSettings?.apiKey ? '••••••••••••••••' : '')
  const [model, setModel] = useState(initialSettings?.model || 'gpt-4o')
  const [status, setStatus] = useState<string>(
    initialSettings?.isEnabled ? initialSettings?.connectionStatus || 'NOT_CHECKED' : 'DISABLED'
  )
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    setTestResult('')

    try {
      const res = await fetch('/api/admin/ia/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.includes('••••') ? undefined : apiKey,
          provider,
          isEnabled,
        }),
      })

      const data = await res.json()
      setStatus(data.status)
      setTestResult(data.message)
    } catch (err: any) {
      setStatus('ERROR')
      setTestResult('Errore nella chiamata di verifica.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/ia/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled,
          provider,
          apiKey: apiKey.includes('••••') ? undefined : apiKey,
        }),
      })
      const data = await res.json()
      setStatus(data.status)
      setTestResult('Configurazione salvata con successo!')
    } catch (err) {
      setTestResult('Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Status Indicator Banner (Visible State) */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
          status === 'DISABLED' || !isEnabled
            ? 'bg-stone-100 border-stone-300 text-stone-700'
            : status === 'ACTIVE'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : status === 'ERROR'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              !isEnabled || status === 'DISABLED'
                ? 'bg-stone-300 text-stone-700'
                : status === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : status === 'ERROR'
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold">
                {!isEnabled || status === 'DISABLED'
                  ? 'IA Disattivata'
                  : status === 'ACTIVE'
                  ? 'Connessione Attiva'
                  : status === 'ERROR'
                  ? 'Errore di Connessione'
                  : 'Connessione Non Verificata'}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${
                  !isEnabled || status === 'DISABLED'
                    ? 'bg-stone-200 text-stone-600'
                    : status === 'ACTIVE'
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-900'
                }`}
              >
                {!isEnabled ? 'OFF' : 'ON'}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {!isEnabled
                ? 'Nessun servizio esterno attivo. Zero costi e zero chiamate API.'
                : testResult || 'Servizio pronto per generare bozze e traduzioni su richiesta.'}
            </p>
          </div>
        </div>

        {/* Button: Comprobar conexión */}
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={loading}
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Verifica in corso...' : 'Comprobar Conexión'}</span>
        </button>
      </div>

      {/* 2. Main Form */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-[#FAF6EE] border border-[#EAE3D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Configurazione Connessione IA
            </h3>
            <p className="text-xs text-stone-500">
              Personalizza il fornitore quando deciderai di abilitare le funzioni assistite.
            </p>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#E5DEC9]">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => {
                setIsEnabled(e.target.checked)
                if (!e.target.checked) setStatus('DISABLED')
              }}
              className="rounded text-[#B8922E]"
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Abilita Servizio IA
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Seleziona Fornitore (Provider)
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={!isEnabled}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900 disabled:bg-stone-100 disabled:text-stone-400"
            >
              <option value="OPENAI">OpenAI (ChatGPT / GPT-4o)</option>
              <option value="ANTHROPIC">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="CUSTOM">Provider Compatibile / Personalizzato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Modello Predefinito
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!isEnabled}
              className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900 disabled:bg-stone-100 disabled:text-stone-400 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
            <span>Chiave Segreta API (API Key)</span>
            <span className="text-[10px] text-stone-400 font-normal flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Crittografata e mai esposta pubblicamente</span>
            </span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={!isEnabled}
            placeholder={isEnabled ? 'sk-...' : 'Abilita il servizio per inserire la chiave'}
            className="w-full bg-white border border-[#E5DEC9] rounded-lg p-2.5 text-xs text-stone-900 disabled:bg-stone-100 disabled:text-stone-400 font-mono"
          />
        </div>

        {/* 3. Strict Permissions Matrix (Requirement 23) */}
        <div className="bg-[#FAF4E6] border border-[#E8DFC8] rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#B8922E]" />
            <span>Politica di Sicurezza & Limiti dei Permessi IA</span>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Per salvaguardare l’integrità editoriale di BellaSelecta, i permessi dell’Intelligenza Artificiale sono rigorosamente limitati per codice:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Può suggerire idee, titoli e bozze</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Può assistere nelle traduzioni in bozza</span>
            </div>
            <div className="flex items-center space-x-2 text-rose-800">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span><strong>VIETATA</strong> la pubblicazione automatica</span>
            </div>
            <div className="flex items-center space-x-2 text-rose-800">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span><strong>VIETATA</strong> la cancellazione di contenuti</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1C1917] hover:bg-[#B8922E] text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva Impostazioni IA'}
          </button>
        </div>
      </form>
    </div>
  )
}
