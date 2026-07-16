import { useCallback, useMemo, useState } from 'react'
import AuthContext from './authContext'

const TOKEN_STORAGE_KEY = 'token'

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function storeToken(idToken) {
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, idToken)
  } catch {
    // Authentication still works in memory when browser storage is unavailable.
  }
}

function removeStoredToken() {
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // The in-memory token is still cleared when browser storage is unavailable.
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)

  const login = useCallback((idToken) => {
    storeToken(idToken)
    setToken(idToken)
  }, [])

  const logout = useCallback(() => {
    removeStoredToken()
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(token),
      login,
      logout,
      token,
    }),
    [login, logout, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
