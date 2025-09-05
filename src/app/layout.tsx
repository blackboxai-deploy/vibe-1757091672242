import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Vector Logo Generator',
  description: 'Create professional vector logos for your business using AI. Generate scalable SVG logos based on your company description and style preferences.',
  keywords: 'logo generator, AI logo, vector logo, SVG logo, business logo, logo design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}