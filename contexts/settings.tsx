import { Text, View } from '@/components/Themed'
import axios from 'axios'
import React, { useReducer, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { MMKV } from 'react-native-mmkv'

type RatingChange = {
  contestName: string
  contestId: number
  oldRating: number
  newRating: number
  rank: number
  ratingUpdateTimeSeconds: number
}

type Settings = {
  handle: string | undefined
  lastContestsRatingChange: number
  ratingChanges: RatingChange[] | null
}

const initialState: Settings = {
  handle: undefined,
  lastContestsRatingChange: 10,
  ratingChanges: [],
}

const reducer = (
  state: Settings,
  {
    payload,
  }: {
    payload:
      | Settings
      | { lastContestsRatingChange: number }
      | { handle: string }
  }
) => {
  const newState = { ...state, ...payload }
  const localSotrage = new MMKV()
  localSotrage.set('settings', JSON.stringify(newState))
  return newState
}

export const SettingsContext = React.createContext<Settings>(initialState)
export const SettingsDispatchContext = React.createContext<any>(null)

export function SettingsProvider({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [settings, dispatch] = useReducer(reducer, initialState)

  async function getUserRatingChanges(
    handle: string
  ): Promise<[RatingChange[] | null, string | null]> {
    try {
      // Logic to fetch contest info from Codeforces API
      const response = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      )
      return [response.data.result, null]
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return [null, error.message]
      }
      return [null, 'Something went wrong while fetching user rating changes!']
    }
  }

  useEffect(() => {
    const localSotrage = new MMKV()
    ;(async () => {
      const settingsString: string | undefined =
        localSotrage.getString('settings')
      if (settingsString) {
        const settings: Settings = JSON.parse(settingsString)
        if (settings.handle) {
          // Loading User Stats
          const [ratingChanges, error] = await getUserRatingChanges(
            settings.handle
          )
          if (!error) {
            settings['ratingChanges'] = ratingChanges
          } else {
            throw new Error(error)
          }
        }
        dispatch({
          payload: settings,
        })
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    // Refresh User Ratings when handle changes
    ;(async () => {
      if (typeof settings.handle === 'undefined') return

      // Loading User Stats
      const [ratingChanges, error] = await getUserRatingChanges(settings.handle)
      if (!error) {
        settings['ratingChanges'] = ratingChanges
      } else {
        throw new Error(error)
      }
    })()
  }, [settings.handle])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
        <Text style={styles.loadingText}>Loading Local Settings</Text>
      </View>
    )
  }

  return (
    <SettingsContext.Provider value={settings}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
})
