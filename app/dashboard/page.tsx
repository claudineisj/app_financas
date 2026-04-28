'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'

const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const from = format(startOfMonth(currentDate), 'yyyy-MM-dd')
    const to = format(endOfMonth(currentDate), 'yyyy-MM-dd')

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })

    setTransactions(data ?? [])
    setLoading(false)
  }, [currentDate])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const monthLabel = `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Month selector */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => subMonths(d, 1))}
            className="size-8"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 w-36 text-center">{monthLabel}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => addMonths(d, 1))}
            className="size-8"
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            onClick={() => setFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
            size="sm"
          >
            <Plus className="size-4 mr-1" />
            Nova
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          Carregando...
        </div>
      ) : (
        <>
          <SummaryCards transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryChart transactions={transactions} />
            <RecentTransactions transactions={transactions} />
          </div>
        </>
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={null}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
