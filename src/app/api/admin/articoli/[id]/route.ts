import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        relatedProducts: { include: { product: true } },
        relatedOffers: { include: { offer: true } },
        relatedBrands: { include: { brand: true } },
        relatedRestaurants: { include: { restaurant: true } },
        relatedDestinations: { include: { destination: true } },
      },
    })

    if (!article) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })

    return NextResponse.json({ article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore' }, { status: 500 })
  }
}
