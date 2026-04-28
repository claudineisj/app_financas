import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FinançasPessoais',
  description: 'Gerencie suas finanças pessoais de forma simples e visual',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full`}>
      <body className="h-full bg-background antialiased">{children}</body>
    </html>
  )
}
