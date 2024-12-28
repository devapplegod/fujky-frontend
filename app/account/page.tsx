import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }

  const user = data.user

  async function signOut() {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error){
        console.log(error)
    }
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Správa účtu</CardTitle>
            <CardDescription>Zobrazte a spravujte údaje o účtu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">ID účtu</h3>
              <p className="text-gray-400">{user.id}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Poslední přihlášení</h3>
              <p className="text-gray-400">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <form action={signOut}>
              <Button type="submit" variant="destructive">Odhlásit se</Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

