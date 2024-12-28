import { createClient } from '@/app/utils/supabase/server'

interface RatingStats {
    percentage: number | null;
    totalCount: number;
    goodCount: number;
    badCount: number;
    message: string | null;
}
  
export async function getRatingPercentage(articleId: string): Promise<RatingStats> {
    const supabase = await createClient()
  
    let goodCount = 0;
    let badCount = 0;
  
    const { count: goodRatingCount, error: goodError } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)
      .eq('rating', 'good');
  
    if (goodError) {
      console.error('Error fetching good rating count:', goodError);
      return {
        percentage: null,
        totalCount: 0,
        goodCount: 0,
        badCount: 0,
        message: 'Error fetching ratings',
      };
    }
  
    goodCount = goodRatingCount || 0;
  
    const { count: badRatingCount, error: badError } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)
      .eq('rating', 'bad');
  
    if (badError) {
      console.error('Error fetching bad rating count:', badError);
      return {
        percentage: null,
        totalCount: 0,
        goodCount: 0,
        badCount: 0,
        message: 'Error fetching ratings',
      };
    }
  
    badCount = badRatingCount || 0;
  
    const totalCount = goodCount + badCount;
    if (totalCount === 0) {
      return {
        percentage: null,
        totalCount,
        goodCount,
        badCount,
        message: 'No ratings yet',
      };
    }
  
    const percentage = (goodCount / totalCount) * 100;
    const roundedPercentage = Math.round(percentage);
    return {
      percentage: roundedPercentage,
      totalCount,
      goodCount,
      badCount,
      message: null,
    };
}

interface PopularityData {
    color: string;
    text: string;
  }


export async function getPopularityData(articleId: string): Promise<PopularityData> {
  let bgColor = 'hsl(250, 31%, 50%)';
  let popularityText = "Nehodnoceno"
  const popularity = (await getRatingPercentage(articleId)).percentage
  if (popularity !== null){
    bgColor = `hsl(${(popularity * 1.2).toString(10)}, 80%, 40%)`
    popularityText = popularity + " % se líbí"
  }
  return {
    color: bgColor,
    text: popularityText
  }

}