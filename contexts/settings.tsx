import React, { useState, useReducer } from 'react'

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
  { type, payload }: { type: string; payload: { handle: string } }
) => {
  switch (type) {
    case 'SET_HANDLE':
      return { ...state, handle: payload.handle }
    default:
      return { ...state }
  }
}

export const SettingsContext = React.createContext<Settings>(initialState)
export const SettingsDispatchContext = React.createContext<any>(null)

export function SettingsProvider({ children }: { children: any }) {
  const [settings, dispatch] = useReducer(reducer, initialState)

  return (
    <SettingsContext.Provider value={settings}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsContext.Provider>
  )
}
