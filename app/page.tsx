import Link from 'next/link'
import { Landmark, TrendingUp, PieChart, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: TrendingUp,
    title: 'Receitas e Despesas',
    description:
      'Registre e categorize facilmente todas as suas transações financeiras em um só lugar.',
  },
  {
    icon: PieChart,
    title: 'Gráficos Visuais',
    description:
      'Veja para onde seu dinheiro vai com gráficos claros de gastos por categoria.',
  },
  {
    icon: ShieldCheck,
    title: 'Dados Seguros',
    description:
      'Suas informações são protegidas com autenticação segura e armazenamento criptografado.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-600">
              <Landmark className="text-white size-4" />
            </div>
            <span className="font-semibold text-lg">Minhas Finanças Pessoais</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6 border border-orange-100 dark:border-orange-900">
            <Landmark className="size-3.5" />
            Gestão Financeira Pessoal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Controle suas finanças
            <br />
            <span className="text-orange-600">com simplicidade</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Registre receitas e despesas, acompanhe seu saldo mensal e visualize para onde
            seu dinheiro vai — tudo em um só lugar, de graça.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                Entrar na conta
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/40 border-t border-b">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center mb-3">
              Tudo que você precisa para organizar suas finanças
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Simples de usar, poderoso o suficiente para te dar controle total.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-card rounded-xl p-6 border shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 self-start">
                    <Icon className="size-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8">
            Crie sua conta gratuitamente e comece a controlar suas finanças hoje mesmo.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
              Criar conta grátis
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Minhas Finanças Pessoais. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
