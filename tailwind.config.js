/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BellaSelecta — Palette Editoriale Premium
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF0E4',
          300: '#F5E6D0',
          400: '#EDD5B3',
          500: '#E5C496',
        },
        gold: {
          50: '#FDF8EF',
          100: '#FAF0D7',
          200: '#F5DEAF',
          300: '#EDCA7D',
          400: '#D4A844',
          500: '#B8922E',
          600: '#9A7A24',
          700: '#7C621D',
          800: '#654F18',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#3D3D3D',
          700: '#2D2D2D',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subtitle': ['1.25rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'section': '5rem',
        'section-sm': '3rem',
      },
      maxWidth: {
        'content': '75rem', // 1200px
        'narrow': '48rem',  // 768px
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1)',
        'elevated': '0 12px 32px rgba(0,0,0,0.12)',
      },
      transitionDuration: {
        'card': '300ms',
      },
    },
  },
  plugins: [],
}
