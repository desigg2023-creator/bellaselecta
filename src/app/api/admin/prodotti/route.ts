import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()
    const slug = (data.slug || data.name_it || 'prodotto')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        name_it: data.name_it,
        name_es: data.name_es || '',
        name_en: data.name_en || '',
        description_it: data.description_it || '',
        image: data.image || '',
        price: parseFloat(data.price) || 0,
        previousPrice: data.previousPrice ? parseFloat(data.previousPrice) : null,
        currency: data.currency || 'EUR',
        brandId: data.brandId || null,
        categoryId: data.categoryId || null,
        affiliateLinkId: data.affiliateLinkId || null,
        externalUrl: data.externalUrl || null,
        isFeatured: Boolean(data.isFeatured),
        status: data.status || 'PUBLISHED',
      },
    })

    return NextResponse.json({ success: true, product })
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

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
