export type ContestData = {
  id: number
  name: string
  phase: string
  duration: number
  startTimeSeconds: number
  relativeTimeSeconds: number
}

export type EventData = {
  name: string
  description: string
  startTimeSeconds: number
  durationInMinutes: number
}
