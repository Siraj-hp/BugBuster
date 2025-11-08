"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addParticipant } from "@/lib/data-service"

export default function LoginPage() {
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // Register participant in our data service
      const participant = addParticipant(name)

      // Clear any previous participant data to ensure fresh start with score 0
      localStorage.removeItem("completedChallenges")
      localStorage.removeItem("timeSpentByChallenge")
      localStorage.removeItem("timeLeft")
      localStorage.removeItem("challengeStartTime")

      // Set the new participant name and ID
      localStorage.setItem("participantName", name)
      localStorage.setItem("participantId", participant.id)

      router.push("/challenges")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ENTER YOUR FULL NAME</CardTitle>
          <CardDescription>Begin the Python debugging challenge</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Begin Challenge
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
