import { useContext } from 'react'
import { SettingsContext, SettingsDispatchContext } from '@/contexts/settings'

export function useSettings() {
  const settings = useContext(SettingsContext)
  const dispatch = useContext(SettingsDispatchContext)

  return { settings, dispatch }
}
