"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getParticipants } from "@/lib/data-service"

interface ParticipantListProps {
  refreshTrigger?: number
}

export function ParticipantList({ refreshTrigger = 0 }: ParticipantListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    // Load participants from our data service
    const loadedParticipants = getParticipants()
    setParticipants(loadedParticipants)
  }, [refreshTrigger])

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <div className="p-4">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search participants..."
            className="w-full rounded-md border border-input px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-3">Completed</div>
            <div className="col-span-3">Last Active</div>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No participants found</div>
          ) : (
            filteredParticipants.map((participant) => {
              // Calculate total score
              const totalScore = participant.completedChallenges.reduce(
                (sum: number, challenge: any) => sum + challenge.score,
                0,
              )

              return (
                <div key={participant.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 font-medium">{participant.name}</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {totalScore} points
                    </Badge>
                  </div>
                  <div className="col-span-3">{participant.completedChallenges.length} challenges</div>
                  <div className="col-span-3 text-muted-foreground">
                    {new Date(participant.lastActive).toLocaleDateString()}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Card>
  )
}
