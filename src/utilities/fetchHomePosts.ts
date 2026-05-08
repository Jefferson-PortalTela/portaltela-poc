import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { PostCardData } from '@/components/NewsCard'

const SELECT_FIELDS = {
  title: true,
  slug: true,
  heroImage: true,
  categories: true,
  meta: true,
  populatedAuthors: true,
  publishedAt: true,
} as const

/**
 * Fetches the 4 most recent published posts as a fallback for featured posts
 * when no featured posts are configured in the Home global.
 */
export async function fetchFallbackFeatured(): Promise<PostCardData[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 4,
    depth: 1,
    select: SELECT_FIELDS,
  })

  return result.docs as unknown as PostCardData[]
}

/**
 * Fetches published posts for a specific category.
 * Returns an empty array on error to avoid breaking the page.
 */
export async function fetchPostsByCategory(
  categoryId: string,
  limit: number,
): Promise<PostCardData[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        categories: { in: [categoryId] },
      },
      sort: '-publishedAt',
      limit,
      depth: 1,
      select: SELECT_FIELDS,
    })

    return result.docs as unknown as PostCardData[]
  } catch {
    return []
  }
}

/**
 * Fetches the latest published posts, optionally excluding specific post IDs
 * (e.g. posts already shown in the featured section).
 */
export async function fetchLatestNews(
  excludeIds: string[],
  limit: number,
): Promise<PostCardData[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      ...(excludeIds.length > 0 ? { id: { not_in: excludeIds } } : {}),
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
    select: SELECT_FIELDS,
  })

  return result.docs as unknown as PostCardData[]
}
