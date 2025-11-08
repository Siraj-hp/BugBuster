"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import html2canvas from "html2canvas"
import { getChallenges } from "@/lib/data-service"

export default function CompletedPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<any[]>([])
  const [participantName, setParticipantName] = useState<string>("")
  const [score, setScore] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<{ id: number; score: number }[]>([])
  const [timeSpentByChallenge, setTimeSpentByChallenge] = useState<number[]>([])
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [maxPossibleScore, setMaxPossibleScore] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const resultCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load challenges from our data service
    const loadedChallenges = getChallenges()
    setChallenges(loadedChallenges)

    const name = localStorage.getItem("participantName")
    if (!name) {
      router.push("/login")
      return
    }
    setParticipantName(name)

    // Get completed challenges from localStorage
    const completed = JSON.parse(localStorage.getItem("completedChallenges") || "[]")
    setCompletedChallenges(completed)

    // Get time spent by challenge from localStorage
    const timeSpent = JSON.parse(localStorage.getItem("timeSpentByChallenge") || "[]")
    setTimeSpentByChallenge(timeSpent)

    // Get total time spent - calculate from 600 - timeLeft
    const totalTime = Number.parseInt(localStorage.getItem("totalTimeSpent") || "0")
    setTotalTimeSpent(totalTime)

    // Calculate total score from completed challenges
    const totalScore = completed.reduce((sum, challenge) => sum + challenge.score, 0)
    setScore(totalScore)

    // Calculate maximum possible score (10 points per challenge)
    setMaxPossibleScore(loadedChallenges.length * 10)

    // Prevent going back to challenges
    window.history.pushState(null, "", window.location.href)
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href)
    }
  }, [router])

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Function to capture and download screenshot
  const captureScreenshot = async () => {
    if (!resultCardRef.current) return

    setIsCapturing(true)

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${participantName.replace(/\s+/g, "_")}_results.png`
      link.click()
    } catch (error) {
      console.error("Error capturing screenshot:", error)
      alert("Failed to capture screenshot. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md" ref={resultCardRef}>
        <CardHeader className="text-center" style={{ fontFamily: "Times New Roman, serif", color: "black" }}>
          <CardTitle className="text-2xl font-bold" style={{ color: "black" }}>
            THANK YOU...!
          </CardTitle>
          <CardDescription style={{ color: "black", fontWeight: "bold" }}>
            Great job, {participantName}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6" style={{ fontFamily: "Times New Roman, serif", color: "black" }}>
            <div className="rounded-md bg-white p-6 text-center border border-gray-300">
              <p className="mb-2 text-3xl font-bold" style={{ color: "black" }}>
                {score} points
              </p>
              <p className="text-sm" style={{ color: "black" }}>
                You scored {score} out of {maxPossibleScore} possible points
              </p>
              <div className="mt-3 rounded-md bg-white p-2 text-center border border-gray-300">
                <p className="text-lg font-semibold" style={{ color: "black" }}>
                  Total Time: {formatTime(totalTimeSpent)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-center font-medium" style={{ color: "black" }}>
                Challenge Results
              </h3>
              <div className="space-y-2">
                {challenges.map((challenge, index) => {
                  const completedChallenge = completedChallenges.find((c) => c.id === challenge.id)
                  const challengeScore = completedChallenge ? completedChallenge.score : 0
                  const errorsFixed = challengeScore / 2

                  return (
                    <div
                      key={challenge.id}
                      className="flex flex-col rounded-md p-3 border border-gray-300 bg-white"
                      style={{ color: "black" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium"
                            style={{ color: "black" }}
                          >
                            Question {index + 1}
                          </span>
                          <span style={{ color: "black" }}>{challenge.title}</span>
                        </div>
                        <div>
                          <span
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium"
                            style={{ color: "black" }}
                          >
                            {errorsFixed}/5 errors fixed
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs" style={{ color: "black" }}>
                          Time spent: {formatTime(timeSpentByChallenge[index] || 0)}
                        </span>
                        <span
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium"
                          style={{ color: "black" }}
                        >
                          {challengeScore}/10 points
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 w-full max-w-md">
        <Button onClick={captureScreenshot} className="w-full" disabled={isCapturing}>
          <Camera className="mr-2 h-4 w-4" />
          {isCapturing ? "Capturing..." : "Take Screenshot"}
        </Button>
      </div>
    </div>
  )
}
