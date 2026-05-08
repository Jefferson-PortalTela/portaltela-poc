import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Instagram, MessageSquareMore, Youtube } from 'lucide-react'

const splitIntoColumns = <T,>(items: T[], size: number) => {
  const result: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }

  return result
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const columns = splitIntoColumns(navItems, Math.max(Math.ceil(navItems.length / 3), 1)).slice(0, 3)

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 text-slate-950 dark:border-white/8 dark:bg-[linear-gradient(180deg,#05070e_0%,#080b14_100%)] dark:text-white">
      <div className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(140deg,#ffffff_0%,#eef2ff_72%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(111,45,189,0.18),_transparent_24%),linear-gradient(140deg,#171a30_0%,#090c15_72%)] dark:shadow-[0_28px_90px_rgba(2,4,12,0.45)] lg:p-8">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <Link
                className="inline-flex rounded-[22px] bg-[#0b0d16] px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:shadow-none"
                href="/"
              >
                <Logo className="h-11 max-w-[11.75rem]" loading="eager" priority="high" />
              </Link>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/62">
                Seu portal de noticias com cobertura de politica, economia, tecnologia, cultura e
                esportes ao longo do dia.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white/72 dark:hover:text-white"
                  href="/search"
                >
                  <MessageSquareMore className="size-4" />
                  Comentarios
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white/72 dark:hover:text-white"
                  href="/posts"
                >
                  <Youtube className="size-4" />
                  Videos e coberturas
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white/72 dark:hover:text-white"
                  href="/admin"
                >
                  <Instagram className="size-4" />
                  Presenca digital
                </Link>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {columns.length > 0 ? (
                columns.map((column, index) => (
                  <div key={`footer-column-${index}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-600 dark:text-[#d5b9ef]">
                      {index === 0 ? 'Navegacao' : index === 1 ? 'Cobertura' : 'Institucional'}
                    </p>
                    <div className="mt-4 space-y-3">
                      {column.map(({ link }, itemIndex) => (
                        <CMSLink
                          appearance="inline"
                          className="block text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-white/62 dark:hover:text-white"
                          key={itemIndex}
                          {...link}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-600 dark:text-[#d5b9ef]">
                      Navegacao
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/62">
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/">
                        Inicio
                      </Link>
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/posts">
                        Noticias
                      </Link>
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/search">
                        Buscar
                      </Link>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-600 dark:text-[#d5b9ef]">
                      Cobertura
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/62">
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/posts">
                        Destaques
                      </Link>
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/posts">
                        Ultimas do portal
                      </Link>
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/search">
                        Assuntos do dia
                      </Link>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-600 dark:text-[#d5b9ef]">
                      Institucional
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/62">
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/admin">
                        Painel editorial
                      </Link>
                      <Link className="block transition-colors hover:text-slate-950 dark:hover:text-white" href="/search">
                        Central de ajuda
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-white/8 dark:text-white/45">
            <p>© 2026 Portal Tela. Todos os direitos reservados.</p>
            <p>Cobertura em atualizacao continua, com foco nos temas que movem o noticiario.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
