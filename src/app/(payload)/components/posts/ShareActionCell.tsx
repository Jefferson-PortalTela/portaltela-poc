'use client'

import React, { useMemo, useState } from 'react'
import { Button, Modal, toast, useModal } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'x'

const platformOptions: { label: string; value: Platform }[] = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'X', value: 'x' },
]

type PublishResponse = {
  mocked: boolean
  preview: {
    platform: Platform
    postId: number | string
    suggestedText: string
    title: string
    url: string
  }
  success: boolean
}

export function ShareActionCell({ rowData }: DefaultCellComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [message, setMessage] = useState('')
  const [lastResult, setLastResult] = useState<null | PublishResponse>(null)
  const { closeModal, openModal } = useModal()

  const postId = rowData?.id
  const postTitle = typeof rowData?.title === 'string' ? rowData.title : 'Post sem titulo'
  const postSlug = typeof rowData?.slug === 'string' ? rowData.slug : ''
  const modalSlug = useMemo(() => `share-post-${String(postId)}`, [postId])

  const fallbackMessage = useMemo(() => {
    if (!postTitle) return ''

    if (!postSlug) return postTitle

    return `${postTitle}\n\nConfira em /posts/${postSlug}`
  }, [postSlug, postTitle])

  const handleOpen = () => {
    setMessage((current) => current || fallbackMessage)
    openModal(modalSlug)
  }

  const handleSubmit = async () => {
    if (!postId || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message,
          platform,
          postId,
        }),
      })

      const result = (await response.json()) as PublishResponse | { error?: string }

      if (!response.ok) {
        throw new Error(
          typeof result === 'object' && result && 'error' in result && result.error
            ? result.error
            : 'Nao foi possivel preparar a publicacao.',
        )
      }

      setLastResult(result as PublishResponse)
      toast.success('Mock de publicacao preparado com sucesso.')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao preparar publicacao.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    closeModal(modalSlug)
  }

  return (
    <>
      <Button buttonStyle="secondary" size="small" onClick={handleOpen}>
        Publicar
      </Button>

      <Modal slug={modalSlug}>
        <div className="w-[min(640px,calc(100vw-32px))] max-w-[640px] rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-bg)] p-6">
          <div className="grid gap-3">
            <div>
              <h3 className="m-0 text-[22px] font-semibold leading-[1.1]">Publicar nas redes</h3>
              <p className="mt-2 text-sm text-[var(--theme-text-dim)]">{postTitle}</p>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">Rede</span>
              <select
                className="min-h-11 rounded-lg border border-[var(--theme-elevation-150)] bg-[var(--theme-input-bg)] px-3 text-sm text-[var(--theme-text)]"
                onChange={(event) => setPlatform(event.target.value as Platform)}
                value={platform}
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">Legenda sugerida</span>
              <textarea
                className="min-h-[168px] w-full resize-y rounded-lg border border-[var(--theme-elevation-150)] bg-[var(--theme-input-bg)] p-3 text-sm text-[var(--theme-text)]"
                onChange={(event) => setMessage(event.target.value)}
                rows={7}
                value={message}
              />
            </label>

            <div className="text-xs text-[var(--theme-text-dim)]">
              Esta acao ainda esta em modo mock e nao publica em uma rede real.
            </div>

            {lastResult?.success ? (
              <div className="grid gap-1 rounded-lg border border-[var(--theme-success-400)] bg-[var(--theme-success-100)] p-3 text-sm text-[var(--theme-text)]">
                <strong>Payload preparado</strong>
                <span>Rede: {lastResult.preview.platform}</span>
                <span>URL publica: {lastResult.preview.url}</span>
              </div>
            ) : null}

            <div className="mt-2 flex justify-end gap-3">
              <Button buttonStyle="secondary" onClick={handleClose}>
                Fechar
              </Button>
              <Button buttonStyle="primary" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? 'Preparando...' : 'Preparar publicacao'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
