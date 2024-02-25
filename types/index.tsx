export type ContestData = {
  id: number
  name: string
  phase: string
  durationSeconds: number
  startTimeSeconds: number
  relativeTimeSeconds: number
  userRatingChange: number | undefined
  isCompleted?: boolean
}

export type EventData = {
  name: string
  description: string
  startTimeSeconds: number
  durationInMinutes: number
}
