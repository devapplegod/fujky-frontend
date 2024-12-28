import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Přihlaste se ke svému účtu</CardTitle>
            <CardDescription>Uživatelská hesla platforma Fujky.cz neukládá ani nevidí.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Heslo</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button formAction={login} type="submit" className="w-full">Přihlásit se</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Ještě nemáte účet?{' '}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Registrace
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

