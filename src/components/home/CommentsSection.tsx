'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/ui'
import { MessageCircleMore, Send, ThumbsUp } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'portal-tela-community-comments'

export interface CommunityComment {
  id: string
  author: string
  role: string
  message: string
  createdAt: string
  likes: number
}

type CommentsSectionProps = {
  initialComments: CommunityComment[]
}

const formatTimeAgo = (value: string) => {
  const now = Date.now()
  const publishedAt = new Date(value).getTime()
  const diff = Math.max(now - publishedAt, 0)

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `ha ${Math.max(minutes, 1)} min`
  if (hours < 24) return `ha ${hours}h`
  if (days < 7) return `ha ${days}d`

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

export const CommentsSection = ({ initialComments }: CommentsSectionProps) => {
  const [comments, setComments] = useState<CommunityComment[]>(initialComments)
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CommunityComment[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed, ...initialComments].reduce<CommunityComment[]>((acc, item) => {
            if (acc.some((current) => current.id === item.id)) return acc
            acc.push(item)
            return acc
          }, [])

          setComments(
            merged.sort(
              (left, right) =>
                new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            ),
          )
        }
      }
    } catch {
      setComments(initialComments)
    } finally {
      setHydrated(true)
    }
  }, [initialComments])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
  }, [comments, hydrated])

  const totalComments = useMemo(() => comments.length, [comments])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!author.trim() || !message.trim()) return

    const nextComment: CommunityComment = {
      id: `community-${Date.now()}`,
      author: author.trim(),
      role: 'Leitor da comunidade',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    setComments((current) => [nextComment, ...current].slice(0, 10))
    setAuthor('')
    setMessage('')
  }

  const handleLike = (commentId: string) => {
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    )
  }

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(23,20,38,0.98),rgba(10,13,22,0.98))] dark:shadow-[0_24px_90px_rgba(3,6,18,0.45)] lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6f2dbd]/25 bg-[#6f2dbd]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f2dbd] dark:border-[#6f2dbd]/35 dark:bg-[#6f2dbd]/14 dark:text-[#d5b9ef]">
            <MessageCircleMore className="size-3.5" />
            Comentarios
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">A conversa continua aqui</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-white/10 dark:bg-[#6f2dbd]/12">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Participacao</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{totalComments}</p>
        </div>
      </div>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
          <Input
            aria-label="Seu nome"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/40"
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Seu nome"
            value={author}
          />
          <Textarea
            aria-label="Seu comentario"
            className="min-h-[88px] rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/40"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="O que voce achou da cobertura de hoje?"
            value={message}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-white/55">
            Participe da conversa e compartilhe sua leitura sobre os assuntos do dia.
          </p>
          <Button
            className="h-11 rounded-2xl bg-[#6f2dbd] px-5 text-sm font-semibold text-white hover:bg-[#5f26a2]"
            type="submit"
          >
            <Send className="size-4" />
            Publicar comentario
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {comments.map((comment, index) => (
          <article
            key={comment.id}
            className={cn(
              'rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-colors hover:bg-slate-100 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.025))] dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))]',
              index === 0 &&
                'border-[#6f2dbd]/20 bg-[#6f2dbd]/6 dark:border-[#6f2dbd]/35 dark:bg-[#6f2dbd]/12',
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{comment.author}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                  {comment.role}
                </p>
              </div>
              <p className="text-sm text-slate-500 dark:text-white/45">{formatTimeAgo(comment.createdAt)}</p>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-white/72">{comment.message}</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-[#6f2dbd]/35 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-[#6f2dbd]/35 dark:hover:text-white"
                onClick={() => handleLike(comment.id)}
                type="button"
              >
                <ThumbsUp className="size-3.5" />
                Curtir
              </button>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/35">
                {comment.likes} aplausos
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
