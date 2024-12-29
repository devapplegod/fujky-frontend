import { createClient } from '@/app/utils/supabase/server';
import { Article, ArticleRow } from '@/types';
import { GeneratedData } from '@/types';

export async function fetchRecentArticles(maxResults: number): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      rating,
      generated (
        title,
        text,
        image,
        scraped (
          date,
          publisher,
          url
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(maxResults);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
  if (!data) {
    console.error('No data returned from Supabase');
    return [];
  }

  const articles: Article[] = data.map((item: ArticleRow) => {
    const generatedDataArray = item.generated;
    const generatedData = Array.isArray(generatedDataArray) ? generatedDataArray[0] : generatedDataArray;

    const scrapedDataArray = generatedData?.scraped;
    const scrapedData = Array.isArray(scrapedDataArray) ? scrapedDataArray[0] : scrapedDataArray;

    const generated: GeneratedData = {
      title: generatedData?.title || '',
      text: generatedData?.text || '',
      image: generatedData?.image || '',
      scraped: {
        date: scrapedData?.date || '',
        publisher: scrapedData?.publisher || '',
        url: scrapedData?.url || '',
      },
    };

    return {
      id: item.id,
      rating: item.rating,
      generated,
    };
  });

  return articles;
}

export async function fetchArticleById(id: string): Promise<Article | undefined>{
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      rating,
      generated (
        title,
        text,
        image,
        scraped (
          date,
          publisher,
          url
        )
      )
    `)
    .eq('id', id)
    .limit(1);

  if (error) {
    console.error('Error fetching article by id:', error);
    return undefined;
  }

  if (!data || data.length === 0) {
    console.error('No article found with the given id');
    return undefined;
  }

  const item = data[0];

  const generatedDataArray = item.generated;
  const generatedData = Array.isArray(generatedDataArray) ? generatedDataArray[0] : generatedDataArray;

  const scrapedDataArray = generatedData?.scraped;
  const scrapedData = Array.isArray(scrapedDataArray) ? scrapedDataArray[0] : scrapedDataArray;

  const generated: GeneratedData = {
    title: generatedData?.title || '',
    text: generatedData?.text || '',
    image: generatedData?.image || '',
    scraped: {
      date: scrapedData?.date || '',
      publisher: scrapedData?.publisher || '',
      url: scrapedData?.url || '',
    },
  };

  const article: Article = {
    id: item.id,
    rating: item.rating,
    generated,
  };

  return article;
}
