import { useState, useEffect } from 'react'
import axiosInstance from '../lib/AxiosInstance'

type User = {
  _id: string
  name: string
  email: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      setUser(user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axiosInstance.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data)
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return { user, login, logout, loading, isAuthenticated: !!user }
}
