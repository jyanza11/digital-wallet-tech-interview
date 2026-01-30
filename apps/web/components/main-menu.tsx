'use client'

import Link from 'next/link'
import { operations } from '@/constants/operations'
import { useSessionStore } from '@/stores/session-store'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export const MainMenu = () => {
  const user = useSessionStore((s) => s.user)
  const hasHydrated = useSessionStore((s) => s.hasHydrated)

  const visibleOperations = hasHydrated
    ? operations.filter((op) => !(user && op.href === '/login' || op.href === '/register'))
    : operations

  return (
    <div className="grid w-full min-h-[min(60vh,480px)] grid-cols-1 grid-auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 sm:min-h-[min(65vh,520px)]">
      {visibleOperations.map((operation) => {
        const Icon = operation.icon
        return (
          <Link key={operation.href} href={operation.href} className="h-full min-h-0">
            <Card className="h-full flex flex-col transition-colors hover:bg-accent/50">
              <CardHeader className="flex-1 flex flex-col justify-center">
                <div className="mb-2 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-8" />
                </div>
                <CardTitle>{operation.name}</CardTitle>
                <CardDescription>{operation.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
