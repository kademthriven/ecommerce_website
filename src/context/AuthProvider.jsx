import { useCallback, useEffect, useMemo, useState } from 'react'
import { validateFirebaseToken } from '../api/auth'
import AuthContext from './authContext'

const TOKEN_STORAGE_KEY = 'token'
const TOKEN_EXPIRATION_STORAGE_KEY = 'tokenExpiration'
const SESSION_DURATION_MS = 5 * 60 * 1000
const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.'

function getStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)

    if (!token) {
      return null
    }

    const expirationTime = Number(
      window.localStorage.getItem(TOKEN_EXPIRATION_STORAGE_KEY),
    )

    if (!Number.isFinite(expirationTime) || expirationTime <= Date.now()) {
      return { isExpired: true }
    }

    return { expirationTime, isExpired: false, token }
  } catch {
    return null
  }
}

function storeSession(idToken, expirationTime) {
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, idToken)
    window.localStorage.setItem(
      TOKEN_EXPIRATION_STORAGE_KEY,
      String(expirationTime),
    )
  } catch {
    // Authentication still works in memory when browser storage is unavailable.
  }
}

function removeStoredSession() {
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_EXPIRATION_STORAGE_KEY)
  } catch {
    // The in-memory token is still cleared when browser storage is unavailable.
  }
}

function AuthProvider({ children }) {
  const [initialSession] = useState(getStoredSession)
  const [token, setToken] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [expirationTime, setExpirationTime] = useState(
    initialSession?.expirationTime ?? null,
  )
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(initialSession?.token))
  const [authNotice, setAuthNotice] = useState(
    initialSession?.isExpired ? SESSION_EXPIRED_MESSAGE : '',
  )

  useEffect(() => {
    if (!initialSession?.token) {
      removeStoredSession()
      return undefined
    }

    const controller = new AbortController()
    let isActive = true

    async function validateStoredToken() {
      try {
        const accountData = await validateFirebaseToken(initialSession.token, controller.signal)
        const email = accountData.users?.[0]?.email

        if (isActive) {
          if (initialSession.expirationTime > Date.now() && email) {
            setToken(initialSession.token)
            setUserEmail(email)
          } else {
            removeStoredSession()
            setExpirationTime(null)
            setAuthNotice(SESSION_EXPIRED_MESSAGE)
          }
        }
      } catch (error) {
        if (isActive && error.name !== 'AbortError') {
          removeStoredSession()
          setToken(null)
          setUserEmail(null)
          setExpirationTime(null)
          setAuthNotice('Your session could not be verified. Please log in again.')
        }
      } finally {
        if (isActive) {
          setIsAuthLoading(false)
        }
      }
    }

    validateStoredToken()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [initialSession])

  const login = useCallback((idToken, email) => {
    const newExpirationTime = Date.now() + SESSION_DURATION_MS

    storeSession(idToken, newExpirationTime)
    setToken(idToken)
    setUserEmail(email || null)
    setExpirationTime(newExpirationTime)
    setAuthNotice('')
    setIsAuthLoading(false)
  }, [])

  const logout = useCallback(() => {
    removeStoredSession()
    setToken(null)
    setUserEmail(null)
    setExpirationTime(null)
    setAuthNotice('')
    setIsAuthLoading(false)
  }, [])

  const expireSession = useCallback(() => {
    removeStoredSession()
    setToken(null)
    setUserEmail(null)
    setExpirationTime(null)
    setAuthNotice(SESSION_EXPIRED_MESSAGE)
    setIsAuthLoading(false)
  }, [])

  useEffect(() => {
    if (!token || !expirationTime) {
      return undefined
    }

    const remainingSessionTime = Math.max(expirationTime - Date.now(), 0)
    const logoutTimer = window.setTimeout(expireSession, remainingSessionTime)

    return () => window.clearTimeout(logoutTimer)
  }, [expirationTime, expireSession, token])

  const value = useMemo(
    () => ({
      authNotice,
      isLoggedIn: Boolean(token),
      isAuthLoading,
      login,
      logout,
      token,
      userEmail,
    }),
    [authNotice, isAuthLoading, login, logout, token, userEmail],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
