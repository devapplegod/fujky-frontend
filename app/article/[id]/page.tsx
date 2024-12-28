import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchArticleById } from "@/lib/database";
import { Header } from '@/components/header'
import { ArticleRating } from '@/components/article-rating'
import { Key } from 'react'
import { getPopularityData } from "@/lib/ratings"

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound()
  }
  
  const popularityData = await getPopularityData(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 md:pt-20 md:pl-20">
        <Link href="/">
          <Button 
            variant="outline" 
            size="lg" 
            className="fixed bottom-4 right-4 z-50 md:top-4 md:left-4 md:right-auto"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back
          </Button>
        </Link>
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{article.generated.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-400">
              <p>autor: {"Fujky.cz"} | datum: {article.generated.scraped.date}</p>
              <p>zdroj: <Link className='underline' target="_blank" href={article.generated.scraped.url}>{article.generated.scraped.publisher}</Link></p>
            </div>
            <Badge 
              className="text-white font-semibold"
              style={{ backgroundColor: popularityData.color }}
            >
              {popularityData.text}
            </Badge>
          </div>
          <div className="relative aspect-video mb-6">
            <Image
              src={article.generated.image}
              alt={article.generated.title}
              fill
              className="object-cover rounded-lg"
            />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Ilustrační obrázek
            </span>
          </div>
          <div className="prose prose-invert max-w-none">
            {article.generated.text.split('\n').map((paragraph: string, index: Key) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 mb-16 md:mb-0">
            <ArticleRating articleId={article.id} />
          </div>
        </article>
      </div>
    </div>
  )
}

