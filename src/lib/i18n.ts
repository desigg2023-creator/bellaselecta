export type Locale = 'it' | 'es' | 'en'

export const defaultLocale: Locale = 'it'
export const locales: Locale[] = ['it', 'es', 'en']

export const languageNames: Record<Locale, { name: string; flag: string }> = {
  it: { name: 'Italiano', flag: '🇮🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
}

export function getLocalized<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  locale: Locale = defaultLocale
): string {
  if (!item) return ''

  const localizedKey = `${field}_${locale}`
  if (item[localizedKey] && typeof item[localizedKey] === 'string' && item[localizedKey].trim() !== '') {
    return item[localizedKey]
  }

  // Fallback to Italian (primary language)
  const itKey = `${field}_it`
  if (item[itKey] && typeof item[itKey] === 'string') {
    return item[itKey]
  }

  // Fallback to standard field name
  if (item[field] && typeof item[field] === 'string') {
    return item[field]
  }

  return ''
}

export const uiTranslations: Record<Locale, Record<string, string>> = {
  it: {
    siteTagline: "L'arte della scoperta: selezione editoriale di eccellenze italiane",
    navHome: 'Home',
    navDiscover: 'Scopri',
    navOffers: 'Offerte',
    navCategories: 'Categorie',
    searchPlaceholder: 'Cerca articoli, luoghi, prodotti, marchi...',
    searchButton: 'Cerca',
    readArticle: 'Leggi la selezione',
    featuredBadge: 'In Evidenza',
    latestArticles: 'Ultimi Articoli',
    latestSubtitle: 'Le scoperte e le storie più recenti curate dalla redazione',
    curatedSelection: 'Selezione Editoriale',
    curatedSubtitle: 'Esperienze, oggetti e luoghi imperdibili scelti per voi',
    curatedOffers: 'Offerte Selezionate',
    offersSubtitle: 'Privilegi esclusivi e promozioni verificate dei nostri partner',
    viewOffer: 'Scopri Offerta',
    viewProduct: 'Scopri Prodotto',
    viewDetails: 'Dettagli',
    promoCode: 'Codice promo',
    validUntil: 'Valida fino al',
    discount: 'Sconto',
    relatedProducts: 'Prodotti Correlati',
    relatedOffers: 'Offerte & Privilegi Correlati',
    relatedPlaces: 'Luoghi & Hotel Correlati',
    relatedDining: 'Ristoranti & Gastronomia Correlata',
    relatedBrands: 'Marchi Consigliati',
    newsletterTitle: 'Il Club di BellaSelecta',
    newsletterSubtitle: 'Ricevi ogni settimana una selezione riservata di perle rare, aperture esclusive e vantaggi dedicati.',
    newsletterPlaceholder: 'Il tuo indirizzo email...',
    newsletterButton: 'Iscriviti alla Selezione',
    footerAbout: 'BellaSelecta è una destinazione digitale indipendente di scoperta e lifestyle d’eccellenza. Ogni contenuto, prodotto e luogo è selezionato con cura editoriale.',
    footerLegal: 'Tutti i diritti riservati.',
    footerAdmin: 'Area Riservata Redazione',
    backToHome: 'Torna alla Home',
    noResults: 'Nessun risultato trovato.',
    allCategories: 'Tutte le Categorie',
    share: 'Condividi',
    publishedOn: 'Pubblicato il',
    readingTime: 'min di lettura',
    verifiedSelection: 'Selezione Verificata',
    partnerContent: 'In collaborazione con partner',
  },
  es: {
    siteTagline: 'El arte del descubrimiento: selección editorial de excelencias y lifestyle',
    navHome: 'Inicio',
    navDiscover: 'Descubre',
    navOffers: 'Ofertas',
    navCategories: 'Categorías',
    searchPlaceholder: 'Buscar artículos, lugares, productos, marcas...',
    searchButton: 'Buscar',
    readArticle: 'Leer selección',
    featuredBadge: 'Destacado',
    latestArticles: 'Últimos Artículos',
    latestSubtitle: 'Los descubrimientos y reportajes más recientes de nuestra redacción',
    curatedSelection: 'Selección Editorial',
    curatedSubtitle: 'Experiencias, objetos y destinos selectos para inspirarte',
    curatedOffers: 'Ofertas Seleccionadas',
    offersSubtitle: 'Privilegios exclusivos y promociones verificadas de colaboradores',
    viewOffer: 'Ver Oferta',
    viewProduct: 'Ver Producto',
    viewDetails: 'Detalles',
    promoCode: 'Código promo',
    validUntil: 'Válido hasta',
    discount: 'Descuento',
    relatedProducts: 'Productos Relacionados',
    relatedOffers: 'Ofertas y Privilegios Relacionados',
    relatedPlaces: 'Lugares y Hoteles Relacionados',
    relatedDining: 'Restaurantes y Gastronomía Relacionada',
    relatedBrands: 'Marcas Recomendadas',
    newsletterTitle: 'El Club BellaSelecta',
    newsletterSubtitle: 'Recibe cada semana una cuidada selección de joyas ocultas, novedades exclusivas y privilegios especiales.',
    newsletterPlaceholder: 'Tu correo electrónico...',
    newsletterButton: 'Unirse a la Selección',
    footerAbout: 'BellaSelecta es una plataforma digital de descubrimiento y estilo de vida distinguido. Cada recomendación responde a un estricto criterio editorial.',
    footerLegal: 'Todos los derechos reservados.',
    footerAdmin: 'Área Privada de Redacción',
    backToHome: 'Volver al Inicio',
    noResults: 'No se encontraron resultados.',
    allCategories: 'Todas las Categorías',
    share: 'Compartir',
    publishedOn: 'Publicado el',
    readingTime: 'min de lectura',
    verifiedSelection: 'Selección Verificada',
    partnerContent: 'En colaboración con colaboradores',
  },
  en: {
    siteTagline: 'The art of curated discovery: fine Italian places, tastes, and living',
    navHome: 'Home',
    navDiscover: 'Discover',
    navOffers: 'Curated Offers',
    navCategories: 'Categories',
    searchPlaceholder: 'Search stories, places, products, brands...',
    searchButton: 'Search',
    readArticle: 'Read Story',
    featuredBadge: 'Featured',
    latestArticles: 'Latest Stories',
    latestSubtitle: 'The newest discoveries and editorial features from our editors',
    curatedSelection: 'Editorial Selection',
    curatedSubtitle: 'Handpicked experiences, design objects, and Italian escapes',
    curatedOffers: 'Curated Privileges & Offers',
    offersSubtitle: 'Exclusive reader perks and verified promotions from partners',
    viewOffer: 'View Offer',
    viewProduct: 'View Product',
    viewDetails: 'Details',
    promoCode: 'Promo code',
    validUntil: 'Valid until',
    discount: 'Discount',
    relatedProducts: 'Related Products',
    relatedOffers: 'Related Offers & Perks',
    relatedPlaces: 'Featured Stays & Places',
    relatedDining: 'Curated Dining & Flavors',
    relatedBrands: 'Featured Brands',
    newsletterTitle: 'The BellaSelecta Club',
    newsletterSubtitle: 'Receive a weekly curation of rare gems, private openings, and discerning travel inspiration.',
    newsletterPlaceholder: 'Your email address...',
    newsletterButton: 'Join the Curation',
    footerAbout: 'BellaSelecta is an independent digital discovery and lifestyle magazine. Every recommendation is meticulously chosen with editorial care.',
    footerLegal: 'All rights reserved.',
    footerAdmin: 'Editorial Admin Area',
    backToHome: 'Back to Home',
    noResults: 'No results found.',
    allCategories: 'All Categories',
    share: 'Share',
    publishedOn: 'Published on',
    readingTime: 'min read',
    verifiedSelection: 'Verified Selection',
    partnerContent: 'In partnership with verified brands',
  },
}
