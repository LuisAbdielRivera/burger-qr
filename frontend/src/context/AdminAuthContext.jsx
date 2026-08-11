import { createContext, useContext, useEffect, useState } from 'react'
import {
  getStoredToken,
  loginAdmin,
  logoutAdmin,
} from '../services/auth.service.js'

const AdminAuthContext = createContext(null)

export const useAdminAuth = () => useContext(AdminAuthContext)

export default function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())

  useEffect(() => {
    const handleLogout = () => setToken(null)
    window.addEventListener('burgerqr:logout', handleLogout)

    return () => window.removeEventListener('burgerqr:logout', handleLogout)
  }, [])

  const login = async ({ email, password }) => {
    const data = await loginAdmin(email, password)
    setToken(data.token)
    return data
  }

  const logout = () => {
    logoutAdmin()
    setToken(null)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        isAdminLoggedIn: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
