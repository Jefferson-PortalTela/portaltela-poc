// src/globals/Home.ts
import { GlobalConfig } from 'payload'

const Home: GlobalConfig = {
  slug: 'home',
  fields: [
    { name: 'hero_title', type: 'text' },
    { name: 'hero_subtitle', type: 'textarea' },
    {
      name: 'featured',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 4,
    },
  ],
}

export default Home
