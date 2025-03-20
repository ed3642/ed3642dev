'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface UsernameContextType {
  username: string
  setUsername: (name: string) => void
}

const UsernameContext = createContext<UsernameContextType>({
  username: 'anon',
  setUsername: () => {},
})

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('anon')

  useEffect(() => {
    // check localstorage for username
    const storedName = localStorage.getItem('purple-win-username')
    if (storedName) {
      setUsername(storedName)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('purple-win-username', username)
  }, [username])

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  )
}

export function useUsername() {
  return useContext(UsernameContext)
}
