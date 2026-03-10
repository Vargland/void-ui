import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import '@open-void-ui/tokens/css'
import '@open-void-ui/tokens/planets/mercury'
import '@open-void-ui/tokens/planets/venus'
import '@open-void-ui/tokens/planets/earth'
import '@open-void-ui/tokens/planets/mars'
import '@open-void-ui/tokens/planets/jupiter'
import '@open-void-ui/tokens/planets/saturn'
import '@open-void-ui/tokens/planets/uranus'
import '@open-void-ui/tokens/planets/neptune'
import '@open-void-ui/tokens/planets/moon'
import '@open-void-ui/tokens/planets/europa'
import '@open-void-ui/tokens/planets/io'
import '@open-void-ui/tokens/planets/nostromo'
import '@open-void-ui/library/styles'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'open-void-ui',
    template: '%s — open-void-ui',
  },
  description:
    'Minimal, spatial, dark React component library. CSS custom properties. Zero config.',
  keywords: ['react', 'components', 'design system', 'ui library', 'dark theme', 'typescript'],
  authors: [{ name: 'Germán Román' }],
  openGraph: {
    title: 'open-void-ui',
    description: 'Minimal, spatial, dark React component library.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
