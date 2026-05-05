import { TransactionList } from '@/components/transactions/TransactionList'

export default function TransacoesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Transações</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas receitas e despesas</p>
      </div>
      <TransactionList />
    </div>
  )
}
