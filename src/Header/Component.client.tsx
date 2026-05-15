'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Menu, MapPin } from 'lucide-react'
import { HeaderNav } from './Nav'
import Banner from 'public/images/banner.png'
import Image from 'next/image'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const showCompactAt = 220
  const hideCompactAt = 120
  const [showCompactHeader, setShowCompactHeader] = useState(false)
  const [todayLabel, setTodayLabel] = useState('Edicao atualizada hoje')
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const alwaysCompactHeader =
    pathname?.startsWith('/posts/') || pathname === '/noticia-exemplo' || false
  const marketSnapshot = [
    { label: 'Ibovespa', value: '128.695', change: '+0,42%', tone: 'positive' },
    { label: 'Dolar', value: 'R$ 5,11', change: '-0,25%', tone: 'negative' },
    { label: 'Euro', value: 'R$ 5,52', change: '-0,26%', tone: 'negative' },
    { label: 'Bitcoin', value: '70.324', change: '+1,36%', tone: 'positive' },
    { label: 'Petroleo', value: '82,40', change: '+1,44%', tone: 'positive' },
  ] as const
  const urgentHeadlines = [
    'Alerta para impacto do fechamento do Estreito de Ormuz',
    'STF firma maioria para regulamentar redes sociais e plataformas digitais',
  ]
  const tickerItems = [
    'Cientistas descobrem nova especie marinha',
    'Mercado monitora juros e inflacao nos EUA',
    'Nova frente fria avanca pelo Sul do pais',
  ]
  const headerThemeAttribute = useMemo(() => {
    if (headerTheme === 'light' || headerTheme === 'dark') return headerTheme
    return undefined
  }, [headerTheme])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setTodayLabel(
      new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    )
  }, [])

  useEffect(() => {
    if (alwaysCompactHeader) {
      setShowCompactHeader(true)
      return
    }

    let frameId = 0

    const handleScroll = () => {
      if (frameId) return

      frameId = window.requestAnimationFrame(() => {
        const nextScrollY = window.scrollY

        setShowCompactHeader((current) => {
          if (!current && nextScrollY >= showCompactAt) return true
          if (current && nextScrollY <= hideCompactAt) return false
          return current
        })

        frameId = 0
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [alwaysCompactHeader, hideCompactAt, showCompactAt])

  return (
    <>
      {!alwaysCompactHeader ? (
        <header
          className="relative z-30 border-b border-slate-300/80 bg-[rgba(252,251,247,0.96)] text-slate-950 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(7,9,15,0.94),rgba(10,13,22,0.94))] dark:text-white"
          {...(headerThemeAttribute ? { 'data-theme': headerThemeAttribute } : {})}
        >
          <div className="border-b border-[#6f2dbd]/30 bg-[linear-gradient(90deg,#5a239a,#6f2dbd,#8a4bd0)] text-white">
            <div className="container flex flex-wrap items-center gap-x-5 gap-y-2 py-1.5 text-[11px]">
              <span className="inline-flex items-center rounded-full bg-white/18 px-2.5 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Urgente
              </span>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1 text-white/92">
                {urgentHeadlines.map((headline) => (
                  <span className="truncate" key={headline}>
                    {headline}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200/80 bg-white/95 dark:border-white/6 dark:bg-[#0f1420]/92">
            <div className="container flex flex-wrap items-center justify-between gap-3 py-2 text-xs text-slate-500 dark:text-white/55">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {marketSnapshot.map((item) => (
                  <span className="inline-flex items-center gap-1.5" key={item.label}>
                    <span className="text-slate-500 dark:text-white/45">{item.label}</span>
                    <span className="text-slate-700 dark:text-white/84">{item.value}</span>
                    <span
                      className={
                        item.tone === 'positive'
                          ? 'text-emerald-600 dark:text-emerald-300'
                          : 'text-rose-500 dark:text-rose-300'
                      }
                    >
                      {item.change}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top,_rgba(111,45,189,0.18),_transparent_22%),linear-gradient(180deg,rgba(7,9,15,0.98),rgba(7,9,15,0.92))]">
            <div className="container py-2">
              <div className="overflow-hidden border-b border-slate-200/90 py-2 text-[13px] text-slate-600 dark:border-white/10 dark:text-white/62">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Menu className="size-4" />
                    <MapPin className="size-3.5" />
                    <span className="capitalize">{todayLabel}</span>
                  </div>

                  <div className="flex items-center gap-8">
                    <Link
                      className="transition-colors hover:text-[#6f2dbd] dark:hover:text-[#d5b9ef]"
                      href="/admin"
                    >
                      Entrar
                    </Link>
                    <Link
                      className="transition-colors hover:text-[#6f2dbd] dark:hover:text-[#d5b9ef]"
                      href="/search"
                    >
                      busca
                    </Link>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Image
                  src={Banner}
                  alt="Publicidade"
                  width={1200}
                  height={100}
                  className="h-auto w-full rounded object-cover"
                />
              </div>

              <div className="grid gap-6 overflow-hidden border-b border-slate-200/90 pb-6 lg:grid-cols-[160px_minmax(0,1fr)_160px] lg:items-end dark:border-white/10">
                <div className="text-center lg:text-left">
                  <p className="text-[13px] font-medium text-slate-600 dark:text-white/68">
                    Edicao Brasil
                  </p>
                  <p className="mt-2 text-[13px] text-slate-500 dark:text-white/45">
                    Brasil | Portugal | USA
                  </p>
                </div>

                <Link
                  className="mx-auto inline-flex w-fit shrink-0 items-center justify-center"
                  href="/"
                >
                  <Logo className="h-16 max-w-[13.5rem]" loading="eager" priority="high" />
                </Link>

                <div className="hidden lg:block" />
              </div>

              <div className="pt-4">
                <div className="border-b border-slate-200 pb-4 dark:border-white/10">
                  <HeaderNav data={data} />
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-3 text-[12px] text-slate-500 dark:text-white/52">
                  <span className="inline-flex items-center rounded-[10px] bg-[#6f2dbd] px-4 py-2 text-xs font-semibold text-white">
                    Mais lidas
                  </span>

                  {tickerItems.map((item) => (
                    <span className="truncate" key={item}>
                      03 {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <div className="h-[72px]" />
      )}

      <div
        className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${showCompactHeader || alwaysCompactHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        {...(headerThemeAttribute ? { 'data-theme': headerThemeAttribute } : {})}
      >
        <div className="border-b border-slate-300/80 bg-[rgba(252,251,247,0.94)] text-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(7,9,15,0.94),rgba(10,13,22,0.94))] dark:text-white dark:shadow-[0_14px_32px_rgba(0,0,0,0.28)]">
          <div className="container py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link className="inline-flex shrink-0 items-center justify-center" href="/">
                <Logo className="h-9 max-w-[8.75rem]" loading="eager" priority="high" />
              </Link>

              <div className="min-w-0 flex-1">
                <HeaderNav condensed data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
