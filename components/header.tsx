import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClient } from '@/app/utils/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm bg-gray-900/80 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Fujky.cz
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <Link href="/account">
              <Button variant="outline" className="text-gray-300 hover:text-white">
                Účet
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Přihlásit se
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Registrace
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

