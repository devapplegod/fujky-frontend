import { createClient } from '@/app/utils/supabase/server';
import { Article } from '@/types';

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

  return data as Article[];
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
    if (error) {
      console.error('Error fetching article by id:', error);
      return;
    }
    return data[0] as ArticleById;
}
