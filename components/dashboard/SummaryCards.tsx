import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Landmark } from 'lucide-react'
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
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950">
              <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(receitas)}</p>
          <p className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === 'receita').length} transações</p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950">
              <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(despesas)}</p>
          <p className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === 'despesa').length} transações</p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${saldo >= 0 ? 'bg-orange-100 dark:bg-orange-950' : 'bg-red-100 dark:bg-red-950'}`}>
              <Landmark className={`size-4 ${saldo >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(saldo)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{transactions.length} transações no total</p>
        </CardContent>
      </Card>
    </div>
  )
}
