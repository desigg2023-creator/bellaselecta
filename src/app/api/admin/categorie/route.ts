import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()
    const slug = data.slug || data.name_it.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const category = await prisma.category.create({
      data: {
        slug,
        name_it: data.name_it,
        name_es: data.name_es || '',
        name_en: data.name_en || '',
        description_it: data.description_it || '',
        description_es: data.description_es || '',
        description_en: data.description_en || '',
        coverImage: data.coverImage || '',
        isActive: data.isActive ?? true,
        showOnHomepage: data.showOnHomepage ?? true,
        showInMenu: data.showInMenu ?? true,
        sortOrder: Number(data.sortOrder) || 0,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore creazione categoria' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore aggiornamento categoria' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

  try {
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore cancellazione categoria' }, { status: 500 })
  }
}
