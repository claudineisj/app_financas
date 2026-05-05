'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'
import { Transaction, getCategoryLabel, ALL_CATEGORIES } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionForm } from './TransactionForm'
import { DeleteDialog } from './DeleteDialog'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

type PeriodMode = 'mensal' | 'personalizado'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function exportToExcel(transactions: Transaction[], label: string) {
  const rows = transactions.map((t) => ({
    Data: format(parseISO(t.date), 'dd/MM/yyyy'),
    Descrição: t.description,
    Categoria: getCategoryLabel(t.category),
    Tipo: t.type === 'receita' ? 'Receita' : 'Despesa',
    Valor: Number(t.amount),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 12 }, { wch: 32 }, { wch: 16 }, { wch: 10 }, { wch: 14 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Transações')
  XLSX.writeFile(wb, `transacoes_${label}.xlsx`)
}

export function TransactionList() {
  const [periodMode, setPeriodMode] = useState<PeriodMode>('mensal')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('todas')

  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

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

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'todos' && t.type !== typeFilter) return false
    if (categoryFilter !== 'todas' && t.category !== categoryFilter) return false
    return true
  })

  const periodLabel = useMemo(() => {
    if (periodMode === 'personalizado' && appliedFrom && appliedTo) {
      return `${format(parseISO(appliedFrom), 'dd/MM/yyyy')} – ${format(parseISO(appliedTo), 'dd/MM/yyyy')}`
    }
    return `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }, [periodMode, currentDate, appliedFrom, appliedTo])

  const exportLabel = useMemo(() => {
    if (periodMode === 'personalizado' && appliedFrom && appliedTo) {
      return `${appliedFrom}_${appliedTo}`
    }
    return format(currentDate, 'yyyy-MM')
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

  function openEdit(t: Transaction) {
    setEditingTransaction(t)
    setFormOpen(true)
  }

  function openDelete(t: Transaction) {
    setDeletingTransaction(t)
    setDeleteOpen(true)
  }

  function handleFormClose(open: boolean) {
    setFormOpen(open)
    if (!open) setEditingTransaction(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Period selector */}
      <div className="flex flex-col gap-3">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
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
        </div>

        {/* Period controls */}
        {periodMode === 'mensal' ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => subMonths(d, 1))} className="size-8">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-foreground w-36 text-center">
              {MONTH_LABELS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
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
          </div>
        )}
      </div>

      {/* Filters + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'todos')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'todas')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas categorias</SelectItem>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(filtered, exportLabel)}
            disabled={filtered.length === 0}
          >
            <Download className="size-4 mr-1" />
            Exportar Excel
          </Button>
          <Button
            onClick={() => { setEditingTransaction(null); setFormOpen(true) }}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            size="sm"
          >
            <Plus className="size-4 mr-1" />
            Nova transação
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl ring-1 ring-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-muted-foreground text-sm">Nenhuma transação encontrada</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setEditingTransaction(null); setFormOpen(true) }}
              className="text-orange-600 text-xs"
            >
              <Plus className="size-3 mr-1" />
              Adicionar transação
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Valor</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`border-b last:border-0 hover:bg-muted/40 transition-colors ${i % 2 !== 0 ? 'bg-muted/20' : ''}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {format(parseISO(t.date), 'dd/MM/yy')}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      <span className="line-clamp-1">{t.description}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {getCategoryLabel(t.category)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        className={`text-xs font-normal border-0 ${
                          t.type === 'receita'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        }`}
                        variant="secondary"
                      >
                        {t.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`font-semibold ${
                        t.type === 'receita'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {t.type === 'receita' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-orange-600"
                          onClick={() => openEdit(t)}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-red-600"
                          onClick={() => openDelete(t)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary row */}
      {filtered.length > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground px-1">
          <span className="text-xs">{periodLabel}</span>
          <div className="flex gap-6">
            <span>
              Receitas:{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(filtered.filter((t) => t.type === 'receita').reduce((s, t) => s + Number(t.amount), 0))}
              </span>
            </span>
            <span>
              Despesas:{' '}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(filtered.filter((t) => t.type === 'despesa').reduce((s, t) => s + Number(t.amount), 0))}
              </span>
            </span>
          </div>
        </div>
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        transaction={editingTransaction}
        onSuccess={fetchTransactions}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        transaction={deletingTransaction}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
