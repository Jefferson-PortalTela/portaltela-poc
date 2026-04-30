import React from 'react'

import { NewsCard, type PostCardData } from '@/components/NewsCard'

interface LatestNewsProps {
  posts: PostCardData[]
}

export const LatestNews: React.FC<LatestNewsProps> = ({ posts }) => {
  return (
    <section className="py-10 px-6 md:px-12 lg:py-14 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma notícia disponível no momento</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
