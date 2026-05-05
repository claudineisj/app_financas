'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns'

const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

type PeriodMode = 'mensal' | 'personalizado'

export default function DashboardPage() {
  const [periodMode, setPeriodMode] = useState<PeriodMode>('mensal')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const { from, to } = useMemo(() => {
    if (periodMode === 'personalizado' && appliedFrom && appliedTo) {
      return { from: appliedFrom, to: appliedTo }
    }
    return {
      from: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
      to: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
    }
  }, [periodMode, currentDate, appliedFrom, appliedTo])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })
    setTransactions(data ?? [])
    setLoading(false)
  }, [from, to])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const periodLabel = useMemo(() => {
    if (periodMode === 'personalizado' && appliedFrom && appliedTo) {
      return `${format(parseISO(appliedFrom), 'dd/MM/yyyy')} – ${format(parseISO(appliedTo), 'dd/MM/yyyy')}`
    }
    return `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }, [periodMode, currentDate, appliedFrom, appliedTo])

  function applyCustomPeriod() {
    if (!customFrom || !customTo) return
    setAppliedFrom(customFrom)
    setAppliedTo(customTo)
  }

  function switchMode(mode: PeriodMode) {
    setPeriodMode(mode)
    if (mode === 'mensal') {
      setAppliedFrom('')
      setAppliedTo('')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Visão geral das suas finanças</p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            {/* Mode toggle */}
            <div className="flex rounded-lg border overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => switchMode('mensal')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  periodMode === 'mensal'
                    ? 'bg-orange-600 text-white'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => switchMode('personalizado')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  periodMode === 'personalizado'
                    ? 'bg-orange-600 text-white'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Personalizado
              </button>
            </div>

            <Button
              onClick={() => setFormOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="size-4 mr-1" />
              Nova
            </Button>
          </div>
        </div>

        {/* Period controls */}
        {periodMode === 'mensal' ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => subMonths(d, 1))} className="size-8">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-foreground w-36 text-center">{periodLabel}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => addMonths(d, 1))} className="size-8">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">De</span>
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="w-36 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">Até</span>
              <Input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="w-36 h-8 text-sm"
              />
            </div>
            <Button
              size="sm"
              onClick={applyCustomPeriod}
              disabled={!customFrom || !customTo}
              className="bg-orange-600 hover:bg-orange-700 text-white h-8"
            >
              Aplicar
            </Button>
            {appliedFrom && appliedTo && (
              <span className="text-sm text-muted-foreground">{periodLabel}</span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Carregando...
        </div>
      ) : (
        <>
          <SummaryCards transactions={transactions} />
          <CashFlowChart transactions={transactions} />
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
