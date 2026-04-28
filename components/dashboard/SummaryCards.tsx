import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Transaction } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const receitas = transactions
    .filter((t) => t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const despesas = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const saldo = receitas - despesas

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">Receitas</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(receitas)}</p>
          <p className="text-xs text-slate-500 mt-1">{transactions.filter((t) => t.type === 'receita').length} transações</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">Despesas</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
              <TrendingDown className="size-4 text-red-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(despesas)}</p>
          <p className="text-xs text-slate-500 mt-1">{transactions.filter((t) => t.type === 'despesa').length} transações</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">Saldo</CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <Wallet className={`size-4 ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(saldo)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{transactions.length} transações no total</p>
        </CardContent>
      </Card>
    </div>
  )
}
