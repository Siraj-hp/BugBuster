"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/code-editor"
import { ChallengeDescription } from "@/components/challenge-description"
import { Timer } from "@/components/timer"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useEvent } from "@/hooks/use-event"
import { getChallenges, getParticipants, updateParticipant } from "@/lib/data-service"

export default function ChallengePage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<any[]>([])
  const [participantName, setParticipantName] = useState<string>("")
  const [participantId, setParticipantId] = useState<string>("")
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [codeByChallenge, setCodeByChallenge] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [timeSpentByChallenge, setTimeSpentByChallenge] = useState<number[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<{ id: number; score: number }[]>([])
  const [output, setOutput] = useState<string>("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [score, setScore] = useState(0)
  const [timeUp, setTimeUp] = useState(false) // New state to track if time is up
  const [startTime] = useState(Date.now()) // Track when the challenge started

  // Use our stable event handler for functions that might be used in effects
  const handleTimeUp = useEvent(() => {
    setTimeUp(true) // Set timeUp to true instead of allCompleted
    setOutput("Time's up! Your solutions have been automatically submitted.")

    // Save all current progress
    saveProgress()

    // Calculate total time spent (10 minutes - time left)
    const totalTimeSpent = 600 - timeLeft
    localStorage.setItem("totalTimeSpent", totalTimeSpent.toString())

    // Update participant data in our data service
    if (participantId) {
      const participants = getParticipants()
      const participant = participants.find((p) => p.id === participantId)
      if (participant) {
        participant.completedChallenges = completedChallenges
        participant.lastActive = new Date().toISOString()
        updateParticipant(participant)
      }
    }

    // Navigate to completed page immediately
    router.push("/completed")
  })

  const saveProgress = useCallback(() => {
    // Save time spent by challenge
    localStorage.setItem("timeSpentByChallenge", JSON.stringify(timeSpentByChallenge))

    // Save completed challenges
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    // Calculate and save total time spent
    const totalTimeSpent = 600 - timeLeft
    localStorage.setItem("totalTimeSpent", totalTimeSpent.toString())

    // Update participant data in our data service
    if (participantId) {
      const participants = getParticipants()
      const participant = participants.find((p) => p.id === participantId)
      if (participant) {
        participant.completedChallenges = completedChallenges
        participant.lastActive = new Date().toISOString()
        updateParticipant(participant)
      }
    }
  }, [timeSpentByChallenge, completedChallenges, timeLeft, participantId])

  useEffect(() => {
    // Load challenges from our data service
    const loadedChallenges = getChallenges()
    setChallenges(loadedChallenges)

    const name = localStorage.getItem("participantName")
    const id = localStorage.getItem("participantId")

    if (!name || !id) {
      router.push("/login")
      return
    }

    setParticipantName(name)
    setParticipantId(id)

    // Load completed challenges from localStorage
    const completed = JSON.parse(localStorage.getItem("completedChallenges") || "[]")
    setCompletedChallenges(completed)

    // Calculate total score from completed challenges
    const totalScore = completed.reduce((sum, challenge) => sum + challenge.score, 0)
    setScore(totalScore)

    // Initialize code for all challenges
    const initialCode = loadedChallenges.map((challenge) => challenge.buggyCode)
    setCodeByChallenge(initialCode)

    // Initialize timeSpentByChallenge array based on number of challenges
    setTimeSpentByChallenge(new Array(loadedChallenges.length).fill(0))

    // Load time spent from localStorage if available
    const savedTimeSpent = JSON.parse(localStorage.getItem("timeSpentByChallenge") || "null")
    if (savedTimeSpent) {
      setTimeSpentByChallenge(savedTimeSpent)
    }

    // Load remaining time from localStorage if available
    const savedTimeLeft = localStorage.getItem("timeLeft")
    if (savedTimeLeft) {
      setTimeLeft(Number.parseInt(savedTimeLeft))
    }

    // Store the start time in localStorage if not already set
    if (!localStorage.getItem("challengeStartTime")) {
      localStorage.setItem("challengeStartTime", startTime.toString())
    }
  }, [router, startTime])

  useEffect(() => {
    if (timeUp || challenges.length === 0) return // Only check if time is up, not if all challenges are completed

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }

        // Save remaining time to localStorage
        localStorage.setItem("timeLeft", (prev - 1).toString())
        return prev - 1
      })

      // Update time spent on current challenge
      setTimeSpentByChallenge((prev) => {
        const updated = [...prev]
        updated[currentChallenge] += 1
        localStorage.setItem("timeSpentByChallenge", JSON.stringify(updated))
        return updated
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentChallenge, timeUp, handleTimeUp, challenges.length])

  const handleCodeChange = useCallback(
    (value: string) => {
      setCodeByChallenge((prev) => {
        const updated = [...prev]
        updated[currentChallenge] = value
        return updated
      })
    },
    [currentChallenge],
  )

  const executeCode = useCallback(async () => {
    if (challenges.length === 0) return

    setIsExecuting(true)
    setOutput("Executing code...")

    // In a real app, you'd send the code to the server for execution
    // Here we're simulating execution with a timeout
    setTimeout(() => {
      const challenge = challenges[currentChallenge]
      const code = codeByChallenge[currentChallenge]

      // Count how many errors were fixed
      let errorCount = 0
      const errorMessages = []
      const fixedErrors = []

      for (const error of challenge.errors) {
        // Check if any of the possible solutions are included in the code
        const isSolutionFound = error.solution.some((solution) => code.includes(solution))

        if (isSolutionFound) {
          errorCount++
          fixedErrors.push(`Error ${error.id}: ${error.description} - Fixed!`)
        } else {
          errorMessages.push(`Error ${error.id}: ${error.description} - Not fixed.`)
        }
      }

      // Calculate score: 2 points per error fixed
      let challengeScore = 0
      if (errorCount > 0) {
        challengeScore = errorCount * 2
      }

      // Update output message
      if (errorCount === 5) {
        setOutput(
          `Program executed successfully! All errors fixed.\nScore: ${challengeScore}/10\n\n${fixedErrors.join("\n")}\n\n${challenge.expectedOutput}`,
        )
        setIsCorrect(true)
      } else if (errorCount > 0) {
        setOutput(
          `Program executed with ${5 - errorCount} remaining errors.
Score: ${challengeScore}/10

${fixedErrors.join("\n")}

${errorMessages.join("\n")}`,
        )
      } else {
        setOutput(`No errors were fixed.
Score: ${challengeScore}/10

${errorMessages.join("\n")}`)
      }

      // Update completed challenges and score
      const existingIndex = completedChallenges.findIndex((c) => c.id === challenge.id)
      const newCompleted = [...completedChallenges]

      if (existingIndex >= 0) {
        // Update existing challenge if new score is higher
        if (challengeScore > newCompleted[existingIndex].score) {
          newCompleted[existingIndex].score = challengeScore
        }
      } else if (challengeScore > 0) {
        // Add new challenge only if score is greater than 0
        newCompleted.push({ id: challenge.id, score: challengeScore })
      }

      setCompletedChallenges(newCompleted)

      // Calculate total score
      const totalScore = newCompleted.reduce((sum, challenge) => sum + challenge.score, 0)
      setScore(totalScore)

      // Save to localStorage
      localStorage.setItem("completedChallenges", JSON.stringify(newCompleted))

      // Update participant data in our data service
      if (participantId) {
        const participants = getParticipants()
        const participant = participants.find((p) => p.id === participantId)
        if (participant) {
          participant.completedChallenges = newCompleted
          participant.lastActive = new Date().toISOString()
          updateParticipant(participant)
        }
      }

      setIsExecuting(false)
    }, 1500)
  }, [currentChallenge, codeByChallenge, completedChallenges, challenges, participantId])

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true)
    executeCode()
  }, [executeCode])

  const handleNextChallenge = useCallback(() => {
    if (challenges.length === 0) return

    if (currentChallenge < challenges.length - 1) {
      // Save current progress
      saveProgress()

      // Move to next challenge
      setCurrentChallenge((prev) => prev + 1)
      setIsCorrect(false)
      setIsSubmitted(false)
      setOutput("")
    } else {
      // All challenges completed
      saveProgress()
      router.push("/completed")
    }
  }, [currentChallenge, saveProgress, router, challenges.length])

  const handlePreviousChallenge = useCallback(() => {
    if (currentChallenge > 0) {
      // Save current progress
      saveProgress()

      // Move to previous challenge
      setCurrentChallenge((prev) => prev - 1)
      setIsCorrect(false)
      setIsSubmitted(false)
      setOutput("")
    }
  }, [currentChallenge, saveProgress])

  const handleFinish = useCallback(() => {
    saveProgress()
    router.push("/completed")
  }, [saveProgress, router])

  const handleReset = useCallback(() => {
    if (challenges.length === 0) return

    // Reset the current challenge code to its original state
    setCodeByChallenge((prev) => {
      const updated = [...prev]
      updated[currentChallenge] = challenges[currentChallenge].buggyCode
      return updated
    })
    setIsCorrect(false)
    setIsSubmitted(false)
    setOutput("")
  }, [currentChallenge, challenges])

  if (challenges.length === 0 || !challenges[currentChallenge]) {
    return <div className="flex min-h-screen items-center justify-center">Loading challenges...</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">{participantName}</div>
            <Badge variant="outline">{challenges[currentChallenge].language}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Question {currentChallenge + 1} of {challenges.length}
            </div>
            <div className="rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Score: {score}</div>
            <Button onClick={handleFinish} variant="destructive" size="sm">
              Finish and View Results
            </Button>
            <Timer seconds={timeLeft} isRunning={!timeUp} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        <div className="w-full border-b md:w-1/2 md:border-b-0 md:border-r">
          <ChallengeDescription challenge={challenges[currentChallenge]} questionNumber={currentChallenge + 1} />
        </div>
        <div className="flex w-full flex-col md:w-1/2">
          <CodeEditor
            code={codeByChallenge[currentChallenge] || ""}
            onChange={handleCodeChange}
            language={challenges[currentChallenge].language}
            readOnly={timeUp} // Only disable when time is up
          />

          <div className="space-y-4 border-t bg-white p-4">
            {output && (
              <div
                className={`whitespace-pre-wrap rounded-md p-3 font-mono text-xs ${
                  isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {output}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handlePreviousChallenge}
                disabled={currentChallenge === 0 || timeUp}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>

              <Button onClick={handleReset} disabled={timeUp} variant="outline" className="flex-1">
                <RotateCcw className="mr-1 h-4 w-4" /> Reset Code
              </Button>

              <Button
                onClick={handleNextChallenge}
                disabled={currentChallenge === challenges.length - 1 || timeUp}
                variant="outline"
                className="flex-1"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="w-full" disabled={isExecuting || timeUp}>
                {isExecuting ? "Executing..." : "Submit Solution"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
