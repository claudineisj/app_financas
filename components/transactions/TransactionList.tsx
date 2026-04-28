'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, getCategoryLabel, ALL_CATEGORIES } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionForm } from './TransactionForm'
import { DeleteDialog } from './DeleteDialog'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'

const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function TransactionList() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('todas')

  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

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

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'todos' && t.type !== typeFilter) return false
    if (categoryFilter !== 'todas' && t.category !== categoryFilter) return false
    return true
  })

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

  const monthLabel = `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  return (
    <div className="flex flex-col gap-4">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Month selector */}
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* Type filter */}
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

          {/* Category filter */}
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

        <Button
          onClick={() => { setEditingTransaction(null); setFormOpen(true) }}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          size="sm"
        >
          <Plus className="size-4 mr-1" />
          Nova transação
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl ring-1 ring-foreground/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-slate-400 text-sm">Nenhuma transação encontrada</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setEditingTransaction(null); setFormOpen(true) }}
              className="text-blue-600 text-xs"
            >
              <Plus className="size-3 mr-1" />
              Adicionar transação
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Descrição</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Valor</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {format(parseISO(t.date), 'dd/MM/yy')}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      <span className="line-clamp-1">{t.description}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {getCategoryLabel(t.category)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        className={`text-xs font-normal ${
                          t.type === 'receita'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        variant="secondary"
                      >
                        {t.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`font-semibold ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'receita' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-slate-400 hover:text-blue-600"
                          onClick={() => openEdit(t)}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-slate-400 hover:text-red-600"
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
        <div className="flex justify-end gap-6 text-sm text-slate-600 px-1">
          <span>
            Receitas: <span className="font-semibold text-emerald-600">
              {formatCurrency(filtered.filter((t) => t.type === 'receita').reduce((s, t) => s + Number(t.amount), 0))}
            </span>
          </span>
          <span>
            Despesas: <span className="font-semibold text-red-600">
              {formatCurrency(filtered.filter((t) => t.type === 'despesa').reduce((s, t) => s + Number(t.amount), 0))}
            </span>
          </span>
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
