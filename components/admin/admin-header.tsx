"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface AdminHeaderProps {
  onRefresh?: () => void
}

export function AdminHeader({ onRefresh }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin")
  }

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            Debug Challenge Admin
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/challenges/new"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  New Challenge
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
