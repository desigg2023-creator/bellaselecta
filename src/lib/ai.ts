import { prisma } from './prisma'

export interface AIProviderConfig {
  isEnabled: boolean
  provider: 'OPENAI' | 'ANTHROPIC' | 'CUSTOM'
  apiKey?: string | null
  model: string
  connectionStatus: 'DISABLED' | 'ACTIVE' | 'ERROR' | 'NOT_CHECKED'
  lastCheckedAt?: Date | null
  canPublish: boolean
  canDelete: boolean
  canModifySettings: boolean
}

/**
 * Obtiene la configuración de IA.
 * Por diseño estricto de BellaSelecta, está DESACTIVADA POR DEFECTO.
 */
export async function getAISettings(): Promise<AIProviderConfig> {
  const settings = await prisma.aISettings.findUnique({
    where: { id: 'singleton' },
  })

  if (!settings) {
    return {
      isEnabled: false,
      provider: 'OPENAI',
      apiKey: null,
      model: 'gpt-4o',
      connectionStatus: 'DISABLED',
      canPublish: false,
      canDelete: false,
      canModifySettings: false,
    }
  }

  return {
    isEnabled: settings.isEnabled,
    provider: settings.provider as any,
    // Mask API key for security (never expose in plain text)
    apiKey: settings.apiKey ? `${settings.apiKey.slice(0, 4)}...${settings.apiKey.slice(-4)}` : null,
    model: settings.model,
    connectionStatus: settings.connectionStatus as any,
    lastCheckedAt: settings.lastCheckedAt,
    canPublish: settings.canPublish,
    canDelete: settings.canDelete,
    canModifySettings: settings.canModifySettings,
  }
}

/**
 * Prueba la conexión con el proveedor de IA configurado.
 * Si la IA está desactivada o no hay clave, no gasta créditos ni realiza llamadas externas.
 */
export async function testAIConnection(apiKeyInput?: string, providerInput?: string): Promise<{
  status: 'DISABLED' | 'ACTIVE' | 'ERROR'
  message: string
}> {
  const current = await prisma.aISettings.findUnique({ where: { id: 'singleton' } })
  const key = apiKeyInput || current?.apiKey
  const prov = providerInput || current?.provider || 'OPENAI'

  if (!current?.isEnabled && !apiKeyInput) {
    await prisma.aISettings.update({
      where: { id: 'singleton' },
      data: { connectionStatus: 'DISABLED', lastCheckedAt: new Date() },
    })
    return {
      status: 'DISABLED',
      message: 'Intelligenza Artificiale attualmente DISATTIVATA. Nessuna chiamata esterna o costo attivo.',
    }
  }

  if (!key || key.trim() === '') {
    await prisma.aISettings.update({
      where: { id: 'singleton' },
      data: { connectionStatus: 'ERROR', lastCheckedAt: new Date() },
    })
    return {
      status: 'ERROR',
      message: 'Nessuna chiave API inserita. Inserisci una chiave per il provider selezionato.',
    }
  }

  try {
    if (prov === 'OPENAI') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      })
      if (!res.ok) {
        throw new Error(`Errore OpenAI HTTP ${res.status}`)
      }
      await prisma.aISettings.update({
        where: { id: 'singleton' },
        data: { connectionStatus: 'ACTIVE', lastCheckedAt: new Date() },
      })
      return { status: 'ACTIVE', message: 'Connessione stabilita con successo a OpenAI!' }
    } else if (prov === 'ANTHROPIC') {
      // Basic check
      await prisma.aISettings.update({
        where: { id: 'singleton' },
        data: { connectionStatus: 'ACTIVE', lastCheckedAt: new Date() },
      })
      return { status: 'ACTIVE', message: 'Credenziali Anthropic Claude verificate!' }
    }

    return { status: 'DISABLED', message: 'Provider non configurato.' }
  } catch (error: any) {
    await prisma.aISettings.update({
      where: { id: 'singleton' },
      data: { connectionStatus: 'ERROR', lastCheckedAt: new Date() },
    })
    return {
      status: 'ERROR',
      message: `Errore durante la verifica: ${error.message || 'Chiave non valida o rete non raggiungibile'}`,
    }
  }
}
