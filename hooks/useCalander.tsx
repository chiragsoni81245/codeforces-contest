import React, { useEffect } from 'react'
import { EventData } from '@/types'
import { google } from 'calendar-link'
import { Linking } from 'react-native'
import moment from 'moment'

export function useCalander() {
  async function createCalendarEvent(eventData: EventData) {
    const googleCalanderLink = google({
      title: eventData.name,
      description: eventData.description,
      start: moment(eventData.startTimeSeconds * 1000).format(
        'YYYY-MM-DDTHH:mm:SS.SSSZ'
      ),
      duration: [eventData.durationInMinutes, 'minutes'],
    })

    Linking.openURL(googleCalanderLink)
  }

  return { createCalendarEvent }
}
