'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowUpDown, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transacoes', label: 'Transações', icon: ArrowUpDown },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r bg-background h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-600">
          <Landmark className="text-white size-4" />
        </div>
        <span className="font-semibold">Minhas Finanças</span>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
