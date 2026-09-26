import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()
    const slug = (data.slug || data.title_it || 'offerta')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')

    const offer = await prisma.offer.create({
      data: {
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        title_it: data.title_it,
        title_es: data.title_es || '',
        title_en: data.title_en || '',
        description_it: data.description_it || '',
        image: data.image || '',
        previousPrice: data.previousPrice ? parseFloat(data.previousPrice) : null,
        offerPrice: data.offerPrice ? parseFloat(data.offerPrice) : null,
        discountPercentage: data.discountPercentage ? parseInt(data.discountPercentage) : null,
        promoCode: data.promoCode || null,
        brandId: data.brandId || null,
        categoryId: data.categoryId || null,
        affiliateLinkId: data.affiliateLinkId || null,
        isFeatured: Boolean(data.isFeatured),
        status: data.status || 'ACTIVE',
        conditions_it: data.conditions_it || '',
      },
    })

    return NextResponse.json({ success: true, offer })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

  await prisma.offer.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
