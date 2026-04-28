# FinançasPessoais — Setup Guide

## 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Em **Project Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## 3. Desenvolvimento local

```bash
npm run dev
# Acesse http://localhost:3000
```

> **Nota:** O build local (`npm run build`) pode falhar em Windows com Node.js v24
> quando a pasta pai contém `#` no nome (bug conhecido). Use o dev server para
> desenvolvimento e faça deploy via Vercel para produção.

## 4. Deploy na Vercel

1. Faça push do projeto para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy! ✓

## 5. Estrutura do projeto

```
app/
├── login/          # Página de login
├── register/       # Cadastro de usuário
└── dashboard/
    ├── page.tsx    # Dashboard principal
    └── transacoes/ # Lista de transações

components/
├── layout/         # Sidebar e Header
├── dashboard/      # Cards, gráfico, transações recentes
└── transactions/   # Lista, formulário, dialogs

lib/supabase/       # Clientes Supabase (browser e server)
types/              # Tipos TypeScript
supabase/
└── schema.sql      # Schema do banco de dados
```
