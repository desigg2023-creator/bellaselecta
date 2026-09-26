import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniziando il seeding di BellaSelecta ---')

  // 1. Amministratore predefinito
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
  console.log('✓ Utente Amministratore creato:', adminUser.email)

  // 2. Impostazioni Sito (SiteSettings)
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'BellaSelecta',
      siteTagline_it: "L'arte della scoperta: selezione editoriale di eccellenze, luoghi, sapori e stile di vita italiano.",
      siteTagline_es: 'El arte del descubrimiento: selección editorial de excelencias, lugares, sabores y estilo de vida.',
      siteTagline_en: 'The art of discovery: curated excellence in Italian places, flavors, products, and lifestyle.',
      contactEmail: 'contact@bellaselecta.it',
      instagramUrl: 'https://instagram.com/bellaselecta',
      facebookUrl: 'https://facebook.com/bellaselecta',
      pinterestUrl: 'https://pinterest.com/bellaselecta',
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
  console.log('✓ Impostazioni generali inizializzate')

  // 3. Impostazioni IA (DISATTIVATA PER DEFAULT)
  await prisma.aISettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      isEnabled: false, // RIGOROSAMENTE DISATTIVATA
      provider: 'OPENAI',
      model: 'gpt-4o',
      connectionStatus: 'DISABLED',
      canPublish: false,
      canDelete: false,
      canModifySettings: false,
    },
  })
  console.log('✓ Impostazioni IA create (stato: DISATTIVATA)')

  // 4. Categorie Principali (Modificabili da pannello, mai hardcoded)
  const categoriesData = [
    {
      slug: 'moda',
      icon: 'Sparkles',
      sortOrder: 1,
      name_it: 'Moda',
      name_es: 'Moda',
      name_en: 'Fashion',
      description_it: "Sartorialità, maestria artigianale e tendenze contemporanee del design italiano.",
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
      description_en: 'Harmony between mind and body, thermal retreats, yoga, and mindful movement.',
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'viaggi',
      icon: 'Compass',
      sortOrder: 4,
      name_it: 'Viaggi',
      name_es: 'Viajes',
      name_en: 'Travel',
      description_it: 'Itinerari fuori dal comune, borghi segreti, dimore storiche e coste d’incanto.',
      description_es: 'Itinerarios exclusivos, pueblos con encanto, residencias históricas y costas idílicas.',
      description_en: 'Extraordinary itineraries, secret hamlets, historic estates, and enchanting coasts.',
      coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'ristoranti-gastronomia',
      icon: 'Utensils',
      sortOrder: 5,
      name_it: 'Ristoranti & Gastronomia',
      name_es: 'Restaurantes y Gastronomía',
      name_en: 'Dining & Gastronomy',
      description_it: 'Tavole d’autore, antiche osterie, cantine vinicole e sapori d’eccellenza.',
      description_es: 'Mesas de autor, antiguas tabernas, bodegas vinícolas y sabores sublimes.',
      description_en: 'Signature dining, heritage trattorias, wine estates, and culinary craft.',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'casa-lifestyle',
      icon: 'Home',
      sortOrder: 6,
      name_it: 'Casa & Lifestyle',
      name_es: 'Hogar y Estilo de Vida',
      name_en: 'Home & Living',
      description_it: 'Oggetti del desiderio, design d’interni, ceramiche e atmosfere accoglienti.',
      description_es: 'Objetos de deseo, diseño de interiores, cerámicas y atmósferas acogedoras.',
      description_en: 'Objects of desire, interior design, handcrafted ceramics, and warm atmospheres.',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'scopri',
      icon: 'Search',
      sortOrder: 7,
      name_it: 'Scopri',
      name_es: 'Descubre',
      name_en: 'Discover',
      description_it: 'Novedades, perle nascoste, ispirazioni inedite ed esperienze selezionate.',
      description_es: 'Novedades, joyas ocultas, inspiraciones inéditas y experiencias únicas.',
      description_en: 'Novelties, hidden gems, fresh inspirations, and curated discoveries.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      slug: 'offerte',
      icon: 'Tag',
      sortOrder: 8,
      name_it: 'Offerte',
      name_es: 'Ofertas',
      name_en: 'Curated Offers',
      description_it: 'Opportunità esclusive, promozioni limitate e vantaggi riservati ai nostri lettori.',
      description_es: 'Oportunidades exclusivas, promociones limitadas y ventajas reservadas.',
      description_en: 'Exclusive privileges, seasonal promotions, and curated reader benefits.',
      coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  const categories: Record<string, any> = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    categories[cat.slug] = created
  }
  console.log(`✓ ${categoriesData.length} Categorie create con successo`)

  // 5. Marchi Selezionati (Brands)
  const brandAcquaDiParma = await prisma.brand.upsert({
    where: { slug: 'acqua-di-parma' },
    update: {},
    create: {
      slug: 'acqua-di-parma',
      name: 'Acqua di Parma',
      logo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop',
      description_it: "Simbolo storico dell'arte profumiera italiana, connubio di maestria, luce e raffinatezza mediterranea.",
      description_es: 'Símbolo histórico del arte perfumista italiano, fusión de artesanía, luz y sofisticación mediterránea.',
      description_en: 'Historic symbol of Italian perfumery, blending artisanal mastery, Mediterranean light and refinement.',
      website: 'https://www.acquadiparma.com',
      categoryId: categories['bellezza'].id,
      location: 'Milano, Italia',
      isPartner: true,
    },
  })

  const brandLoroPiana = await prisma.brand.upsert({
    where: { slug: 'loro-piana' },
    update: {},
    create: {
      slug: 'loro-piana',
      name: 'Loro Piana',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
      description_it: "L'eccellenza assoluta nel cashmere e nelle fibre tessili più pregiate al mondo.",
      description_es: 'La excelencia absoluta en cachemira y fibras textiles más selectas del mundo.',
      description_en: 'Ultimate excellence in cashmere and the world’s most precious noble fibers.',
      website: 'https://www.loropiana.com',
      categoryId: categories['moda'].id,
      location: 'Quarona, Piemonte',
      isPartner: false,
    },
  })
  console.log('✓ Marchi registrati nel database')

  // 6. Link di Affiliazione
  const affiliateBooking = await prisma.affiliateLink.create({
    data: {
      label: 'Booking.com - Hotel Castello Banfi',
      normalUrl: 'https://www.booking.com/hotel/it/castello-banfi-il-borgo.html',
      affiliateUrl: 'https://www.booking.com/hotel/it/castello-banfi-il-borgo.html?aid=bellaselecta2026',
      provider: 'Booking.com',
      trackingId: 'bellaselecta2026',
      isAffiliate: true,
      status: 'ACTIVE',
    },
  })

  const affiliateAcqua = await prisma.affiliateLink.create({
    data: {
      label: 'Acqua di Parma - Colonia Futura',
      normalUrl: 'https://www.acquadiparma.com/colonia-futura',
      affiliateUrl: 'https://www.acquadiparma.com/colonia-futura?ref=bellaselecta',
      provider: 'AcquaDiParma Partner',
      trackingId: 'ref_bs_01',
      isAffiliate: true,
      status: 'ACTIVE',
    },
  })

  // 7. Prodotti
  const productColonia = await prisma.product.upsert({
    where: { slug: 'colonia-futura-acqua-di-parma' },
    update: {},
    create: {
      slug: 'colonia-futura-acqua-di-parma',
      name_it: 'Colonia Futura Eau de Cologne',
      name_es: 'Colonia Futura Agua de Colonia',
      name_en: 'Colonia Futura Eau de Cologne',
      description_it: 'Fragranza emblematica con il 99% di ingredienti di origine naturale. Bergamotto calabrese, salvia sclarea e lavanda.',
      description_es: 'Fragancia emblemática con 99% de ingredientes de origen natural. Bergamota calabresa, salvia y lavanda.',
      description_en: 'Signature scent made with 99% ingredients of natural origin. Calabrian bergamot, clary sage, and lavender.',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      price: 155.0,
      previousPrice: 170.0,
      currency: 'EUR',
      brandId: brandAcquaDiParma.id,
      categoryId: categories['bellezza'].id,
      affiliateLinkId: affiliateAcqua.id,
      status: 'PUBLISHED',
      isFeatured: true,
    },
  })

  // 8. Destinazioni e Ristoranti (Viaggi & Gastronomia)
  const destValDOrcia = await prisma.destination.upsert({
    where: { slug: 'val-dorcia-toscana' },
    update: {},
    create: {
      slug: 'val-dorcia-toscana',
      name_it: "Val d'Orcia, Toscana",
      name_es: "Val d'Orcia, Toscana",
      name_en: "Val d'Orcia, Tuscany",
      region: 'Toscana',
      country: 'Italia',
      description_it: 'Patrimonio UNESCO: colline ondulate, cipressi solitari, borghi medievali e vigneti di Brunello di Montalcino.',
      description_es: 'Patrimonio UNESCO: colinas onduladas, cipreses solitarios, pueblos medievales y viñedos de Brunello.',
      description_en: 'UNESCO World Heritage site: undulating hills, solitary cypresses, medieval villages and Brunello vineyards.',
      coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
    },
  })

  const destMarmore = await prisma.destination.upsert({
    where: { slug: 'cascate-delle-marmore' },
    update: {},
    create: {
      slug: 'cascate-delle-marmore',
      name_it: 'Cascate delle Marmore, Umbria',
      name_es: 'Cascadas de las Marmore, Umbría',
      name_en: 'Marmore Falls, Umbria',
      region: 'Umbria',
      country: 'Italia',
      description_it: 'Tra le cascate più alte d’Europa, capolavoro di ingegneria romana immerso in una natura incontaminata.',
      description_es: 'Entre las cascadas más altas de Europa, prodigio de ingeniería romana inmerso en una naturaleza virgen.',
      description_en: 'Among Europe’s tallest waterfalls, an ancient Roman engineering marvel nestled in untouched wilderness.',
      coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
    },
  })

  const restOsteria = await prisma.restaurant.upsert({
    where: { slug: 'osteria-di-pienza' },
    update: {},
    create: {
      slug: 'osteria-di-pienza',
      name_it: "Osteria Sette di Vino, Pienza",
      name_es: "Osteria Sette di Vino, Pienza",
      name_en: "Osteria Sette di Vino, Pienza",
      type: 'trattoria',
      city: 'Pienza',
      region: 'Toscana',
      address: 'Piazza di Spagna 1, Pienza',
      priceRange: '€€',
      description_it: 'Celebre per i crostoni con pecorino caldo di Pienza, fagioli all’olio nuovo e accoglienza autentica.',
      description_es: 'Célebre por sus tostas con queso pecorino fundido, judías con aceite nuevo y hospitalidad genuina.',
      description_en: 'Famed for warm toasted sourdough with melted Pienza pecorino, fresh olive oil beans, and heartfelt hospitality.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
      destinationId: destValDOrcia.id,
    },
  })

  // 9. Esperienza / Hotel
  const expCastello = await prisma.experience.upsert({
    where: { slug: 'castello-banfi-il-borgo' },
    update: {},
    create: {
      slug: 'castello-banfi-il-borgo',
      title_it: 'Soggiorno al Castello Banfi - Il Borgo',
      title_es: 'Estancia en Castello Banfi - Il Borgo',
      title_en: 'Stay at Castello Banfi - Il Borgo',
      type: 'HOTEL',
      description_it: 'Un castello trecentesco che domina la tenuta vitivinicola di Montalcino, con piscina panoramica e cantina storica.',
      description_es: 'Un castillo del siglo XIV con vistas a los viñedos de Montalcino, piscina panorámica y bodega histórica.',
      description_en: 'A 14th-century castle presiding over the Montalcino wine estate, boasting a panoramic pool and historic cellars.',
      location: 'Montalcino, Val d’Orcia',
      destinationId: destValDOrcia.id,
      price: 650.0,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      bookingLink: affiliateBooking.affiliateUrl,
      affiliateLinkId: affiliateBooking.id,
    },
  })

  // 10. Offerta Curata
  const offerBanfi = await prisma.offer.upsert({
    where: { slug: 'fuga-romantica-toscana' },
    update: {},
    create: {
      slug: 'fuga-romantica-toscana',
      title_it: "Esperienza Gourmet & Notte in Borgo Toscano (-20%)",
      title_es: 'Experiencia Gourmet y Noche en Borgo Toscano (-20%)',
      title_en: 'Gourmet Experience & Night in a Tuscan Estate (-20%)',
      description_it: 'Include degustazione di Brunello di Montalcino, cena stellata per due persone e prima colazione panoramica.',
      description_es: 'Incluye cata de vinos Brunello, cena de autor para dos personas y desayuno panorámico.',
      description_en: 'Includes Brunello wine tasting, candlelit dinner for two, and panoramic artisan breakfast.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
      previousPrice: 850.0,
      offerPrice: 680.0,
      discountPercentage: 20,
      promoCode: 'BELLASELECTA20',
      currency: 'EUR',
      isFeatured: true,
      status: 'ACTIVE',
      categoryId: categories['offerte'].id,
      affiliateLinkId: affiliateBooking.id,
      conditions_it: 'Offerta valida per prenotazioni fino al 31 dicembre 2026. Soggetta a disponibilità.',
      conditions_es: 'Oferta válida para reservas hasta el 31 de diciembre de 2026. Sujeta a disponibilidad.',
      conditions_en: 'Offer valid for stays booked before December 31, 2026. Subject to availability.',
    },
  })

  // 11. Articoli Principali (con relazioni complete)
  const articleMarmore = await prisma.article.upsert({
    where: { slug: 'cascate-delle-marmore-guida-completa' },
    update: {},
    create: {
      slug: 'cascate-delle-marmore-guida-completa',
      categoryId: categories['viaggi'].id,
      status: 'PUBLISHED',
      isFeatured: true, // Articolo in primo piano
      publishedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop',
      title_it: 'Cascate delle Marmore: cosa vedere, orari e come organizzare una visita perfetta',
      title_es: 'Cascadas de las Marmore: qué ver, horarios y cómo organizar la visita perfecta',
      title_en: 'Marmore Falls: what to see, timings, and how to plan an unforgettable visit',
      subtitle_it: 'Un viaggio sensoriale nel cuore verde dell’Umbria tra sentieri panoramici, salti d’acqua spettacolari e borghi medievali.',
      subtitle_es: 'Un viaje sensorial por el corazón verde de Umbría entre senderos panorámicos y cascadas espectaculares.',
      subtitle_en: 'A sensory journey through the green heart of Umbria amidst panoramic paths and majestic cascades.',
      content_it: `
<p class="lead">Nel cuore rigoglioso della Valnerina, a pochi minuti da Terni, si cela uno dei monumenti naturali e ingegneristici più affascinanti d'Europa: le <strong>Cascate delle Marmore</strong>. Un dislivello complessivo di 165 metri suddiviso in tre spettacolari salti, scolpito dall'uomo nel 271 a.C. per volontà del console romano Curio Dentato.</p>

<h2>I Sentieri Più Emozionanti</h2>
<p>L'area del parco offre sei itinerari escursionistici curati, adatti a ogni ritmo:</p>
<ul>
  <li><strong>Sentiero 1 (Antico Passaggio):</strong> Il più iconico. Conduce dal Belvedere Inferiore al Belvedere Superiore offrendo scorci mozzafiato sul primo salto d'acqua.</li>
  <li><strong>Il Balcone degli Innamorati:</strong> Un tunnel scavato nel travertino che porta a pochi centimetri dal velo d'acqua della prima cascata (impermeabile consigliato!).</li>
  <li><strong>Sentiero 2 (L'Anello dell'Arcobaleno):</strong> Ideale per catturare la magia degli arcobaleni che si formano con la nube d'acqua nebulizzata nelle giornate di sole.</li>
</ul>

<h2>Consigli di Viaggio & Selezione BellaSelecta</h2>
<p>Per vivere l'esperienza al meglio, vi consigliamo di verificare l'orario di apertura delle acque, che varia a seconda delle stagioni e dei giorni festivi. Nei dintorni, non mancate una sosta nei piccoli borghi di Piediluco e Ferentillo, dove la cucina umbra celebra il tartufo nero e i salumi artigianali.</p>
      `,
      content_es: `
<p class="lead">En el corazón exuberante de la Valnerina, a pocos minutos de Terni, se alza uno de los monumentos naturales más fascinantes de Europa: las <strong>Cascadas de las Marmore</strong>. Con un desnivel total de 165 metros dividido en tres saltos espectaculares, fue ideada en el 271 a.C. por el cónsul romano Curio Dentato.</p>
<h2>Senderos y Experiencias</h2>
<p>El parque cuenta con senderos panorámicos, entre ellos el famoso <em>Balcone degli Innamorati</em>. Una visita imprescindible para los amantes de la naturaleza y la fotografía.</p>
      `,
      content_en: `
<p class="lead">Nestled in the lush Valnerina valley, the <strong>Marmore Falls</strong> stand as one of Europe’s most breathtaking scenic spectacles. Boasting a cumulative plunge of 165 meters across three cascades, this ancient Roman masterwork unites history, mist, and pristine greenery.</p>
      `,
      tags: 'viaggi, umbria, natura, cascate, weekend',
      seoTitle_it: 'Cascate delle Marmore: Guida Esclusiva | BellaSelecta Viaggi',
      seoDescription_it: 'Scopri orari, sentieri e segreti per visitare le Cascate delle Marmore in Umbria con la selezione editoriale di BellaSelecta.',
    },
  })

  const articleToscana = await prisma.article.upsert({
    where: { slug: 'un-weekend-in-val-dorcia' },
    update: {},
    create: {
      slug: 'un-weekend-in-val-dorcia',
      categoryId: categories['viaggi'].id,
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(Date.now() - 86400000), // ieri
      coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
      title_it: "Un weekend in Val d'Orcia: dimore storiche, cantine d'autore e silenzi dorati",
      title_es: "Un fin de semana en Val d'Orcia: residencias históricas y silencios dorados",
      title_en: "A Weekend in Val d'Orcia: Historic Estates, Fine Cellars, and Golden Vistas",
      subtitle_it: "L'itinerario perfetto tra Pienza, San Quirico e Montalcino per rigenerare corpo e spirito.",
      subtitle_es: 'El itinerario perfecto entre Pienza y Montalcino para reconectar con la belleza.',
      subtitle_en: 'The idyllic escape across Pienza, San Quirico, and Montalcino.',
      content_it: `
<p class="lead">Ci sono luoghi in cui il paesaggio trascende la geografia per farsi poesia visiva. La Val d'Orcia è il manifesto del Rinascimento italiano all'aria aperta.</p>
<p>Dalle colline ondulate punteggiate da cappelle solitarie alle cantine dove riposa il Brunello, ecco la nostra selezione per un fine settimana indimenticabile.</p>
      `,
      tags: 'toscana, valdorcia, vino, relax, charme',
      seoTitle_it: "Val d'Orcia: Itinerario Weekend d'Élite | BellaSelecta",
      seoDescription_it: "Guida editoriale per un weekend perfetto in Val d'Orcia: dove dormire, mangiare e degustare.",
    },
  })

  const articleProfumo = await prisma.article.upsert({
    where: { slug: 'nuovo-profumo-da-scoprire-note-mediterranee' },
    update: {},
    create: {
      slug: 'nuovo-profumo-da-scoprire-note-mediterranee',
      categoryId: categories['bellezza'].id,
      status: 'PUBLISHED',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 172800000), // 2 giorni fa
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop',
      title_it: "Un nuovo profumo da scoprire: l'essenza della macchia mediterranea",
      title_es: 'Un nuevo perfume por descubrir: la esencia del Mediterráneo',
      title_en: 'A New Fragrance to Discover: The Essence of the Mediterranean Coast',
      subtitle_it: 'Agrumi baciati dal sole, brezze saline e tocchi aromatici: le creazioni olfattive di stagione.',
      subtitle_es: 'Cítricos dorados por el sol y brisas marinas: las joyas olfativas de la temporada.',
      subtitle_en: 'Sun-drenched citrus, maritime breezes, and herbal undertones.',
      content_it: `
<p class="lead">La profumeria artistica italiana riscopre le materie prime sostenibili del nostro territorio: dal bergamotto calabrese al mirto di Sardegna.</p>
      `,
      tags: 'bellezza, profumi, cosmesi, estate',
    },
  })

  // 12. Collegamento Relazioni
  await prisma.articleDestination.createMany({
    data: [
      { articleId: articleMarmore.id, destinationId: destMarmore.id },
      { articleId: articleToscana.id, destinationId: destValDOrcia.id },
    ],
  })

  await prisma.articleRestaurant.createMany({
    data: [
      { articleId: articleToscana.id, restaurantId: restOsteria.id },
    ],
  })

  await prisma.articleExperience.createMany({
    data: [
      { articleId: articleToscana.id, experienceId: expCastello.id },
    ],
  })

  await prisma.articleOffer.createMany({
    data: [
      { articleId: articleToscana.id, offerId: offerBanfi.id },
    ],
  })

  await prisma.articleProduct.createMany({
    data: [
      { articleId: articleProfumo.id, productId: productColonia.id },
    ],
  })

  await prisma.articleBrand.createMany({
    data: [
      { articleId: articleProfumo.id, brandId: brandAcquaDiParma.id },
    ],
  })

  // Imposta articolo in evidenza nella configurazione globale
  await prisma.siteSettings.update({
    where: { id: 'singleton' },
    data: {
      featuredArticleId: articleMarmore.id,
    },
  })

  console.log('✓ Relazioni articoli ↔ destinazioni ↔ ristoranti ↔ offerte create!')
  console.log('--- Seeding completato con successo! ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
