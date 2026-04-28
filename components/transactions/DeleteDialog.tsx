'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Transaction } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  onSuccess: () => void
}

export function DeleteDialog({ open, onOpenChange, transaction, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!transaction) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', transaction.id)
    setLoading(false)
    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir Transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>&quot;{transaction?.description}&quot;</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
