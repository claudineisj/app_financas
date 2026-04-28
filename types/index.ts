export type TransactionType = 'receita' | 'despesa'

export const EXPENSE_CATEGORIES = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'moradia', label: 'Moradia' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'lazer', label: 'Lazer' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'outros', label: 'Outros' },
] as const

export const INCOME_CATEGORIES = [
  { value: 'salario', label: 'Salário' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investimentos', label: 'Investimentos' },
  { value: 'outros_receita', label: 'Outros' },
] as const

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const CATEGORY_COLORS: Record<string, string> = {
  alimentacao: '#f97316',
  transporte: '#3b82f6',
  moradia: '#8b5cf6',
  saude: '#ec4899',
  educacao: '#14b8a6',
  lazer: '#f59e0b',
  vestuario: '#06b6d4',
  outros: '#6b7280',
  salario: '#22c55e',
  freelance: '#84cc16',
  investimentos: '#10b981',
  outros_receita: '#6b7280',
}

export function getCategoryLabel(value: string): string {
  return ALL_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  created_at: string
}

export interface TransactionFormData {
  type: TransactionType
  amount: string
  description: string
  category: string
  date: string
}
