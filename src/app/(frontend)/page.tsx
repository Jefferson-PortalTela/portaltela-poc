import type { Metadata } from 'next'

import {
  PortalHomePage,
  type CategoryShelfData,
  type HomeStory,
} from '@/components/home/PortalHomePage'
import {
  fetchFallbackFeatured,
  fetchLatestNews,
  fetchPostsByCategory,
} from '@/utilities/fetchHomePosts'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Category, Home, Media, Post } from '@/payload-types'

const uniquePosts = (posts: Array<HomeStory | null | undefined>) => {
  const seen = new Set<string>()

  return posts.filter((post): post is HomeStory => {
    if (!post?.id || seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })
}

const normalizePost = (post: HomeStory | Post | number | null | undefined): HomeStory | null => {
  if (!post || typeof post !== 'object') return null

  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    heroImage:
      post.heroImage && typeof post.heroImage === 'object' ? (post.heroImage as Media) : null,
    categories: Array.isArray(post.categories)
      ? post.categories.map((category) =>
          typeof category === 'object' ? category : String(category),
        )
      : null,
    meta: 'meta' in post ? post.meta : null,
    populatedAuthors: 'populatedAuthors' in post ? post.populatedAuthors : null,
    publishedAt: post.publishedAt ?? null,
  }
}

const getCategoryPool = (posts: HomeStory[]) => {
  const pool = new Map<string, { id: string; title: string; slug?: string | null }>()

  posts.forEach((post) => {
    post.categories?.forEach((category) => {
      if (typeof category === 'object') {
        pool.set(String(category.id), {
          id: String(category.id),
          title: (category as Category).title,
          slug: (category as Category).slug,
        })
      }
    })
  })

  return [...pool.values()]
}

const buildFallbackShelves = (posts: HomeStory[]): CategoryShelfData[] => {
  const groups = [
    { id: 'edicao-do-dia', title: 'Edicao do dia', posts: posts.slice(0, 4) },
    { id: 'radar-do-portal', title: 'Radar do portal', posts: posts.slice(1, 5) },
    { id: 'mais-lidas', title: 'Mais lidas', posts: posts.slice(2, 6) },
    { id: 'para-ficar-de-olho', title: 'Para ficar de olho', posts: posts.slice(3, 7) },
  ]

  return groups.filter((group) => group.posts.length > 0)
}

const buildSocialBuzz = (posts: HomeStory[]) => {
  const platforms = [
    {
      platform: 'Instagram',
      handle: '@portaltela.news',
      sentiment: 'Salvos em alta',
      engagement: '+1.1k compartilhamentos',
    },
    {
      platform: 'X',
      handle: '@portaltela',
      sentiment: 'Debate acelerado',
      engagement: '+2.4k mencoes',
    },
    {
      platform: 'Threads',
      handle: '@portaltela.debate',
      sentiment: 'Conversas quentes',
      engagement: '+820 respostas',
    },
    {
      platform: 'TikTok',
      handle: '@portaltela.video',
      sentiment: 'Clipes em giro',
      engagement: '+640 comentarios',
    },
    {
      platform: 'Facebook',
      handle: '@tela.portal',
      sentiment: 'Compartilhamentos em alta',
      engagement: '+410 interacoes',
    },
    {
      platform: 'Instagram',
      handle: '@tela.portal',
      sentiment: 'Stories em giro',
      engagement: '+1.9k reproducoes',
    },
  ]

  return posts.slice(0, 6).map((post, index) => {
    const tone = platforms[index % platforms.length]

    return {
      id: `${tone.platform.toLowerCase()}-${post.id}`,
      platform: tone.platform,
      handle: tone.handle,
      sentiment: tone.sentiment,
      engagement: tone.engagement,
      quote: `${post.title} segue puxando reacoes e comentarios por causa do impacto imediato da pauta e dos proximos desdobramentos.`,
      relatedStory: post,
    }
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getCachedGlobal('home', 1)()

  return {
    title: homeData.hero_title ?? 'Portal Tela | Noticias que movem a conversa',
    description:
      homeData.hero_subtitle ??
      'Cobertura de politica, economia, tecnologia, cultura e esportes com atualizacao continua.',
  }
}

export default async function HomePage() {
  const homeData = (await getCachedGlobal('home', 2)()) as Home
  const configuredFeatured = Array.isArray(homeData.featured_posts)
    ? uniquePosts(homeData.featured_posts.map((post) => normalizePost(post as Post | number)))
    : []

  const fallbackFeatured = configuredFeatured.length > 0 ? [] : await fetchFallbackFeatured()
  const featuredPosts =
    configuredFeatured.length > 0
      ? configuredFeatured
      : uniquePosts(fallbackFeatured.map((post) => normalizePost(post)))

  const heroPost =
    normalizePost(homeData.hero_post as Post | number | null | undefined) ??
    featuredPosts[0] ??
    null
  const heroTitle = homeData.hero_title ?? heroPost?.title ?? 'Portal Tela'
  const heroSubtitle =
    homeData.hero_subtitle ??
    heroPost?.meta?.description ??
    'Cobertura em atualizacao continua com analises, bastidores e os principais desdobramentos do dia.'

  const featuredIds = uniquePosts([heroPost, ...featuredPosts]).map((post) => post.id)
  const latestPool = uniquePosts(
    (await fetchLatestNews(featuredIds, 18)).map((post) => normalizePost(post)),
  )

  const editorialPool = uniquePosts([heroPost, ...featuredPosts, ...latestPool])
  const supportingStories = uniquePosts(editorialPool.filter((post) => post.id !== heroPost?.id))
  const sideStories = supportingStories.slice(0, 4)
  const principalStories = supportingStories.slice(0, 8)
  const latestStories = uniquePosts(latestPool).slice(0, 8)

  const configuredSections = (homeData.category_sections ?? []).slice(0, 4)
  const configuredCategories = configuredSections
    .map((section) =>
      typeof section.category === 'object'
        ? {
            id: String((section.category as Category).id),
            title: (section.category as Category).title,
            slug: (section.category as Category).slug,
            limit: section.limit ?? 4,
          }
        : null,
    )
    .filter(Boolean) as Array<{ id: string; title: string; slug?: string | null; limit: number }>

  const fallbackCategories = getCategoryPool(editorialPool)
    .filter((category) => !configuredCategories.some((item) => item.id === category.id))
    .slice(0, Math.max(4 - configuredCategories.length, 0))
    .map((category) => ({ ...category, limit: 4 }))

  const shelfCategories = [...configuredCategories, ...fallbackCategories].slice(0, 4)

  const categoryResults = await Promise.all(
    shelfCategories.map(async (category) => ({
      id: category.id,
      title: category.title,
      slug: category.slug,
      posts: uniquePosts(
        (await fetchPostsByCategory(category.id, category.limit)).map((post) =>
          normalizePost(post),
        ),
      ),
    })),
  )

  const categoryShelves =
    categoryResults.filter((section) => section.posts.length > 0).length > 0
      ? categoryResults.filter((section) => section.posts.length > 0)
      : buildFallbackShelves(editorialPool)

  const socialBuzz = buildSocialBuzz(uniquePosts([heroPost, ...sideStories, ...latestPool]))

  return (
    <PortalHomePage
      categoryShelves={categoryShelves}
      heroImage={
        homeData.hero_image && typeof homeData.hero_image === 'object'
          ? (homeData.hero_image as Media)
          : undefined
      }
      heroStory={heroPost}
      heroSubtitle={heroSubtitle}
      heroTitle={heroTitle}
      latestStories={latestStories}
      principalStories={principalStories}
      sideStories={sideStories}
      socialBuzz={socialBuzz}
    />
  )
}
