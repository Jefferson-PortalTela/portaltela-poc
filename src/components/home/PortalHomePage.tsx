import Link from 'next/link'

import { CommentsSection, type CommunityComment } from '@/components/home/CommentsSection'
import { Media as MediaComponent } from '@/components/Media'
import type { PostCardData } from '@/components/NewsCard'
import { Button } from '@/components/ui/button'
import type { Category, Media } from '@/payload-types'
import { formatDatePtBR } from '@/utilities/formatDatePtBR'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Cloud,
  CloudRain,
  CloudSun,
  Minus,
  SunMedium,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export interface HomeStory extends PostCardData {
  heroImage?: Media | null
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

export interface EconomicIndicator {
  id: string
  label: string
  value: string
  change: string
  note: string
  direction: 'up' | 'down' | 'flat'
}

export interface WeatherForecastDay {
  id: string
  day: string
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain'
  high: string
  low: string
  rainChance: string
}

export interface WeatherForecast {
  city: string
  temperature: string
  conditionLabel: string
  feelsLike: string
  humidity: string
  wind: string
  updatedAt: string
  days: WeatherForecastDay[]
}

type PortalHomePageProps = {
  heroTitle: string
  heroSubtitle: string
  heroStory: HomeStory | null
  heroImage?: Media | null
  sideStories: HomeStory[]
  trendingStories: HomeStory[]
  principalStories: HomeStory[]
  latestStories: HomeStory[]
  categoryShelves: CategoryShelfData[]
  socialBuzz: SocialBuzzItem[]
  economicIndicators: EconomicIndicator[]
  weatherForecast: WeatherForecast
  initialComments: CommunityComment[]
}

const serifTitleClass = "font-[Georgia,'Times_New_Roman',serif]"
const sectionRuleClass = 'border-t border-slate-300/80 dark:border-white/10'
const cardClass =
  'border border-slate-200/90 bg-white dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(19,23,37,0.98),rgba(10,13,22,0.98))] dark:shadow-[0_24px_70px_rgba(2,6,18,0.35)]'
const mutedClass = 'text-slate-600 dark:text-white/70'
const metaClass = 'text-slate-500 dark:text-white/50'
const headlineClass = `font-[Georgia,'Times_New_Roman',serif] text-slate-950 dark:text-[#f7f3ff]`
const accentChipClass =
  'inline-flex items-center gap-2 rounded-full border border-[#6f2dbd]/18 bg-[#6f2dbd]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f2dbd] dark:border-[#6f2dbd]/35 dark:bg-[#6f2dbd]/14 dark:text-[#d5b9ef]'

const weatherIconMap: Record<WeatherForecastDay['condition'], LucideIcon> = {
  sunny: SunMedium,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
}

const platformAccentMap: Record<string, string> = {
  X: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  Instagram: 'bg-[linear-gradient(135deg,#f97316,#ec4899,#6f2dbd)] text-white',
  Threads: 'bg-slate-900 text-white dark:bg-white dark:text-slate-950',
  TikTok: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
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

const SectionHeading = ({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string
  title: string
  description: string
  href?: string
}) => {
  return (
    <div className={`${sectionRuleClass} pt-5`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className={accentChipClass}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {eyebrow}
          </p>
          <h2 className={`mt-3 text-4xl leading-none ${headlineClass}`}>{title}</h2>
          <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>{description}</p>
        </div>

        {href ? (
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-white/72 dark:hover:text-white"
            href={href}
          >
            Ver tudo
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}

const HeroStory = ({
  heroStory,
  heroTitle,
  heroSubtitle,
  heroImage,
}: {
  heroStory: HomeStory | null
  heroTitle: string
  heroSubtitle: string
  heroImage?: Media | null
}) => {
  const displayImage = heroStory?.heroImage ?? heroImage

  return (
    <article className={`${cardClass} overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_70px_rgba(2,6,18,0.42)]`}>
      <div className="grid xl:grid-cols-[1.15fr_minmax(320px,0.85fr)]">
        <div className="relative min-h-[340px] border-b border-slate-200 dark:border-white/10 xl:min-h-[520px] xl:border-r xl:border-b-0">
          {displayImage ? (
            <MediaComponent
              resource={displayImage}
              alt={displayImage.alt || heroStory?.title || heroTitle}
              fill
              imgClassName="object-cover"
              size="(max-width: 1280px) 100vw, 58vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#dbeafe,#f8fafc)] dark:bg-[linear-gradient(135deg,#1a2337,#0b0f18)]" />
          )}
        </div>

        <div className="flex flex-col justify-between p-6 lg:p-8">
          <div>
            <p className={accentChipClass}>
              <TrendingUp className="size-3" />
              {getCategoryLabel(heroStory)}
            </p>
            <h1 className={`mt-4 text-4xl leading-tight lg:text-5xl ${headlineClass}`}>
              {heroStory?.title || heroTitle}
            </h1>
            <p className={`mt-5 text-base leading-8 ${mutedClass}`}>
              {getStoryExcerpt(heroStory, heroSubtitle)}
            </p>
          </div>

          <div className="mt-8">
            <div className={`flex flex-wrap items-center gap-4 text-sm ${metaClass}`}>
              <span>Por {getAuthorLine(heroStory)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/30" />
              <span>{getRelativeTime(heroStory?.publishedAt)}</span>
            </div>

            <div className="mt-6">
              <Button
                asChild
                className="h-11 rounded-none bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-[#6f2dbd] dark:text-white dark:hover:bg-[#5f26a2]"
              >
                <Link href={getStoryHref(heroStory)}>
                  Ler reportagem
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
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

const StoryTicker = ({ stories }: { stories: HomeStory[] }) => {
  if (stories.length === 0) return null

  return (
    <div className={`${sectionRuleClass} mt-6 py-4`}>
      <div className="grid gap-4 lg:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:items-start">
        <div>
          <p className={accentChipClass}>
            Em destaque
          </p>
        </div>

        {stories.slice(0, 4).map((story) => (
          <Link
            className="border-l border-slate-200 pl-4 text-sm leading-6 text-slate-700 transition-colors hover:text-slate-950 dark:border-white/10 dark:text-white/72 dark:hover:text-white"
            href={getStoryHref(story)}
            key={story.id}
          >
            {story.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

const SideStoriesPanel = ({ stories }: { stories: HomeStory[] }) => {
  return (
    <aside className={`${cardClass} bg-[linear-gradient(180deg,#ffffff,rgba(245,243,255,0.55))] p-6 dark:bg-[linear-gradient(180deg,rgba(22,26,43,0.98),rgba(11,14,24,0.98))]`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={accentChipClass}>
            Leitura recomendada
          </p>
          <h2 className={`mt-3 text-3xl leading-none ${headlineClass}`}>Para acompanhar agora</h2>
        </div>
      </div>

      <div className="mt-4">
        {stories.length > 0 ? (
          stories.slice(0, 4).map((story, index) => (
            <CompactStory key={story.id} showImage={index === 0} story={story} />
          ))
        ) : (
          <div className={`py-4 text-sm ${mutedClass}`}>
            Mais destaques vao aparecer aqui assim que novas historias forem publicadas.
          </div>
        )}
      </div>
    </aside>
  )
}

const EditorialCard = ({ story, featured = false }: { story: HomeStory; featured?: boolean }) => {
  return (
    <article className={`${cardClass} overflow-hidden transition-shadow hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_24px_64px_rgba(2,6,18,0.46)]`}>
      {story.heroImage ? (
        <div className={`relative border-b border-slate-200 dark:border-white/10 ${featured ? 'aspect-[16/9]' : 'aspect-[16/11]'}`}>
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

const CategoryShelf = ({ shelf }: { shelf: CategoryShelfData }) => {
  const leadStory = shelf.posts[0]

  return (
    <article className={`${cardClass} bg-[linear-gradient(180deg,#ffffff,rgba(248,250,252,0.92))] p-5 dark:bg-[linear-gradient(180deg,rgba(19,23,37,0.98),rgba(9,12,20,0.98))]`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f2dbd] dark:text-[#d5b9ef]">
        {shelf.title}
      </p>

      {leadStory ? (
        <div className="mt-4">
          {leadStory.heroImage ? (
            <div className="relative aspect-[16/10] overflow-hidden border border-slate-200 dark:border-white/10">
              <MediaComponent
                resource={leadStory.heroImage}
                alt={leadStory.heroImage.alt || leadStory.title}
                fill
                imgClassName="object-cover"
                size="(max-width: 1280px) 100vw, 24vw"
              />
            </div>
          ) : null}

          <h3 className={`mt-4 text-3xl leading-tight ${headlineClass}`}>
            <Link href={getStoryHref(leadStory)}>{leadStory.title}</Link>
          </h3>
          <p className={`mt-2 text-sm ${metaClass}`}>{getRelativeTime(leadStory.publishedAt)}</p>
        </div>
      ) : null}

      <div className="mt-4">
        {shelf.posts.slice(1, 4).map((story) => (
          <CompactStory key={story.id} showImage={false} story={story} />
        ))}
      </div>
    </article>
  )
}

const EconomicPanel = ({ indicators }: { indicators: EconomicIndicator[] }) => {
  return (
    <div className={`${cardClass} dark:bg-[linear-gradient(180deg,rgba(20,25,40,0.98),rgba(9,12,20,0.98))] p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/42">
        Mercados
      </p>
      <h3 className={`mt-3 text-3xl leading-none ${headlineClass}`}>Indicadores</h3>

      <div className="mt-5 space-y-3">
        {indicators.map((indicator) => {
          const toneClass =
            indicator.direction === 'up'
              ? 'text-emerald-700 dark:text-emerald-200'
              : indicator.direction === 'down'
                ? 'text-rose-700 dark:text-rose-200'
                : 'text-slate-500 dark:text-white/65'

          const Icon =
            indicator.direction === 'up'
              ? ArrowUpRight
              : indicator.direction === 'down'
                ? ArrowDownRight
                : Minus

          return (
            <article
              className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0 dark:border-white/10"
              key={indicator.id}
            >
              <div>
                <p className={`text-sm font-semibold ${headlineClass}`}>{indicator.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-white/42">
                  {indicator.note}
                </p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-semibold ${headlineClass}`}>{indicator.value}</p>
                <p className={`mt-1 inline-flex items-center gap-1 text-sm ${toneClass}`}>
                  <Icon className="size-3.5" />
                  {indicator.change}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

const WeatherPanel = ({ forecast }: { forecast: WeatherForecast }) => {
  const CurrentIcon = weatherIconMap[forecast.days[0]?.condition ?? 'partly-cloudy']

  return (
    <div className={`${cardClass} dark:bg-[linear-gradient(180deg,rgba(20,27,43,0.98),rgba(9,12,20,0.98))] p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/42">
            Tempo
          </p>
          <h3 className={`mt-3 text-3xl leading-none ${headlineClass}`}>Previsao</h3>
        </div>

        <div className="text-right">
          <p className={`text-sm font-semibold ${headlineClass}`}>{forecast.updatedAt}</p>
          <p className={`mt-1 text-xs ${metaClass}`}>Atualizado</p>
        </div>
      </div>

      <div className="mt-5 border-y border-slate-200 py-5 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-sky-200">{forecast.city}</p>
            <p className={`mt-3 text-5xl ${headlineClass}`}>{forecast.temperature}</p>
            <p className={`mt-2 text-sm ${mutedClass}`}>{forecast.conditionLabel}</p>
          </div>

          <div className="rounded-full bg-slate-100 p-4 text-slate-700 dark:bg-[#6f2dbd]/14 dark:text-[#e7d8f7]">
            <CurrentIcon className="size-8" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { id: 'feel', label: 'Sensacao', value: forecast.feelsLike },
            { id: 'hum', label: 'Umidade', value: forecast.humidity },
            { id: 'wind', label: 'Vento', value: forecast.wind },
          ].map((item) => (
            <div className="border-l border-slate-200 pl-3 first:border-l-0 first:pl-0 dark:border-white/10" key={item.id}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-white/42">
                {item.label}
              </p>
              <p className={`mt-2 text-sm font-semibold ${headlineClass}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {forecast.days.map((day) => {
          const Icon = weatherIconMap[day.condition]

          return (
            <article
              className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0 dark:border-white/10"
              key={day.id}
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-slate-500 dark:text-white/65" />
                <div>
                  <p className={`text-sm font-semibold ${headlineClass}`}>{day.day}</p>
                  <p className={`text-xs ${metaClass}`}>Chuva {day.rainChance}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-semibold ${headlineClass}`}>{day.high}</p>
                <p className={`text-sm ${metaClass}`}>{day.low}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

const SocialBuzz = ({ items }: { items: SocialBuzzItem[] }) => {
  return (
    <section className={`${cardClass} bg-[linear-gradient(180deg,#ffffff,rgba(250,245,255,0.7))] p-6 dark:bg-[linear-gradient(180deg,rgba(26,19,39,0.98),rgba(10,13,22,0.98))]`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={accentChipClass}>
            Vozes da rede
          </p>
          <h2 className={`mt-3 text-3xl leading-none ${headlineClass}`}>O que circula</h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/10" key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold ${
                    platformAccentMap[item.platform] ??
                    'bg-[#6f2dbd] text-white dark:bg-[#6f2dbd] dark:text-white'
                  }`}
                >
                  {item.platform}
                </span>
                <p className={`text-sm font-semibold ${headlineClass}`}>
                  <span className={metaClass}>{item.handle}</span>
                </p>
              </div>
              <span className={`text-xs ${metaClass}`}>{item.engagement}</span>
            </div>
            <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>{item.quote}</p>
            {item.relatedStory ? (
              <Link
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-white/72 dark:hover:text-white"
                href={getStoryHref(item.relatedStory)}
              >
                Ver materia relacionada
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

const LiveUpdatesPanel = ({ stories }: { stories: HomeStory[] }) => {
  return (
    <aside className={`${cardClass} dark:bg-[linear-gradient(180deg,rgba(17,21,35,0.98),rgba(8,11,18,0.98))] p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/42">
        Agora no portal
      </p>
      <h3 className={`mt-3 text-3xl leading-none ${headlineClass}`}>Atualizacoes</h3>

      <div className="mt-4">
        {stories.length > 0 ? (
          stories.slice(0, 4).map((story) => (
            <CompactStory key={story.id} showImage={false} story={story} />
          ))
        ) : (
          <div className={`py-4 text-sm ${mutedClass}`}>
            Novas atualizacoes entram aqui conforme a cobertura for sendo publicada.
          </div>
        )}
      </div>
    </aside>
  )
}

const LatestRadar = ({
  stories,
  economicIndicators,
  weatherForecast,
}: {
  stories: HomeStory[]
  economicIndicators: EconomicIndicator[]
  weatherForecast: WeatherForecast
}) => {
  if (stories.length === 0) return null

  return (
    <section className="mt-16">
      <SectionHeading
        eyebrow="Ultimo giro"
        title="Ultimas do portal"
        description="Acompanhe as atualizacoes de politica, economia, tecnologia, cultura e esportes em tempo real."
        href="/posts"
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <div className="grid gap-6 md:grid-cols-2">
          {stories.slice(0, 4).map((story, index) => (
            <EditorialCard featured={index === 0} key={story.id} story={story} />
          ))}
        </div>

        <div className="space-y-6">
          <LiveUpdatesPanel stories={stories.slice(4, 8)} />
          <EconomicPanel indicators={economicIndicators} />
          <WeatherPanel forecast={weatherForecast} />
        </div>
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
  trendingStories,
  principalStories,
  latestStories,
  categoryShelves,
  socialBuzz,
  economicIndicators,
  weatherForecast,
  initialComments,
}: PortalHomePageProps) => {
  return (
    <main className="bg-[linear-gradient(180deg,#f8f5ff_0%,#fffdf8_10%,#ffffff_24%,#ffffff_100%)] pb-20 text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(111,45,189,0.16),_transparent_22%),linear-gradient(180deg,#060810_0%,#090d17_30%,#0a0e18_100%)] dark:text-white">
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className={`${sectionRuleClass} flex flex-wrap items-center justify-between gap-3 pb-4 text-sm ${mutedClass}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={accentChipClass}>
                Edicao principal
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/35" />
              <span>Politica, economia, tecnologia e cultura</span>
            </div>
            <Link className="inline-flex items-center gap-2 font-medium hover:text-slate-950 dark:hover:text-white" href="/posts">
              Acompanhar cobertura
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_380px]">
            <HeroStory
              heroImage={heroImage}
              heroStory={heroStory}
              heroSubtitle={heroSubtitle}
              heroTitle={heroTitle}
            />
            <SideStoriesPanel stories={sideStories} />
          </div>

          <StoryTicker stories={trendingStories} />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow="Cobertura central"
            title="Principais noticias"
            description="Os assuntos que lideram o noticiario com reportagens, analises e os desdobramentos mais recentes."
            href="/posts"
          />

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,0.85fr)]">
            {principalStories.slice(0, 5).map((story, index) => (
              <EditorialCard featured={index === 0} key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow="Explorar por interesse"
            title="Editorias"
            description="Uma navegacao mais clara por temas, com o fio principal de cada cobertura e as leituras que se conectam a ela."
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-4">
            {categoryShelves.slice(0, 4).map((shelf) => (
              <CategoryShelf key={shelf.id} shelf={shelf} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow="Comunidade"
            title="Repercussao e comentarios"
            description="As conversas que se formam em torno das reportagens, com espaco para reacao dos leitores e termometro das redes."
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <SocialBuzz items={socialBuzz} />
            <CommentsSection initialComments={initialComments} />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <LatestRadar
            economicIndicators={economicIndicators}
            stories={latestStories}
            weatherForecast={weatherForecast}
          />
        </div>
      </section>
    </main>
  )
}
