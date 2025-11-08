"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getChallenges, deleteChallenge } from "@/lib/data-service"

interface ChallengeListProps {
  onChallengeChange?: () => void
}

export function ChallengeList({ onChallengeChange }: ChallengeListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [challenges, setChallenges] = useState<any[]>([])

  useEffect(() => {
    // Load challenges from our data service
    const loadedChallenges = getChallenges()
    setChallenges(loadedChallenges)
  }, [])

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.language.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteChallenge = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteChallenge(id)

      // Refresh the challenge list
      const updatedChallenges = getChallenges()
      setChallenges(updatedChallenges)

      // Notify parent component
      if (onChallengeChange) {
        onChallengeChange()
      }

      alert(`Challenge "${title}" has been deleted.`)
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search challenges..."
            className="w-full rounded-md border border-input px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Language</div>
            <div className="col-span-3">Created</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No challenges found</div>
          ) : (
            filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                <div className="col-span-5 font-medium">{challenge.title}</div>
                <div className="col-span-2">
                  <Badge variant={challenge.language === "python" ? "default" : "secondary"}>
                    {challenge.language}
                  </Badge>
                </div>
                <div className="col-span-3 text-muted-foreground">{new Date().toLocaleDateString()}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link href={`/admin/challenges/${challenge.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge.id, challenge.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
