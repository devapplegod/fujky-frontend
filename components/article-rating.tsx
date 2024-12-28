import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from "next/cache"
import Link from 'next/link'


interface ArticleRatingProps {
  articleId: string
}

async function getCurrentRating(articleId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .single()

  if (error?.details === 'The result contains 0 rows') {
    return 'none'
  } else if (error){
    console.error('Error fetching rating:', error)
  }

  return data?.rating
}

async function rate(articleId: string, rating: string){
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log(authError)
    console.error('User not authenticated.');
    return;
  }

  const userId = user.id;

  if (!['good', 'bad', 'none'].includes(rating)) {
    console.error('Invalid rating provided.');
    return;
  }

  if (rating === 'none') {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .match({ article_id: articleId, user_id: userId });

    if (error) {
      console.error('Error deleting rating:', error);
    } else {
      console.log(`Successfully removed rating by user ${userId}`);
    }
    return;
  }


  const { error } = await supabase
    .from('ratings')
    .upsert(
      { article_id: articleId, user_id: userId, rating: rating },
      { onConflict: 'article_id, user_id' },
    );

  if (error) {
    console.error('Error upserting rating:', error);
  } else {
    console.log(`Successfully set rating: ${rating} by user ${userId}`);
  }
}

export async function ArticleRating({ articleId }: ArticleRatingProps) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  let currentRating = 'none'

  if (user){
    const userId = user.id
    currentRating = await getCurrentRating(articleId, userId)
    console.log("Current user rating: " + currentRating)
  }
  
  const handleRating = async (rating: 'good' | 'bad' | 'none') => {
    "use server";
    if (!user) {
      console.log("Couldn't rate article because not logged in.")
      // HERE I WANT TO SOMEHOW INFORM USER THEY NEED TO BE LOGGED IN.
      revalidatePath(`/article/${articleId}`)
      return
    }
    if (currentRating === rating){
      rating = "none"
    }
    await rate(articleId, `${rating}`)
    revalidatePath(`/article/${articleId}`)
  }
  if (user){
    return (
      <>
        {/* Mobile version */}
        <div className="md:hidden fixed bottom-4 left-4 z-50 flex space-x-2">
          <form action={handleRating.bind(null, 'good')}>
            <Button
              type="submit"
              variant={currentRating === 'good' ? 'default' : 'outline'}
              size="sm"
              className={`transition-all duration-300 ${currentRating === 'good' ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              <ThumbsUp className={`h-4 w-4 ${currentRating === 'good' ? 'text-white' : 'text-gray-400'}`} />
            </Button>
          </form>
          <form action={handleRating.bind(null, 'bad')}>
            <Button
              type="submit"
              variant={currentRating === 'bad' ? 'default' : 'outline'}
              size="sm"
              className={`transition-all duration-300 ${currentRating === 'bad' ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              <ThumbsDown className={`h-4 w-4 ${currentRating === 'bad' ? 'text-white' : 'text-gray-400'}`} />
            </Button>
          </form>
        </div>

        {/* Desktop version */}
        <div className="hidden md:flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-3 text-center">Jak hodnotíte tento článek?</h3>
          <div className="flex space-x-3">
            <form action={handleRating.bind(null, 'good')}>
              <Button
                type="submit"
                variant={currentRating === 'good' ? 'default' : 'outline'}
                size="sm"
                className={`transition-all duration-300 ${currentRating === 'good' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                <ThumbsUp className={`mr-1 h-4 w-4 ${currentRating === 'good' ? 'text-white' : 'text-gray-400'}`} />
                Dobře
              </Button>
            </form>
            <form action={handleRating.bind(null, 'bad')}>
              <Button
                type="submit"
                variant={currentRating === 'bad' ? 'default' : 'outline'}
                size="sm"
                className={`transition-all duration-300 ${currentRating === 'bad' ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                <ThumbsDown className={`mr-1 h-4 w-4 ${currentRating === 'bad' ? 'text-white' : 'text-gray-400'}`} />
                Špatně
              </Button>
            </form>
          </div>
          {(currentRating === 'good' || currentRating === 'bad') && (
            <p className="mt-3 text-center text-sm text-gray-300">
              Děkujeme za zpětnou vazbu!
            </p>
          )}
        </div>
      </>
    )
  } else {
    // User is not logged in
    return (
      <>
        {/* Mobile version */}
        <div className="md:hidden fixed bottom-7 left-7 z-50 flex space-x-2">
          <p className="text-sm text-white font-bold">
            <Link href="/login" className="underline">Přihlásit se</Link> a zhodnotit
          </p>
        </div>

        {/* Desktop version */}
        <div className="hidden md:flex justify-center items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <p className="text-center text-sm text-gray-300">
            <Link href="/login" className="text-blue-400 hover:underline">
              Přihlašte se
            </Link>{' '}
            a zhodnoťte tento článek.
          </p>
        </div>
      </>
    )
  }
}
