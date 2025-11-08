// Data service to manage application state across components
import { challenges as defaultChallenges, type Challenge } from "@/lib/challenges"

// Types
export interface Participant {
  id: string
  name: string
  lastActive: string
  completedChallenges: { id: number; score: number }[]
}

// Helper functions for localStorage
const getItem = (key: string, defaultValue: any = null) => {
  if (typeof window === "undefined") return defaultValue

  const item = localStorage.getItem(key)
  if (item === null) return defaultValue

  try {
    return JSON.parse(item)
  } catch (e) {
    console.error(`Error parsing localStorage item ${key}:`, e)
    return defaultValue
  }
}

const setItem = (key: string, value: any) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// Participants management
export const getParticipants = (): Participant[] => {
  return getItem("participants", [])
}

export const addParticipant = (name: string): Participant => {
  const participants = getParticipants()

  // Check if participant already exists
  const existingParticipant = participants.find((p) => p.name === name)
  if (existingParticipant) {
    // Update last active time
    existingParticipant.lastActive = new Date().toISOString()
    setItem("participants", participants)
    return existingParticipant
  }

  // Create new participant
  const newParticipant: Participant = {
    id: Date.now().toString(),
    name,
    lastActive: new Date().toISOString(),
    completedChallenges: [],
  }

  participants.push(newParticipant)
  setItem("participants", participants)
  return newParticipant
}

export const updateParticipant = (participant: Participant): void => {
  const participants = getParticipants()
  const index = participants.findIndex((p) => p.id === participant.id)

  if (index !== -1) {
    participants[index] = participant
    setItem("participants", participants)
  }
}

// Challenge management
export const getChallenges = (): Challenge[] => {
  // First check if we have custom challenges in localStorage
  const customChallenges = getItem("customChallenges")
  if (customChallenges && customChallenges.length > 0) {
    return customChallenges
  }

  // Otherwise, return the default challenges imported at the top
  return defaultChallenges
}

export const saveChallenge = (challenge: Challenge) => {
  const customChallenges = getItem("customChallenges", [])

  // Check if challenge already exists
  const index = customChallenges.findIndex((c: Challenge) => c.id === challenge.id)

  if (index !== -1) {
    // Update existing challenge
    customChallenges[index] = challenge
  } else {
    // Add new challenge with a unique ID
    challenge.id =
      customChallenges.length > 0
        ? Math.max(...customChallenges.map((c: Challenge) => c.id)) + 1
        : defaultChallenges.length + 1
    customChallenges.push(challenge)
  }

  setItem("customChallenges", customChallenges)
  return challenge
}

export const deleteChallenge = (id: number) => {
  let customChallenges = getItem("customChallenges", [])
  customChallenges = customChallenges.filter((c: Challenge) => c.id !== id)
  setItem("customChallenges", customChallenges)
}

// Stats management
export const getStats = () => {
  const participants = getParticipants()
  const challenges = getChallenges()

  // Calculate total submissions
  let totalSubmissions = 0
  participants.forEach((participant) => {
    totalSubmissions += participant.completedChallenges.length
  })

  return {
    totalChallenges: challenges.length,
    totalParticipants: participants.length,
    totalSubmissions,
  }
}

export const resetStats = () => {
  setItem("participants", [])
}

// Initialize default challenges if none exist
export const initializeDefaultChallenges = () => {
  if (!getItem("customChallenges")) {
    setItem("customChallenges", defaultChallenges)
  }
}
