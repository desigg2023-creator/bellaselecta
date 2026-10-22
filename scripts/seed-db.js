const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('--- Seeding BellaSelecta DB ---')

  // 1. Admin user
  const adminPasswordHash = await bcrypt.hash('BellaSelecta2026!', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bellaselecta.it' },
    update: {},
    create: {
      email: 'admin@bellaselecta.it',
      name: 'Direzione Editoriale',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })
  console.log('✓ Admin user ready:', adminUser.email)

  // 2. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'BellaSelecta',
      siteTagline_it: "L'arte della scoperta: selezione editoriale di eccellenze, luoghi, sapori e stile di vida italiano.",
      siteTagline_es: 'El arte del descubrimiento: selección editorial de excelencias, lugares, sabores y estilo de vida.',
      siteTagline_en: 'The art of discovery: curated excellence in Italian places, flavors, products, and lifestyle.',
      contactEmail: 'contact@bellaselecta.it',
      defaultMetaTitle_it: "BellaSelecta | Selezione d'Eccellenza & Lifestyle Italiano",
      defaultMetaDescription_it: 'Piattaforma editoriale di scoperta: viaggi esclusivi, gastronomia raffinata, moda, bellezza, benessere e offerte selezionate.',
      defaultMetaTitle_es: 'BellaSelecta | Selección de Excelencia y Estilo de Vida Italiano',
      defaultMetaDescription_es: 'Plataforma editorial de descubrimiento: viajes exclusivos, gastronomía refinada, moda, belleza y bienestar.',
      defaultMetaTitle_en: 'BellaSelecta | Curated Italian Discovery & Lifestyle',
      defaultMetaDescription_en: 'Editorial discovery platform: exclusive travels, refined dining, fashion, beauty, wellness, and curated offers.',
      showLatestArticles: true,
      showFeaturedSection: true,
    },
  })
  console.log('✓ SiteSettings ready')

  // 3. AISettings
  await prisma.aISettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      isEnabled: false,
      provider: 'OPENAI',
      model: 'gpt-4o',
      connectionStatus: 'DISABLED',
      canPublish: false,
      canDelete: false,
      canModifySettings: false,
    },
  })
  console.log('✓ AISettings ready')

  // 4. Initial Categories
  const categories = [
    {
      slug: 'moda',
      icon: 'Sparkles',
      sortOrder: 1,
      name_it: 'Moda',
      name_es: 'Moda',
      name_en: 'Fashion',
      description_it: 'Sartorialità, maestria artigianale e tendenze contemporanee del design italiano.',
      description_es: 'Sastrería, artesanía y tendencias contemporáneas del diseño italiano.',
      description_en: 'Tailoring, craftsmanship and contemporary Italian design trends.',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'bellezza',
      icon: 'Heart',
      sortOrder: 2,
      name_it: 'Bellezza',
      name_es: 'Belleza',
      name_en: 'Beauty',
      description_it: 'Rituali di cura, profumi d’autore, cosmesi botanica e trattamenti rigeneranti.',
      description_es: 'Rituales de cuidado, perfumes de autor, cosmética botánica y tratamientos.',
      description_en: 'Care rituals, niche fragrances, botanical cosmetics, and rejuvenating treatments.',
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'fitness-benessere',
      icon: 'Activity',
      sortOrder: 3,
      name_it: 'Fitness & Benessere',
      name_es: 'Fitness y Bienestar',
      name_en: 'Fitness & Wellness',
      description_it: 'Armonia tra mente e corpo, percorsi termali, yoga e movimento consapevole.',
      description_es: 'Armonía entre mente y cuerpo, retiros termales, yoga y movimiento consciente.',
      description_en: 'Harmony between mind and body, thermal paths, yoga and mindful movement.',
      coverImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'gastronomia',
      icon: 'Utensils',
      sortOrder: 4,
      name_it: 'Gastronomia',
      name_es: 'Gastronomía',
      name_en: 'Gastronomy',
      description_it: 'Esperienze culinarie memorabili, materie prime d’eccezione e cantine storiche.',
      description_es: 'Experiencias culinarias memorables, materias primas de excepción y bodegas históricas.',
      description_en: 'Memorable culinary experiences, exceptional ingredients, and historical wineries.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'viaggi',
      icon: 'Compass',
      sortOrder: 5,
      name_it: 'Viaggi',
      name_es: 'Viajes',
      name_en: 'Travel',
      description_it: 'Itinerari insoliti, dimore di charme e angoli segreti d’Italia.',
      description_es: 'Itinerarios insólitos, residencias con encanto y rincones secretos de Italia.',
      description_en: 'Unusual itineraries, charming boutique stays, and secret corners of Italy.',
      coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    },
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
        description_it: cat.description_it,
        description_es: cat.description_es,
        description_en: cat.description_en,
        coverImage: cat.coverImage,
      },
    })
  }
  console.log('✓ Categories ready')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
