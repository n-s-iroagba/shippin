"use client"
import {useCallback} from 'react'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { publicApi } from '@/utils/apiUtils';
import { routes } from '@/data/routes';

interface AuthContextValue {
  loading: boolean
  isAdmin: boolean 
  id: number 
  displayName: string
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isAdmin: false,
  id: 0,
  displayName: "",
  refetch: async () => {},
})
type LoggedInUser={
    isAdmin: boolean 
  id: number 
  displayName: string
}
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    
    try {
      const data = await publicApi.get<LoggedInUser>(routes.auth.me)
      setUser(data)
    } catch (error) {
      console.error('❌ Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, []) // Remove mounted dependency

  // Run fetchUser only once on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const isAdmin = user?.isAdmin ?? false
  const id = user?.id ?? 0
  const displayName = user?.displayName ?? ''

  console.log('🔄 Auth state:', { loading, isAdmin, id, displayName })

  return (
    <AuthContext.Provider
      value={{
        loading,
        id,
        displayName,
        isAdmin,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}