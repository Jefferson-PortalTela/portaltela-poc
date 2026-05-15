import Link from 'next/link'

import { Media as MediaComponent } from '@/components/Media'
import type { PostCardData } from '@/components/NewsCard'
import type { Category, Media } from '@/payload-types'
import { formatDatePtBR } from '@/utilities/formatDatePtBR'
import { ArrowRight, ChevronLeft, ChevronRight, Play, Share2 } from 'lucide-react'

export interface HomeStory extends PostCardData {
  heroImage?: Media | null
  meta?: {
    description?: string | null
  } | null
  populatedAuthors?:
    | {
        id?: string | null
        name?: string | null
      }[]
    | null
}

export interface CategoryShelfData {
  id: string
  title: string
  slug?: string | null
  posts: HomeStory[]
}

export interface SocialBuzzItem {
  id: string
  platform: string
  handle: string
  sentiment: string
  engagement: string
  quote: string
  relatedStory?: HomeStory | null
}

type PortalHomePageProps = {
  heroTitle: string
  heroSubtitle: string
  heroStory: HomeStory | null
  heroImage?: Media | null
  sideStories: HomeStory[]
  principalStories: HomeStory[]
  latestStories: HomeStory[]
  categoryShelves: CategoryShelfData[]
  socialBuzz: SocialBuzzItem[]
}

const cardClass =
  'border border-slate-200/90 bg-white dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(19,23,37,0.98),rgba(10,13,22,0.98))] dark:shadow-[0_24px_70px_rgba(2,6,18,0.35)]'
const mutedClass = 'text-slate-600 dark:text-white/70'
const metaClass = 'text-slate-500 dark:text-white/50'
const headlineClass = `font-[Georgia,'Times_New_Roman',serif] text-slate-950 dark:text-[#f7f3ff]`

const platformAccentMap: Record<string, string> = {
  X: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  Instagram: 'bg-[linear-gradient(135deg,#f97316,#ec4899,#6f2dbd)] text-white',
  Threads: 'bg-slate-900 text-white dark:bg-white dark:text-slate-950',
  TikTok: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  Facebook: 'bg-[#1877f2] text-white',
  Reddit: 'bg-orange-500 text-white',
  YouTube: 'bg-rose-600 text-white',
  Blog: 'bg-[#6f2dbd] text-white',
}

const getCategoryLabel = (post?: HomeStory | null) => {
  const firstCategory = post?.categories?.[0]
  if (!firstCategory) return 'Editorial'

  if (typeof firstCategory === 'object') {
    return (firstCategory as Category).title
  }

  return firstCategory
}

const getStoryHref = (post?: HomeStory | null) => {
  if (!post?.slug) return '/posts'
  return `/posts/${post.slug}`
}

const getStoryExcerpt = (post?: HomeStory | null, fallback?: string | null) => {
  if (post?.meta?.description) return post.meta.description
  if (fallback) return fallback
  return 'Acompanhe os desdobramentos, o contexto e os bastidores que movem a pauta.'
}

const getAuthorLine = (post?: HomeStory | null) => {
  const names = post?.populatedAuthors?.map((author) => author.name).filter(Boolean)
  if (names && names.length > 0) return names.join(', ')
  return 'Redacao Portal Tela'
}

const getRelativeTime = (date?: string | null) => {
  if (!date) return 'Atualizado agora'

  const diff = Math.max(Date.now() - new Date(date).getTime(), 0)
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `Ha ${Math.max(minutes, 1)} min`
  if (hours < 24) return `Ha ${hours}h`
  if (days < 7) return `Ha ${days}d`

  return formatDatePtBR(date)
}

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trimEnd()}...`
}

const getReadingTime = (post?: HomeStory | null) => {
  const text = `${post?.title ?? ''} ${getStoryExcerpt(post, '')}`.trim()
  const totalWords = text ? text.split(/\s+/).length : 0
  const minutes = Math.max(2, Math.round(totalWords / 180))

  return `${minutes} min de leitura`
}

const isDefined = <T,>(value: T | null | undefined): value is T => value != null

const HomeStripeTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4">
      <h2 className={`text-[2.15rem] leading-none sm:text-[2.45rem] ${headlineClass}`}>{title}</h2>
      <span className="mt-1 h-4 w-9 rounded-tr-md border-t-2 border-r-2 border-[#6f2dbd]/80 dark:border-[#d5b9ef]/80" />
    </div>
  )
}

const EditorialSectionLabel = ({
  title,
  subtitle,
  invert = false,
}: {
  title: string
  subtitle?: string
  invert?: boolean
}) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h2
          className={`text-[1.7rem] leading-none sm:text-[1.9rem] ${
            invert ? "font-[Georgia,'Times_New_Roman',serif] text-white" : headlineClass
          }`}
        >
          {title}
        </h2>
        <span className="mt-1 h-3.5 w-8 rounded-tr-md border-t-2 border-r-2 border-[#8f5ae8]" />
      </div>
      {subtitle ? (
        <p className={`mt-2 max-w-3xl text-sm ${invert ? 'text-white/65' : mutedClass}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

const TopStoryRow = ({
  heroStory,
  featured = false,
}: {
  heroStory: HomeStory | null
  featured?: boolean
}) => {
  if (!heroStory) return null

  const displayImage = heroStory.heroImage
  const TitleTag = featured ? 'h1' : 'h2'

  return (
    <article className="py-1 first:pt-0 last:pb-0">
      <div
        className={`grid gap-5 ${
          featured
            ? 'lg:grid-cols-[minmax(0,0.78fr)_minmax(360px,0.98fr)]'
            : 'md:grid-cols-[minmax(0,0.8fr)_minmax(300px,0.96fr)]'
        }`}
      >
        <div className="flex min-w-0 flex-col">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f5ae8] dark:text-[#d5b9ef]">
            <span className="size-1.5 rounded-full bg-current" />
            {getCategoryLabel(heroStory)}
          </p>
          <TitleTag
            className={`mt-3 leading-tight ${headlineClass} ${
              featured ? 'text-[2.3rem] lg:text-[2.55rem]' : 'text-[1.95rem] lg:text-[2.2rem]'
            }`}
          >
            <Link href={getStoryHref(heroStory)}>{heroStory.title}</Link>
          </TitleTag>
          <p className={`mt-4 max-w-[28rem] text-[0.98rem] leading-[1.55] ${mutedClass}`}>
            {getStoryExcerpt(heroStory)}
          </p>

          <div className={`mt-5 flex items-end justify-between gap-4 text-sm ${metaClass}`}>
            <p>{getRelativeTime(heroStory.publishedAt)}</p>
            <Link
              aria-label={`Abrir materia ${heroStory.title}`}
              className="inline-flex size-7 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 dark:text-white/55 dark:hover:text-white"
              href={getStoryHref(heroStory)}
            >
              <Share2 className="size-3.5" strokeWidth={1.9} />
            </Link>
          </div>
        </div>

        <div
          className={`relative overflow-hidden bg-slate-100 dark:bg-white/5 ${
            featured ? 'min-h-[260px] lg:min-h-[270px]' : 'aspect-[16/10] lg:min-h-[202px]'
          }`}
        >
          {displayImage ? (
            <MediaComponent
              resource={displayImage}
              alt={displayImage.alt || heroStory.title}
              fill
              imgClassName="object-cover"
              size={
                featured ? '(max-width: 1280px) 100vw, 36vw' : '(max-width: 1280px) 100vw, 28vw'
              }
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#e8eef8,#f8fafc)] dark:bg-[linear-gradient(135deg,#1a2337,#0b0f18)]" />
          )}
        </div>
      </div>
    </article>
  )
}

const HeroCluster = ({
  heroStory,
  heroTitle,
  heroSubtitle,
  heroImage,
  sideStories,
}: {
  heroStory: HomeStory | null
  heroTitle: string
  heroSubtitle: string
  heroImage?: Media | null
  sideStories: HomeStory[]
}) => {
  const fallbackStory =
    heroStory ??
    ({
      id: 'home-fallback',
      title: heroTitle,
      slug: '',
      heroImage,
      meta: {
        description: heroSubtitle,
      },
      categories: ['Edicao principal'],
      populatedAuthors: [{ id: 'fallback-author', name: 'Redacao Portal Tela' }],
    } satisfies HomeStory)

  const leadStories = [fallbackStory, ...sideStories.slice(0, 2)]

  return (
    <section className="space-y-8 border-b border-slate-200 pb-4 dark:border-white/10">
      {leadStories.map((story, index) => (
        <TopStoryRow featured={index === 0} heroStory={story} key={story.id} />
      ))}
    </section>
  )
}

const CompactStory = ({ story, showImage = true }: { story: HomeStory; showImage?: boolean }) => {
  return (
    <article className="border-b border-slate-200 py-4 last:border-b-0 dark:border-white/10">
      <div className={`grid gap-4 ${showImage ? 'sm:grid-cols-[120px_minmax(0,1fr)]' : ''}`}>
        {showImage ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-white/5">
            {story.heroImage ? (
              <MediaComponent
                resource={story.heroImage}
                alt={story.heroImage.alt || story.title}
                fill
                imgClassName="object-cover"
                size="220px"
              />
            ) : null}
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-white/42">
            {getCategoryLabel(story)}
          </p>
          <h3 className={`mt-2 text-2xl leading-tight ${headlineClass}`}>
            <Link href={getStoryHref(story)}>{story.title}</Link>
          </h3>
          <p className={`mt-2 text-sm ${metaClass}`}>{getRelativeTime(story.publishedAt)}</p>
        </div>
      </div>
    </article>
  )
}

const PrincipalStoriesShowcase = ({ stories }: { stories: HomeStory[] }) => {
  if (stories.length === 0) return null

  const [featuredStory, ...listStories] = stories
  const editorialQueue = (listStories.length > 0 ? listStories : [featuredStory]).slice(0, 6)

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.94fr)_minmax(360px,1.06fr)] xl:items-start">
      <div>
        <HomeStripeTitle title="Principais noticias" />

        <div className="mt-6 border-t border-slate-200 dark:border-white/10">
          {editorialQueue.map((story) => (
            <article
              className="border-b border-slate-200 py-5 last:pb-3 dark:border-white/10"
              key={story.id}
            >
              <Link
                className={`block text-[1.03rem] leading-7 transition-colors hover:text-[#6f2dbd] dark:hover:text-[#e7d8f7] ${headlineClass}`}
                href={getStoryHref(story)}
              >
                {truncateText(getStoryExcerpt(story, story.title), 128)}
              </Link>
            </article>
          ))}
        </div>
      </div>

      <article
        className={`${cardClass} overflow-hidden bg-[linear-gradient(180deg,#ffffff,rgba(248,250,252,0.96))] dark:bg-[linear-gradient(180deg,rgba(19,23,37,0.98),rgba(9,12,20,0.98))]`}
      >
        <Link className="block" href={getStoryHref(featuredStory)}>
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/5">
            {featuredStory.heroImage ? (
              <MediaComponent
                resource={featuredStory.heroImage}
                alt={featuredStory.heroImage.alt || featuredStory.title}
                fill
                imgClassName="object-cover"
                size="(max-width: 1280px) 100vw, 42vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#e8eef8,#f8fafc)] dark:bg-[linear-gradient(135deg,#1a2337,#0b0f18)]" />
            )}
          </div>
        </Link>

        <div className="p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f5ae8] dark:text-[#d5b9ef]">
            <span className="size-1.5 rounded-full bg-current" />
            Breaking news
          </p>

          <h3 className={`mt-4 text-[2rem] leading-tight sm:text-[2.25rem] ${headlineClass}`}>
            <Link href={getStoryHref(featuredStory)}>{featuredStory.title}</Link>
          </h3>

          <p className={`mt-3 text-[0.98rem] leading-7 ${mutedClass}`}>
            {getStoryExcerpt(featuredStory)}
          </p>

          <div className={`mt-5 flex flex-wrap items-center gap-3 text-sm ${metaClass}`}>
            <span>Por {getAuthorLine(featuredStory)}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/30" />
            <span>{getRelativeTime(featuredStory.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/30" />
            <span>{getReadingTime(featuredStory)}</span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-white/42">
              {getCategoryLabel(featuredStory)}
            </span>
            <Link
              aria-label={`Compartilhar materia ${featuredStory.title}`}
              className="inline-flex size-8 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 dark:text-white/55 dark:hover:text-white"
              href={getStoryHref(featuredStory)}
            >
              <Share2 className="size-4" strokeWidth={1.9} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

const SocialBuzzCards = ({ items }: { items: SocialBuzzItem[] }) => {
  if (items.length === 0) return null

  return (
    <div>
      <HomeStripeTitle title="Mais comentadas nas Redes" />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((item, index) => (
          <Link
            className={`${cardClass} flex h-full flex-col justify-between rounded-[4px] bg-white px-4 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6f2dbd]/30 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:bg-white/[0.02] dark:hover:bg-[#6f2dbd]/10`}
            href={getStoryHref(item.relatedStory)}
            key={item.id}
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[0.55rem] bg-[linear-gradient(180deg,#a855f7,#6f2dbd)] text-lg font-semibold text-white shadow-[0_12px_26px_rgba(111,45,189,0.3)]">
                {index + 1}
              </span>

              <div className="min-w-0">
                <h3 className={`text-[1.25rem] leading-[1.35] ${headlineClass}`}>
                  {truncateText(item.relatedStory?.title ?? item.quote, 64)}
                </h3>
                <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                  {truncateText(getStoryExcerpt(item.relatedStory, item.quote), 92)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-white/42">
              <span className="font-medium uppercase tracking-[0.18em]">{item.platform}</span>
              <span>{item.engagement}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const SocialBuzz = ({ items }: { items: SocialBuzzItem[] }) => {
  return (
    <aside className="xl:sticky xl:top-6">
      <div className="flex items-center gap-2">
        <h2 className={`text-sm font-semibold leading-none ${headlineClass}`}>Radar social</h2>
        <ArrowRight className="size-4 text-slate-500 dark:text-white/40" />
      </div>

      <div className="mt-5 space-y-3">
        {items.slice(0, 6).map((item) => (
          <article
            className="rounded-md border border-slate-200/90 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.03]"
            key={item.id}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold ${
                    platformAccentMap[item.platform] ??
                    'bg-[#6f2dbd] text-white dark:bg-[#6f2dbd] dark:text-white'
                  }`}
                >
                  {item.platform}
                </span>
                <span className="text-xs text-slate-500 dark:text-white/45">{item.handle}</span>
              </div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#7c3aed,#4c1d95)] text-[10px] font-semibold text-white">
                Tela
              </span>
            </div>

            <Link
              className={`mt-3 flex items-start justify-between gap-3 text-sm leading-6 ${mutedClass} transition-colors hover:text-slate-950 dark:hover:text-white`}
              href={getStoryHref(item.relatedStory)}
            >
              <span>{item.quote}</span>
              <ArrowRight className="mt-1 size-4 shrink-0 text-slate-400 dark:text-white/35" />
            </Link>
          </article>
        ))}
      </div>
    </aside>
  )
}

const EditorialCard = ({ story, featured = false }: { story: HomeStory; featured?: boolean }) => {
  return (
    <article
      className={`${cardClass} overflow-hidden transition-shadow hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_24px_64px_rgba(2,6,18,0.46)]`}
    >
      {story.heroImage ? (
        <div
          className={`relative border-b border-slate-200 dark:border-white/10 ${featured ? 'aspect-[16/9]' : 'aspect-[16/11]'}`}
        >
          <MediaComponent
            resource={story.heroImage}
            alt={story.heroImage.alt || story.title}
            fill
            imgClassName="object-cover"
            size="(max-width: 1280px) 100vw, 28vw"
          />
        </div>
      ) : null}

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f2dbd] dark:text-[#d5b9ef]">
          {getCategoryLabel(story)}
        </p>
        <h3
          className={`mt-3 leading-tight ${headlineClass} ${
            featured ? 'text-4xl' : 'text-[1.9rem]'
          }`}
        >
          <Link href={getStoryHref(story)}>{story.title}</Link>
        </h3>
        <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>{getStoryExcerpt(story)}</p>
        <p className={`mt-4 text-sm ${metaClass}`}>{getRelativeTime(story.publishedAt)}</p>
      </div>
    </article>
  )
}

const MiniFeatureRail = ({ stories }: { stories: HomeStory[] }) => {
  if (stories.length === 0) return null

  return (
    <section className="mt-16">
      <EditorialSectionLabel
        title="Olhar Cristao"
        subtitle="Uma faixa de leituras mais curtas, com chamadas enxutas e ritmo visual parecido com a referencia."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stories.slice(0, 5).map((story) => (
          <article
            className={`${cardClass} overflow-hidden rounded-[4px] bg-white transition-shadow hover:shadow-[0_20px_38px_rgba(15,23,42,0.08)]`}
            key={story.id}
          >
            <Link className="block" href={getStoryHref(story)}>
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-white/5">
                {story.heroImage ? (
                  <MediaComponent
                    resource={story.heroImage}
                    alt={story.heroImage.alt || story.title}
                    fill
                    imgClassName="object-cover"
                    size="(max-width: 1280px) 100vw, 18vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#e8eef8,#f8fafc)] dark:bg-[linear-gradient(135deg,#1a2337,#0b0f18)]" />
                )}
              </div>
            </Link>

            <div className="p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f5ae8]">
                {getCategoryLabel(story)}
              </p>
              <h3 className={`mt-2 text-[0.95rem] leading-5 ${headlineClass}`}>
                <Link href={getStoryHref(story)}>{truncateText(story.title, 64)}</Link>
              </h3>
              <div className={`mt-3 flex items-center gap-2 text-xs ${metaClass}`}>
                <span>{getRelativeTime(story.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/30" />
                <span>Por {truncateText(getAuthorLine(story), 18)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const VideoShowcase = ({ stories }: { stories: HomeStory[] }) => {
  if (stories.length === 0) return null

  const [mainStory, leftStory, rightStory] = stories

  return (
    <section className="mt-16 overflow-hidden bg-[#1a0629] px-5 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex items-center justify-between gap-4">
          <EditorialSectionLabel invert title="Videos" />
          <div className="flex items-center gap-2 text-white/70">
            <button
              aria-label="Video anterior"
              className="inline-flex size-7 items-center justify-center rounded-full border border-white/15 hover:border-white/30"
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Proximo video"
              className="inline-flex size-7 items-center justify-center rounded-full border border-white/15 hover:border-white/30"
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_180px]">
          {[leftStory, mainStory, rightStory].filter(isDefined).map((story, index) => {
            const isMain = index === 1 || (!leftStory && index === 0)

            return (
              <Link
                className={`group relative block overflow-hidden rounded-[18px] bg-white/6 ${
                  isMain ? 'min-h-[300px]' : 'min-h-[250px]'
                }`}
                href={getStoryHref(story)}
                key={`${story.id}-${isMain ? 'main' : 'side'}`}
              >
                <div className="absolute inset-0">
                  {story.heroImage ? (
                    <MediaComponent
                      resource={story.heroImage}
                      alt={story.heroImage.alt || story.title}
                      fill
                      imgClassName="object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
                      size={
                        isMain
                          ? '(max-width: 1280px) 100vw, 48vw'
                          : '(max-width: 1280px) 100vw, 16vw'
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]" />
                  )}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,14,0.12),rgba(8,4,14,0.82))]" />

                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                    <Play className="ml-0.5 size-4 fill-current" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
                    {isMain ? 'Audio' : 'Video'}
                  </p>
                  <h3
                    className={`mt-2 ${isMain ? 'max-w-xl text-[1.15rem] sm:text-[1.3rem]' : 'text-sm'} leading-6 text-white`}
                  >
                    {truncateText(story.title, isMain ? 82 : 36)}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const LatestNewsStrip = ({ stories }: { stories: HomeStory[] }) => {
  if (stories.length === 0) return null

  return (
    <section className="mt-16">
      <EditorialSectionLabel title="Ultimas noticias" />

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2 xl:grid-cols-5 dark:border-white/10">
        {stories.slice(0, 5).map((story) => (
          <Link
            className="grid gap-3 rounded-[4px] border border-slate-200/80 bg-white p-3 transition-colors hover:border-[#6f2dbd]/25 hover:bg-[#faf8ff] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
            href={getStoryHref(story)}
            key={story.id}
          >
            <div className="flex gap-3">
              <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden bg-slate-100 dark:bg-white/5">
                {story.heroImage ? (
                  <MediaComponent
                    resource={story.heroImage}
                    alt={story.heroImage.alt || story.title}
                    fill
                    imgClassName="object-cover"
                    size="96px"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f5ae8]">
                  {getCategoryLabel(story)}
                </p>
                <p className={`mt-2 text-sm leading-5 ${headlineClass}`}>
                  {truncateText(story.title, 54)}
                </p>
              </div>
            </div>

            <p className={`text-xs ${metaClass}`}>{getRelativeTime(story.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

const LifestyleShelf = ({ shelf }: { shelf?: CategoryShelfData }) => {
  if (!shelf || shelf.posts.length === 0) return null

  return (
    <section className="mt-16">
      <EditorialSectionLabel title="Vivendo melhor" />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shelf.posts.slice(0, 4).map((story) => (
          <article
            className={`${cardClass} overflow-hidden rounded-[4px] bg-white transition-shadow hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]`}
            key={story.id}
          >
            <Link className="block" href={getStoryHref(story)}>
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-white/5">
                {story.heroImage ? (
                  <MediaComponent
                    resource={story.heroImage}
                    alt={story.heroImage.alt || story.title}
                    fill
                    imgClassName="object-cover"
                    size="(max-width: 1280px) 100vw, 18vw"
                  />
                ) : null}
              </div>
            </Link>

            <div className="p-4">
              <h3 className={`text-[1rem] leading-6 ${headlineClass}`}>
                <Link href={getStoryHref(story)}>{truncateText(story.title, 64)}</Link>
              </h3>
              <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                {truncateText(getStoryExcerpt(story), 92)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const SportsShowcase = ({ shelf }: { shelf?: CategoryShelfData }) => {
  if (!shelf || shelf.posts.length === 0) return null

  const [leadStory, visualStory, ...sideStories] = shelf.posts

  return (
    <section className="mt-16">
      <EditorialSectionLabel title="Esportes" />

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.88fr)_minmax(0,0.84fr)]">
        {leadStory ? (
          <article className={`${cardClass} rounded-[4px] bg-white p-5`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f5ae8]">
              {getCategoryLabel(leadStory)}
            </p>
            <h3 className={`mt-3 text-[2rem] leading-tight ${headlineClass}`}>
              <Link href={getStoryHref(leadStory)}>{leadStory.title}</Link>
            </h3>
            <p className={`mt-4 text-sm leading-7 ${mutedClass}`}>{getStoryExcerpt(leadStory)}</p>
            <p className={`mt-6 text-sm ${metaClass}`}>
              Explore em detalhes a cobertura completa desta editoria.
            </p>
          </article>
        ) : null}

        {visualStory ? (
          <article className={`${cardClass} overflow-hidden rounded-[4px] bg-white`}>
            <Link className="block" href={getStoryHref(visualStory)}>
              <div className="relative aspect-[16/15] overflow-hidden bg-slate-100 dark:bg-white/5">
                {visualStory.heroImage ? (
                  <MediaComponent
                    resource={visualStory.heroImage}
                    alt={visualStory.heroImage.alt || visualStory.title}
                    fill
                    imgClassName="object-cover"
                    size="(max-width: 1280px) 100vw, 30vw"
                  />
                ) : null}
              </div>
            </Link>

            <div className="p-4">
              <h3 className={`text-[1rem] leading-6 ${headlineClass}`}>
                <Link href={getStoryHref(visualStory)}>{truncateText(visualStory.title, 62)}</Link>
              </h3>
            </div>
          </article>
        ) : null}

        <div className={`${cardClass} rounded-[4px] bg-white p-5`}>
          {sideStories.slice(0, 4).map((story) => (
            <article
              className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0 dark:border-white/10"
              key={story.id}
            >
              <h3 className={`text-[0.98rem] leading-6 ${headlineClass}`}>
                <Link href={getStoryHref(story)}>{truncateText(story.title, 72)}</Link>
              </h3>
              <p className={`mt-2 text-sm ${metaClass}`}>{getRelativeTime(story.publishedAt)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const TwinEditorialShelves = ({ shelves }: { shelves: CategoryShelfData[] }) => {
  if (shelves.length === 0) return null

  const titles = ['Negocios e Tecnologia', 'Policial']

  return (
    <section className="mt-16">
      <div className="grid gap-6 xl:grid-cols-2">
        {shelves.slice(0, 2).map((shelf, index) => {
          const leadStory = shelf.posts[0]
          const supportingStories = shelf.posts.slice(1, 5)

          return (
            <div key={shelf.id}>
              <EditorialSectionLabel title={titles[index] ?? shelf.title} />

              <div className="mt-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                {leadStory ? (
                  <article className={`${cardClass} overflow-hidden rounded-[4px] bg-white`}>
                    <Link className="block" href={getStoryHref(leadStory)}>
                      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-white/5">
                        {leadStory.heroImage ? (
                          <MediaComponent
                            resource={leadStory.heroImage}
                            alt={leadStory.heroImage.alt || leadStory.title}
                            fill
                            imgClassName="object-cover"
                            size="220px"
                          />
                        ) : null}
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className={`text-sm leading-6 ${mutedClass}`}>
                        {truncateText(getStoryExcerpt(leadStory), 120)}
                      </p>
                    </div>
                  </article>
                ) : null}

                <div className={`${cardClass} rounded-[4px] bg-white p-5`}>
                  {(leadStory ? [leadStory, ...supportingStories] : supportingStories)
                    .slice(0, 5)
                    .map((story) => (
                      <article
                        className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0 dark:border-white/10"
                        key={story.id}
                      >
                        <h3 className={`text-[0.98rem] leading-6 ${headlineClass}`}>
                          <Link href={getStoryHref(story)}>{truncateText(story.title, 76)}</Link>
                        </h3>
                        <p className={`mt-2 text-sm ${metaClass}`}>
                          {getRelativeTime(story.publishedAt)}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const PortalHomePage = ({
  heroTitle,
  heroSubtitle,
  heroStory,
  heroImage,
  sideStories,
  principalStories,
  latestStories,
  categoryShelves,
  socialBuzz,
}: PortalHomePageProps) => {
  const railStories = [heroStory, ...principalStories].filter(isDefined).slice(0, 5)
  const videoStories = [heroStory, principalStories[0], latestStories[0]].filter(isDefined)
  const lifestyleShelf = categoryShelves[0]
  const sportsShelf = categoryShelves[1]
  const secondaryShelves = categoryShelves.slice(2, 4)

  return (
    <main className="bg-[linear-gradient(180deg,#f8f5ff_0%,#fffdf8_10%,#ffffff_24%,#ffffff_100%)] pb-20 text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(111,45,189,0.16),_transparent_22%),linear-gradient(180deg,#060810_0%,#090d17_30%,#0a0e18_100%)] dark:text-white">
      <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.24fr)_360px] xl:items-start">
            <HeroCluster
              heroImage={heroImage}
              heroStory={heroStory}
              heroSubtitle={heroSubtitle}
              heroTitle={heroTitle}
              sideStories={sideStories}
            />
            <SocialBuzz items={socialBuzz} />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <PrincipalStoriesShowcase stories={principalStories.slice(0, 7)} />
        </div>
      </section>

      <section className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <SocialBuzzCards items={socialBuzz} />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <MiniFeatureRail stories={railStories} />
        </div>
      </section>

      <VideoShowcase stories={videoStories} />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <LatestNewsStrip stories={latestStories} />
          <LifestyleShelf shelf={lifestyleShelf} />
          <SportsShowcase shelf={sportsShelf} />
          <TwinEditorialShelves shelves={secondaryShelves} />
        </div>
      </section>
    </main>
  )
}
