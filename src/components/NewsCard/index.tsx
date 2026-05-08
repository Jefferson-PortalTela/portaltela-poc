import Link from 'next/link'
import React from 'react'

import type { Category, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { formatDatePtBR } from '@/utilities/formatDatePtBR'

export interface PostCardData {
  id: string
  title: string
  slug: string
  heroImage?: Media | null
  categories?: (Category | string)[] | null
  meta?:
    | {
        description?: string | null
      }
    | null
  populatedAuthors?:
    | {
        id?: string | null
        name?: string | null
      }[]
    | null
  publishedAt?: string | null
}

export const NewsCard: React.FC<{ post: PostCardData }> = ({ post }) => {
  const { title, slug, heroImage, categories, publishedAt } = post

  const primaryCategory =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as Category).title
      : null

  const formattedDate = publishedAt ? formatDatePtBR(publishedAt) : null

  const imageAlt = heroImage?.alt || title

  return (
    <article className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
      {heroImage && (
        <div className="relative w-full aspect-video overflow-hidden">
          <MediaComponent
            resource={heroImage}
            alt={imageAlt}
            fill
            imgClassName="object-cover"
            size="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        {primaryCategory && (
          <span className="uppercase text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
            {primaryCategory}
          </span>
        )}
        <h3 className="text-base font-semibold leading-snug mb-2">
          <Link
            href={`/posts/${slug}`}
            aria-label={`Leia mais: ${title}`}
            className="hover:underline"
          >
            {title}
          </Link>
        </h3>
        {formattedDate && (
          <time dateTime={publishedAt ?? undefined} className="text-xs text-muted-foreground">
            {formattedDate}
          </time>
        )}
      </div>
    </article>
  )
}
