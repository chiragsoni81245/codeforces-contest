import { Text, View } from '@/components/Themed'
import axios from 'axios'
import React, { useReducer, useEffect, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet } from 'react-native'
import { useSettings } from '@/hooks/useSettings'

type RatingChange = {
  contestName: string
  contestId: number
  oldRating: number
  newRating: number
  rank: number
  ratingUpdateTimeSeconds: number
}

type RatingChanges = {
  [contestId: number]: RatingChange
}

type UserDetails = {
  ratingChanges: RatingChanges
}

const initialState: UserDetails = {
  ratingChanges: {},
}

const reducer = (
  state: UserDetails,
  {
    payload,
  }: {
    payload: UserDetails
  }
) => {
  const newState = { ...state, ...payload }
  return newState
}

export const UserContext = React.createContext<UserDetails>(initialState)
export const UserDispatchContext = React.createContext<any>(null)

export function UserProvider({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [user, dispatch] = useReducer(reducer, initialState)
  const { settings } = useSettings()

  async function getUserRatingChanges(
    handle: string
  ): Promise<[RatingChanges, string | null]> {
    try {
      // Logic to fetch contest info from Codeforces API
      const response = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      )
      const ratingChanges: RatingChanges = {}
      for (let ratingChange of response.data.result) {
        const contestId: number = ratingChange.contestId
        delete ratingChange['contestId']
        ratingChanges[contestId] = ratingChange
      }
      return [ratingChanges, null]
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return [{}, error.message]
      }
      return [{}, 'Something went wrong while fetching user rating changes!']
    }
  }

  async function loadUserDetails(silent: boolean = false) {
    if (typeof settings.handle === 'undefined') return
    if (!silent) setLoading(true)
    // Loading User Stats
    const [ratingChanges, error] = await getUserRatingChanges(settings.handle)
    if (!error) {
      dispatch({
        payload: {
          ratingChanges,
        },
      })
    } else {
      setError(error)
    }
    if (!silent) setLoading(false)
  }

  useEffect(() => {
    // Refresh User Ratings when handle changes
    loadUserDetails()
  }, [settings.handle])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
        <Text style={styles.loadingText}>Fetching User Details</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error?.toString()}</Text>
        <Button
          title="Refresh User Details"
          onPress={() => loadUserDetails()}
        />
      </View>
    )
  }

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
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
