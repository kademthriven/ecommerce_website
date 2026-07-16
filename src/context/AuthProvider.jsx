import { useCallback, useMemo, useState } from 'react'
import AuthContext from './authContext'

function AuthProvider({ children }) {
  const [token, setToken] = useState(null)

  const login = useCallback((idToken) => {
    setToken(idToken)
  }, [])

  const logout = useCallback(() => {
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
