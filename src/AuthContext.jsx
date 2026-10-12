import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { apiConfigured } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const connectDemo = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (!apiConfigured) {
        throw new Error('This Vercel deployment needs VITE_API_BASE_URL set to your publicly hosted backend URL ending in /api. Save the variable and redeploy.')
      }
      const { data } = await api.post('/auth/demo')
      localStorage.setItem('campus_token', data.token)
      localStorage.setItem('campus_user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_user')
      setUser(null)
      setError(err?.response?.data?.error || err?.message || 'The campus demo could not connect.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { connectDemo() }, [connectDemo])

  return <AuthContext.Provider value={{ user, loading, error, connectDemo }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
