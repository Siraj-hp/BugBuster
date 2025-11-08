import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Debug Challenge Platform</CardTitle>
          <CardDescription>Fix buggy Python code under time pressure</CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Link href="/admin" className="flex-1">
            <Button className="w-full" variant="default">
              Admin Login
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button className="w-full" variant="outline">
              Participant Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
