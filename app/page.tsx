import { Header } from '@/components/header';
import { NewsCard } from '@/components/news-card'
import { fetchRecentArticles } from "@/lib/database";
import { Article } from '@/types';

export default async function Page() {

  const articlesData: Article[] = await fetchRecentArticles(32);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articlesData.map((article: Article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.generated.title}
              imageUrl={article.generated.image}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

