'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import React from 'react'

import type { Theme } from '../types'

import { useTheme } from '..'

export const ThemeSelector: React.FC = () => {
  const { setTheme, theme } = useTheme()

  return (
    <div className="inline-flex items-center rounded-full bg-[#6f2dbd] p-1 text-white shadow-[0_10px_22px_rgba(111,45,189,0.22)] dark:bg-[linear-gradient(135deg,#6f2dbd,#5b239b)] dark:shadow-[0_12px_26px_rgba(0,0,0,0.34)]">
      {[
        { label: 'Tema claro', shortLabel: 'Claro', value: 'light' as Theme, icon: Sun },
        { label: 'Tema escuro', shortLabel: 'Escuro', value: 'dark' as Theme, icon: Moon },
      ].map((option) => {
        const isActive = theme === option.value
        const Icon = option.icon

        return (
          <Button
            aria-label={option.label}
            aria-pressed={isActive}
            className={
              isActive
                ? 'h-7 min-w-7 rounded-full bg-white px-2 text-[#6f2dbd] hover:bg-white dark:bg-white dark:text-[#6f2dbd] dark:hover:bg-white'
                : 'h-7 min-w-7 rounded-full px-2 text-white/72 hover:bg-white/10 hover:text-white dark:text-white/72 dark:hover:bg-white/12 dark:hover:text-white'
            }
            key={option.value}
            onClick={() => setTheme(option.value)}
            size="clear"
            type="button"
            variant="ghost"
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{option.shortLabel}</span>
          </Button>
        )
      })}
    </div>
  )
}
