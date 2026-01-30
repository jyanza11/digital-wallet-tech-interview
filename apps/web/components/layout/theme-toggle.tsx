'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  if (!mounted) {
    return <Switch checked={false} disabled className="h-5 w-9" aria-hidden />
  }

  return (
    <label className="flex items-center gap-2">
      <Sun
        className={cn(
          'h-4 w-4 shrink-0',
          isDark ? 'text-muted-foreground' : 'text-foreground'
        )}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label={isDark ? 'Modo noche' : 'Modo claro'}
      />
      <Moon
        className={cn(
          'h-4 w-4 shrink-0',
          isDark ? 'text-foreground' : 'text-muted-foreground'
        )}
      />
    </label>
  )
}
