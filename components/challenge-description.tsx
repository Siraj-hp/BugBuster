import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Challenge } from "@/lib/challenges"
import { Badge } from "@/components/ui/badge"

interface ChallengeDescriptionProps {
  challenge: Challenge
  questionNumber: number
}

export function ChallengeDescription({ challenge, questionNumber }: ChallengeDescriptionProps) {
  return (
    <div className="h-full p-4">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {questionNumber}: {challenge.title}
            </CardTitle>
            <Badge variant={challenge.language === "python" ? "default" : "secondary"}>{challenge.language}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>

          <div>
            <h3 className="font-medium">Expected Output:</h3>
            <div className="mt-2 rounded-md bg-slate-100 p-3">
              <pre className="text-xs">{challenge.expectedOutput}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Scoring:</h3>
            <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
              <li>Each challenge has 5 errors to fix</li>
              <li>Each error fixed = 2 points</li>
              <li>Fixing all 5 errors = 10 points total</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
