"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChallengeList } from "@/components/admin/challenge-list"
import { ParticipantList } from "@/components/admin/participant-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { getStats, resetStats, initializeDefaultChallenges } from "@/lib/data-service"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({ totalChallenges: 0, totalParticipants: 0, totalSubmissions: 0 })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)

    // Initialize default challenges if needed
    initializeDefaultChallenges()

    // Get current stats
    const currentStats = getStats()
    setStats(currentStats)
  }, [router, refreshTrigger])

  const handleResetStats = () => {
    if (
      confirm("Are you sure you want to reset all statistics? This will remove all participants and their submissions.")
    ) {
      resetStats()
      setRefreshTrigger((prev) => prev + 1)
      alert("Statistics have been reset successfully!")
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />

      <main className="container mx-auto p-4 pt-24">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/admin/challenges/new">
            <Button>Create New Challenge</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Key metrics for your debugging challenge platform</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetStats}>
                  Reset Stats
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Challenges</p>
                  <p className="text-3xl font-bold">{stats.totalChallenges}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                  <p className="text-3xl font-bold">{stats.totalParticipants}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="challenges">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="challenges" className="mt-4">
              <ChallengeList onChallengeChange={() => setRefreshTrigger((prev) => prev + 1)} />
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <ParticipantList refreshTrigger={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
