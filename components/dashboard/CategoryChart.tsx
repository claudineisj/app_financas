'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction, getCategoryLabel, CATEGORY_COLORS } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const despesas = transactions.filter((t) => t.type === 'despesa')

  const byCategory = despesas.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount)
    return acc
  }, {})

  const data = Object.entries(byCategory)
    .map(([category, total]) => ({
      name: getCategoryLabel(category),
      total,
      color: CATEGORY_COLORS[category] ?? '#6b7280',
    }))
    .sort((a, b) => b.total - a.total)

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-700">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-slate-400 text-sm">
          Nenhuma despesa no período
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-700">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `R$${v}`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#64748b' }}
              width={90}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Total']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
