"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { usePreviousRoute } from '@hooks/prevRoute'
import { SessionContextValue, useSession } from 'next-auth/react'
import { usePromptActions } from '@hooks/promptActions'

interface AppProviderType {
  children: React.ReactNode
}

export const AppContext = createContext({})

export const AppProvider = ({ children }: AppProviderType) => {
  const previousRoute = usePreviousRoute()
  const { data: session }: SessionContextValue = useSession()
  const [ prompts, setPrompts ] = useState([])
  const [ searchText, setSearchText ] = useState('')
  const { handleSearchPrompts } = usePromptActions()
  const abortController: AbortController = new AbortController();

  useEffect(() => {
    if (!session) return
    (async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`)
      const prompts = await response.json()

      setPrompts(prompts)
    })();
  }, [ session?.user.id ])

  return (
    <AppContext.Provider 
      value={{
        previousRoute, 
        session,
        prompts,
        searchText,
        setSearchText
      }}
    >
        { children }
      </AppContext.Provider>
  )
}

export const useAppProvider = (): any => {
  const context = useContext(AppContext)

  return context
}