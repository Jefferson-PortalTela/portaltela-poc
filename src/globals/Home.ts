import type { GlobalConfig } from 'payload'

import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  fields: [
    {
      name: 'hero_title',
      type: 'text',
      label: 'Título do Hero',
    },
    {
      name: 'hero_subtitle',
      type: 'textarea',
      label: 'Subtítulo do Hero',
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de Fundo do Hero',
    },
    {
      name: 'hero_post',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Notícia Vinculada ao Hero',
    },
    {
      name: 'featured_posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 4,
      label: 'Posts em Destaque',
    },
    {
      name: 'category_sections',
      type: 'array',
      maxRows: 3,
      label: 'Seções por Categoria',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Categoria',
        },
        {
          name: 'limit',
          type: 'number',
          min: 1,
          max: 10,
          defaultValue: 4,
          label: 'Quantidade de Posts',
        },
      ],
    },
    {
      name: 'latest_news_limit',
      type: 'number',
      min: 1,
      max: 12,
      defaultValue: 6,
      label: 'Quantidade de Últimas Notícias',
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
