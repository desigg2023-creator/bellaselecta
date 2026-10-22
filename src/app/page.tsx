import React from 'react'
import LocaleLayout, { generateMetadata as getLocaleMetadata } from './[locale]/layout'
import HomePage from './[locale]/page'

export async function generateMetadata() {
  return getLocaleMetadata({ params: { locale: 'it' } })
}

export default async function RootPage() {
  return (
    <LocaleLayout params={{ locale: 'it' }}>
      <HomePage params={{ locale: 'it' }} />
    </LocaleLayout>
  )
}
