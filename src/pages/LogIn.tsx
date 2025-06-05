import React, { useState } from 'react'
import '../styles/LoginPage.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../lib/AxiosInstance'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await axiosInstance.post('/api/auth', {
        email,
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      setSuccess(true)
      navigate('/chats')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred')
      } else {
        setError('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Login successful!</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="register-link">
          Don't have an account? <a href="#">Register</a>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
