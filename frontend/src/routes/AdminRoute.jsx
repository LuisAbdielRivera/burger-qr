import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

export default function AdminRoute({ children }) {
  const { isAdminLoggedIn } = useAdminAuth()

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
