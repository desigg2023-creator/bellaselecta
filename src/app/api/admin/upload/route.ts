import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const finalFilename = `${uniqueSuffix}-${cleanFilename}`
    const filePath = path.join(uploadsDir, finalFilename)

    await writeFile(filePath, buffer)
    const publicUrl = `/uploads/${finalFilename}`

    // Save to Media table
    const media = await prisma.media.create({
      data: {
        filename: finalFilename,
        originalName: file.name,
        mimeType: file.type || 'image/jpeg',
        size: buffer.length,
        url: publicUrl,
        altText_it: file.name.replace(/\.[^/.]+$/, ''),
      },
    })

    return NextResponse.json({ success: true, url: publicUrl, media })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore nel caricamento del file' }, { status: 500 })
  }
}
