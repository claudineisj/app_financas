'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Transaction, TransactionFormData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'
import { format } from 'date-fns'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  onSuccess: () => void
}

const EMPTY_FORM: TransactionFormData = {
  type: 'despesa',
  amount: '',
  description: '',
  category: '',
  date: format(new Date(), 'yyyy-MM-dd'),
}

export function TransactionForm({ open, onOpenChange, transaction, onSuccess }: Props) {
  const [form, setForm] = useState<TransactionFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: String(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [transaction, open])

  const categories = form.type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const isEditing = !!transaction

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) {
      setError('Informe um valor válido maior que zero.')
      return
    }
    if (!form.category) {
      setError('Selecione uma categoria.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const payload = {
      type: form.type,
      amount,
      description: form.description,
      category: form.category,
      date: form.date,
    }

    const { error: dbError } = isEditing
      ? await supabase.from('transactions').update(payload).eq('id', transaction.id)
      : await supabase.from('transactions').insert(payload)

    setLoading(false)
    if (dbError) {
      setError('Erro ao salvar. Tente novamente.')
      return
    }
    onSuccess()
    onOpenChange(false)
  }

  function setType(type: 'receita' | 'despesa') {
    setForm((f) => ({ ...f, type, category: '' }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="transaction-form" className="flex flex-col gap-4 py-2">
          {/* Type toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={() => setType('despesa')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.type === 'despesa'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('receita')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.type === 'receita'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Receita
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Supermercado, Salário..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Categoria</Label>
            <Select
              value={form.category || undefined}
              onValueChange={(val) => setForm((f) => ({ ...f, category: val ?? '' }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="transaction-form"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
