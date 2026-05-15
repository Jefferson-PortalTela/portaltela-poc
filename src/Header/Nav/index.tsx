'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

const PortalBuddyIcon = () => {
  return (
    <span className="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_8px_18px_rgba(111,45,189,0.28)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Telinha do Portal Tela"
        className="size-7 object-cover"
        height={28}
        src="/images/bot.png"
        width={28}
      />
    </span>
  )
}

export const HeaderNav: React.FC<{ condensed?: boolean; data: HeaderType }> = ({
  condensed = false,
  data,
}) => {
  const fallbackNavItems: NonNullable<HeaderType['navItems']> = [
    { link: { type: 'custom', url: '/', label: 'Inicio' } },
    { link: { type: 'custom', url: '/search?q=Esportes', label: 'Esportes' } },
    {
      link: {
        type: 'custom',
        url: '/search?q=Negocios%20e%20Tecnologia',
        label: 'Negocios e Tecnologia',
      },
    },
    { link: { type: 'custom', url: '/search?q=Policial', label: 'Policial' } },
    { link: { type: 'custom', url: '/search?q=Cristao', label: 'Cristao' } },
    { link: { type: 'custom', url: '/search?q=Videos', label: 'Videos' } },
    { link: { type: 'custom', url: '/posts', label: 'Mais' } },
  ]

  const navItems = data?.navItems && data.navItems.length > 0 ? data.navItems : fallbackNavItems

  return (
    <nav
      className={`flex w-full flex-col ${condensed ? 'gap-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-4' : 'gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6'}`}
    >
      <div
        className={`flex flex-wrap items-center justify-center ${condensed ? 'gap-x-6 gap-y-2 lg:min-w-0 lg:justify-center' : 'gap-x-7 gap-y-2 lg:min-w-0 lg:justify-start'}`}
      >
        {navItems.map(({ link }, index) => {
          return (
            <CMSLink
              appearance="inline"
              className={`font-medium text-slate-800 transition-colors hover:text-[#6f2dbd] dark:text-white/84 dark:hover:text-[#eadbfd] ${condensed ? 'text-[12px]' : 'text-[13px]'}`}
              key={index}
              {...link}
            />
          )
        })}
      </div>

      <div
        className={`flex flex-wrap items-center justify-center ${condensed ? 'gap-2 lg:justify-end' : 'gap-3 lg:justify-end'}`}
      >
        {!condensed ? <ThemeSelector /> : null}

        <form
          action="/search"
          className={`hidden md:flex ${condensed ? 'md:w-[210px]' : 'md:w-[240px]'}`}
        >
          <div
            className={`flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#101524] dark:shadow-[0_10px_28px_rgba(0,0,0,0.22)] ${condensed ? 'h-8' : 'h-9'}`}
          >
            <PortalBuddyIcon />
            <SearchIcon className="size-4 text-[#6f2dbd] dark:text-[#c6a5ea]" />
            <Input
              className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-slate-700 placeholder:text-slate-400 shadow-none focus-visible:ring-0 focus-visible:outline-none dark:text-white/92 dark:placeholder:text-white/36"
              name="q"
              placeholder="Buscar no Portal Tela"
              type="search"
            />
          </div>
        </form>

        <Button
          asChild
          className={`rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#101524] dark:text-white dark:hover:bg-white/8 md:hidden ${condensed ? 'h-8' : 'h-9'}`}
          variant="outline"
        >
          <Link href="/search">
            Buscar
            <SearchIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </nav>
  )
}
