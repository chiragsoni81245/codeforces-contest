import { useContext } from 'react'
import { UserContext, UserDispatchContext } from '@/contexts/user'

export function useUser() {
  const user = useContext(UserContext)
  const dispatch = useContext(UserDispatchContext)

  return { user, dispatch }
}
