import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Opportunity Scout',
  description: 'AI-powered opportunity discovery platform',
}

const googleAdsClientId = process.env.NEXT_PUBLIC_GADS_CLIENT_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        {googleAdsClientId ? (
          <Script
            id="google-adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsClientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
        {children}
      </body>
    </html>
  )
}
