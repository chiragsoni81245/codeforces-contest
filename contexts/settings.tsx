import { Text, View } from '@/components/Themed'
import axios from 'axios'
import React, { useReducer, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { MMKV } from 'react-native-mmkv'

type Settings = {
  handle: string | undefined
  lastContestsRatingChange: number
}

const initialState: Settings = {
  handle: undefined,
  lastContestsRatingChange: 10,
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

  useEffect(() => {
    const localSotrage = new MMKV()
    ;(async () => {
      const settingsString: string | undefined =
        localSotrage.getString('settings')
      if (settingsString) {
        const settings: Settings = JSON.parse(settingsString)
        dispatch({
          payload: settings,
        })
      }
      setLoading(false)
    })()
  }, [])

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
