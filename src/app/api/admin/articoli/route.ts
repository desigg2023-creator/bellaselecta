import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()

    // Generate slug from title_it if not provided
    const baseSlug = (data.slug || data.title_it || 'articolo')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Ensure unique slug
    let finalSlug = baseSlug
    let counter = 1
    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    const article = await prisma.article.create({
      data: {
        slug: finalSlug,
        categoryId: data.categoryId,
        status: data.status || 'DRAFT',
        isFeatured: Boolean(data.isFeatured),
        coverImage: data.coverImage,
        title_it: data.title_it || '',
        title_es: data.title_es || '',
        title_en: data.title_en || '',
        subtitle_it: data.subtitle_it || '',
        subtitle_es: data.subtitle_es || '',
        subtitle_en: data.subtitle_en || '',
        content_it: data.content_it || '',
        content_es: data.content_es || '',
        content_en: data.content_en || '',
        tags: data.tags || '',
        seoTitle_it: data.seoTitle_it || '',
        seoDescription_it: data.seoDescription_it || '',
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore creazione articolo' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })

    const publishedAt =
      updateData.status === 'PUBLISHED' && existing.status !== 'PUBLISHED'
        ? new Date()
        : existing.publishedAt

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        publishedAt,
      },
    })

    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore aggiornamento articolo' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

  try {
    await prisma.article.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore cancellazione articolo' }, { status: 500 })
  }
}
