"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin/admin-header"
import { saveChallenge } from "@/lib/data-service"

export default function NewChallengePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("python")
  const [description, setDescription] = useState("")
  const [buggyCode, setBuggyCode] = useState("")
  const [solutionPatterns, setSolutionPatterns] = useState("")
  const [expectedOutput, setExpectedOutput] = useState("")

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse solution patterns
      const solutionPatternsArray = solutionPatterns.split(",").map((pattern) => pattern.trim())

      // Create errors array
      const errors = []
      for (let i = 0; i < 5; i++) {
        errors.push({
          id: i + 1,
          description: `Error ${i + 1}`,
          solution: solutionPatternsArray.length > i ? [solutionPatternsArray[i]] : [""],
        })
      }

      // Create new challenge
      const newChallenge = {
        id: 0, // Will be assigned by saveChallenge
        title,
        language,
        description,
        buggyCode,
        errors,
        expectedOutput,
      }

      // Save challenge
      saveChallenge(newChallenge)

      // Show success message
      alert("Challenge created successfully!")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error creating challenge:", error)
      alert("Error creating challenge. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <main className="container mx-auto p-4 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Challenge</h1>
          <p className="text-muted-foreground">Define a new debugging challenge for participants</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
              <CardDescription>Basic information about the challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Fix the Sum Function"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="This function should calculate the sum of all numbers in a list, but it has bugs. Fix the code to correctly sum all elements in the list."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buggyCode">Buggy Code</Label>
                <Textarea
                  id="buggyCode"
                  value={buggyCode}
                  onChange={(e) => setBuggyCode(e.target.value)}
                  placeholder={`def calculate_sum(numbers):\n    total = 0\n    for i in range(len(numbers) + 1):\n        total += numbers[i]\n    return total\n\n# Test case\nnumbers = [10, 20, 30, 40, 50]\nprint(f"Sum: {calculate_sum(numbers)}")`}
                  className="font-mono text-sm"
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solutionPatterns">
                  Solution Patterns
                  <span className="ml-1 text-xs text-muted-foreground">
                    (comma-separated patterns that must be in the solution)
                  </span>
                </Label>
                <Textarea
                  id="solutionPatterns"
                  value={solutionPatterns}
                  onChange={(e) => setSolutionPatterns(e.target.value)}
                  placeholder="range(len(numbers)),for i in range(len(numbers)):"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedOutput">Expected Output</Label>
                <Textarea
                  id="expectedOutput"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="Sum: 150"
                  rows={2}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Challenge"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
