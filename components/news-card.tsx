import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPopularityData } from '@/lib/ratings'

interface NewsCardProps {
  id: string
  title: string
  imageUrl: string
}

export async function NewsCard({ id, title, imageUrl }: NewsCardProps) {
  const popularityData = await getPopularityData(id)
  
  return (
    <Link href={`/article/${id}`} className="block h-full">
      <Card className="overflow-hidden transition-all hover:scale-105 h-full flex flex-col">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <Badge 
            className="absolute top-2 right-2 text-white font-semibold"
            style={{ backgroundColor: popularityData.color }}
          >
            {popularityData.text}
          </Badge>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <h2 className="text-lg font-semibold line-clamp-3 mb-2">{title}</h2>
        </CardContent>
      </Card>
    </Link>
  )
}

