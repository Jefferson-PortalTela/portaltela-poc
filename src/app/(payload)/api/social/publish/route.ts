import config from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

const supportedPlatforms = ['facebook', 'instagram', 'linkedin', 'x'] as const

type SupportedPlatform = (typeof supportedPlatforms)[number]

type PublishRequestBody = {
  message?: string
  platform?: SupportedPlatform
  postId?: number | string
}

export async function POST(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return Response.json({ error: 'Action forbidden.' }, { status: 403 })
  }

  let body: PublishRequestBody

  try {
    body = (await req.json()) as PublishRequestBody
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { message = '', platform, postId } = body

  if (!postId) {
    return Response.json({ error: 'postId is required.' }, { status: 400 })
  }

  if (!platform || !supportedPlatforms.includes(platform)) {
    return Response.json({ error: 'Unsupported platform.' }, { status: 400 })
  }

  try {
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 0,
      select: {
        publishedAt: true,
        slug: true,
        title: true,
      },
    })

    const publicURL = `${getServerSideURL()}/posts/${post.slug}`
    const suggestedText = message.trim() || `${post.title}\n\n${publicURL}`

    return Response.json({
      mocked: true,
      preview: {
        platform,
        postId: post.id,
        suggestedText,
        title: post.title,
        url: publicURL,
      },
      success: true,
    })
  } catch (error) {
    payload.logger.error({ err: error, message: 'Error preparing social publish preview' })
    return Response.json({ error: 'Unable to prepare social publish preview.' }, { status: 500 })
  }
}
