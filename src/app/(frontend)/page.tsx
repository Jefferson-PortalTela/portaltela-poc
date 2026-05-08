import type { Metadata } from 'next'

import {
  PortalHomePage,
  type CategoryShelfData,
  type EconomicIndicator,
  type HomeStory,
  type WeatherForecast,
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
      ? post.categories.map((category) => (typeof category === 'object' ? category : String(category)))
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
    { platform: 'X', handle: '@portaltela', sentiment: 'Aceleracao positiva', engagement: '+2.4k mencoes' },
    { platform: 'Instagram', handle: '@portaltela.news', sentiment: 'Salvos em alta', engagement: '+1.1k compartilhamentos' },
    { platform: 'Threads', handle: '@portaltela.debate', sentiment: 'Conversas quentes', engagement: '+820 respostas' },
  ]

  return posts.slice(0, 3).map((post, index) => {
    const tone = platforms[index % platforms.length]

    return {
      id: `${tone.platform.toLowerCase()}-${post.id}`,
      platform: tone.platform,
      handle: tone.handle,
      sentiment: tone.sentiment,
      engagement: tone.engagement,
      quote: `"${post.title}" segue entre os assuntos mais comentados por causa do impacto direto no cotidiano e nos proximos desdobramentos da pauta.`,
      relatedStory: post,
    }
  })
}

const buildInitialComments = (posts: HomeStory[]) => {
  const names = [
    ['Mariana Costa', 'Assinante premium'],
    ['Joao Ribeiro', 'Leitor fiel'],
    ['Camila Santos', 'Editora convidada'],
  ]

  return posts.slice(0, 3).map((post, index) => ({
    id: `seed-comment-${post.id}`,
    author: names[index]?.[0] || 'Leitor do portal',
    role: names[index]?.[1] || 'Comunidade Portal Tela',
    message: `Boa cobertura sobre ${post.title.toLowerCase()}. O texto entrega contexto rapido e deixa claro o que muda daqui para frente.`,
    createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 75).toISOString(),
    likes: 18 - index * 3,
  }))
}

const economicIndicators: EconomicIndicator[] = [
  {
    id: 'ibovespa',
    label: 'Ibovespa',
    value: '128.450 pts',
    change: '+0,84%',
    note: 'Acoes e bancos',
    direction: 'up',
  },
  {
    id: 'dolar',
    label: 'Dolar comercial',
    value: 'R$ 5,12',
    change: '-0,37%',
    note: 'Cambio',
    direction: 'down',
  },
  {
    id: 'euro',
    label: 'Euro',
    value: 'R$ 5,58',
    change: '-0,12%',
    note: 'Moedas globais',
    direction: 'down',
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    value: 'US$ 63,4 mil',
    change: '+1,92%',
    note: 'Criptoativos',
    direction: 'up',
  },
  {
    id: 'selic',
    label: 'Selic',
    value: '10,50% ao ano',
    change: 'Estavel',
    note: 'Juros basicos',
    direction: 'flat',
  },
]

const weatherForecast: WeatherForecast = {
  city: 'Sao Paulo, SP',
  temperature: '24°C',
  conditionLabel: 'Sol entre nuvens ao longo da tarde',
  feelsLike: '26°C',
  humidity: '68%',
  wind: '12 km/h',
  updatedAt: '12h40',
  days: [
    {
      id: 'qui',
      day: 'Qui',
      condition: 'partly-cloudy',
      high: '26°C',
      low: '18°C',
      rainChance: '20%',
    },
    {
      id: 'sex',
      day: 'Sex',
      condition: 'rain',
      high: '23°C',
      low: '17°C',
      rainChance: '70%',
    },
    {
      id: 'sab',
      day: 'Sab',
      condition: 'cloudy',
      high: '21°C',
      low: '15°C',
      rainChance: '35%',
    },
    {
      id: 'dom',
      day: 'Dom',
      condition: 'sunny',
      high: '25°C',
      low: '16°C',
      rainChance: '10%',
    },
  ],
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

  const heroPost = normalizePost(homeData.hero_post as Post | number | null | undefined) ?? featuredPosts[0] ?? null
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
  const supportingStories = uniquePosts(
    editorialPool.filter((post) => post.id !== heroPost?.id),
  )
  const sideStories = supportingStories.slice(0, 4)
  const trendingStories = uniquePosts([...sideStories, ...latestPool, ...supportingStories]).slice(0, 5)
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
        (await fetchPostsByCategory(category.id, category.limit)).map((post) => normalizePost(post)),
      ),
    })),
  )

  const categoryShelves =
    categoryResults.filter((section) => section.posts.length > 0).length > 0
      ? categoryResults.filter((section) => section.posts.length > 0)
      : buildFallbackShelves(editorialPool)

  const socialBuzz = buildSocialBuzz(uniquePosts([heroPost, ...sideStories, ...latestPool]))
  const initialComments = buildInitialComments(uniquePosts([heroPost, ...latestPool]))

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
      economicIndicators={economicIndicators}
      weatherForecast={weatherForecast}
      initialComments={initialComments}
      latestStories={latestStories}
      principalStories={principalStories}
      sideStories={sideStories}
      socialBuzz={socialBuzz}
      trendingStories={trendingStories}
    />
  )
}
