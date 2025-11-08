interface TimerProps {
  seconds: number
  isRunning: boolean
}

export function Timer({ seconds, isRunning }: TimerProps) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`

  return (
    <div
      className={`rounded-md px-3 py-1 font-mono text-sm ${seconds < 60 ? "bg-red-100 text-red-700" : "bg-slate-100"}`}
    >
      {formattedTime}
    </div>
  )
}
