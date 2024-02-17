import React, { useEffect } from 'react'
import { EventData } from '@/types'
import { google } from 'calendar-link'
import { Linking } from 'react-native'

export function useCalander() {
  async function createCalendarEvent(eventData: EventData) {
    Linking.openURL(
      google({
        title: eventData.name,
        description: eventData.description,
        start: new Date(eventData.startTimeSeconds * 1000).toLocaleString(),
        duration: [eventData.durationInMinutes, 'minutes'],
      })
    )
  }

  return { createCalendarEvent }
}
