import { createClient } from '@/app/utils/supabase/server';

export async function fetchRecentArticles(maxResults: number) {
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
          publisher
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(maxResults);

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }
  return data;
}

type ArticleById = {
  id: string;
  rating: number | null;
  generated: {
    title: string;
    text: string;
    image: string;
    scraped: {
      date: string;
      publisher: string;
      url: string;
    };
  };
};

export async function fetchArticleById(id: string): Promise<ArticleById | undefined>{
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
    if (error) {
      console.error('Error fetching article by id:', error);
      return;
    }
    return data[0] as ArticleById;
}
