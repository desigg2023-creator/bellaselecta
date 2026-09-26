import { NextResponse } from 'next/server'
import { testAIConnection } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { apiKey, provider, isEnabled } = await request.json()

    // If updating config:
    if (typeof isEnabled === 'boolean') {
      await prisma.aISettings.update({
        where: { id: 'singleton' },
        data: {
          isEnabled,
          provider: provider || 'OPENAI',
          apiKey: apiKey && !apiKey.includes('...') ? apiKey : undefined,
        },
      })
    }

    const result = await testAIConnection(apiKey && !apiKey.includes('...') ? apiKey : undefined, provider)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', message: error.message || 'Errore nella verifica' }, { status: 500 })
  }
}
