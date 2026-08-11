import AppRoutes from './routes/AppRoutes.jsx'
import AdminAuthProvider from './context/AdminAuthContext.jsx'

export default function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  )
}