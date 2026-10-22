import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Running prisma db push...')
    // Run prisma db push directly
    const pushOutput = execSync('npx prisma db push --accept-data-loss', {
      encoding: 'utf-8',
      env: process.env,
    })

    const prisma = new PrismaClient()

    // Create or update admin user
    const passwordHash = await bcrypt.hash('Admin1234!', 12)
    const user = await prisma.user.upsert({
      where: { email: 'admin@bellaselecta.it' },
      update: { passwordHash },
      create: {
        email: 'admin@bellaselecta.it',
        name: 'Administrador',
        passwordHash,
        role: 'ADMIN',
      },
    })

    // Create default siteSettings
    await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
        siteName: 'BellaSelecta',
        siteTagline_it: "L'arte della scoperta: selezione editoriale di eccellenze italiane.",
        siteTagline_es: 'El arte del descubrimiento: selección editorial de excelencias y estilo de vida.',
        siteTagline_en: 'The art of discovery: curated Italian excellence.',
        contactEmail: 'admin@bellaselecta.it',
      },
    })

    // Create default categories
    const categories = [
      { slug: 'moda', icon: 'Sparkles', sortOrder: 1, name_it: 'Moda', name_es: 'Moda', name_en: 'Fashion' },
      { slug: 'bellezza', icon: 'Heart', sortOrder: 2, name_it: 'Bellezza', name_es: 'Belleza', name_en: 'Beauty' },
      { slug: 'fitness-benessere', icon: 'Activity', sortOrder: 3, name_it: 'Fitness & Benessere', name_es: 'Fitness y Bienestar', name_en: 'Fitness & Wellness' },
      { slug: 'gastronomia', icon: 'Utensils', sortOrder: 4, name_it: 'Gastronomia', name_es: 'Gastronomía', name_en: 'Gastronomy' },
      { slug: 'viaggi', icon: 'Compass', sortOrder: 5, name_it: 'Viaggi', name_es: 'Viajes', name_en: 'Travel' },
    ]

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          slug: cat.slug,
          icon: cat.icon,
          sortOrder: cat.sortOrder,
          isActive: true,
          name_it: cat.name_it,
          name_es: cat.name_es,
          name_en: cat.name_en,
        },
      })
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Tablas de base de datos creadas y administrador inicializado con éxito!',
      adminEmail: user.email,
      pushOutput,
    })
  } catch (error: any) {
    console.error('setup-db error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
        stderr: error.stderr ? error.stderr.toString() : null,
      },
      { status: 500 }
    )
  }
}
