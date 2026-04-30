import type { Metadata } from 'next'

import { FeaturedNewsBlock } from '@/blocks/FeaturedNews/Component'
import { LatestNews } from '@/components/LatestNews'
import { NewsCard, PostCardData } from '@/components/NewsCard'
import {
  fetchFallbackFeatured,
  fetchPostsByCategory,
  fetchLatestNews,
} from '@/utilities/fetchHomePosts'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Category, Media, Post } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getCachedGlobal('home', 1)()
  return {
    title: homeData.hero_title ?? 'Portal de Notícias',
    description: homeData.hero_subtitle ?? undefined,
  }
}

export default async function HomePage() {
  // Fetch the Home global (cached by tag 'global_home')
  const homeData = await getCachedGlobal('home', 2)()

  // Determine if featured posts are configured
  const hasFeatured = Array.isArray(homeData.featured_posts) && homeData.featured_posts.length > 0

  // Prepare parallel queries
  const categorySections = (homeData.category_sections ?? []).slice(0, 3)
  const latestLimit = Math.min(Math.max(homeData.latest_news_limit ?? 6, 1), 12)

  const featuredPostIds = hasFeatured
    ? (homeData.featured_posts as Post[]).map((p) => String(p.id))
    : []

  // Run parallel queries: fallback featured (if needed) + one per category section
  const [fallbackFeatured, ...categoryResults] = await Promise.all([
    hasFeatured ? Promise.resolve(null) : fetchFallbackFeatured(),
    ...categorySections.map((section) =>
      fetchPostsByCategory(
        typeof section.category === 'object'
          ? String((section.category as Category).id)
          : String(section.category),
        section.limit ?? 4,
      ),
    ),
  ])

  // 5. Resolve final featured IDs for exclusion in latest news
  const resolvedFeaturedIds = hasFeatured
    ? featuredPostIds
    : (fallbackFeatured ?? []).map((p) => String(p.id))

  // 6. Fetch latest news (after resolving featured IDs)
  const latestPosts = await fetchLatestNews(resolvedFeaturedIds, latestLimit)

  // 7. Resolve final featured posts array
  const featuredPosts = hasFeatured
    ? (homeData.featured_posts as Post[]).slice(0, 4)
    : (fallbackFeatured ?? [])

  return (
    <main>
      <FeaturedNewsBlock posts={featuredPosts as PostCardData[]} />

      {categorySections.map((section, i) => {
        const cat = typeof section.category === 'object' ? (section.category as Category) : null
        const posts = categoryResults[i] ?? []
        if (!cat || posts.length === 0) return null
        return (
          <section key={String(cat.id)} className="py-10 px-6 md:px-12 lg:py-14 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">{cat.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      <LatestNews posts={latestPosts} />
    </main>
  )
}
