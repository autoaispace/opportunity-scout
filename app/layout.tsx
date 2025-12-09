import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Opportunity Scout',
  description: 'AI-powered opportunity discovery platform',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'icon',
      url: '/icon.png',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
