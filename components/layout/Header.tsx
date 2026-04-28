'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, LogOut, LayoutDashboard, ArrowUpDown, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transacoes', label: 'Transações', icon: ArrowUpDown },
]

export function Header({ email }: { email: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="flex items-center h-16 px-4 border-b bg-white lg:px-6 shrink-0">
      {/* Mobile menu */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <div className="flex items-center gap-2.5 px-5 h-16 border-b">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Wallet className="text-white size-4" />
            </div>
            <span className="font-semibold text-slate-900">FinançasPessoais</span>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSheetOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1.5" />
          }
        >
          <Avatar className="size-7">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-slate-700 hidden sm:block max-w-[160px] truncate">{email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="size-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
