import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setUser({ username: parseJwt(token)?.sub })
    } else {
      setUser(null)
    }
  }, [token])

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }

  async function login(username, password) {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    setToken(data.access_token)
    localStorage.setItem('token', data.access_token)
    setUser({ username: parseJwt(data.access_token)?.sub })
  }

  async function register(username, password, email) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    })
    if (!res.ok) throw new Error('Registration failed')
    // Optionally auto-login after registration
    await login(username, password)
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}