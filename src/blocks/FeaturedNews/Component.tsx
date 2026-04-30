import React from 'react'

import { NewsCard, type PostCardData } from '@/components/NewsCard'

interface FeaturedNewsBlockProps {
  posts: PostCardData[]
}

export const FeaturedNewsBlock: React.FC<FeaturedNewsBlockProps> = ({ posts }) => {
  const displayPosts = posts.slice(0, 4)
  return (
    <section className="py-10 px-6 md:px-12 lg:py-14 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Destaques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
