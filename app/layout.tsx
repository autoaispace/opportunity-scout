import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Opportunity Scout',
  description: 'AI 驱动的商机发现平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
