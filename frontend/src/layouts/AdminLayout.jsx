import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:flex">
        <aside className="w-full md:w-72 border-b border-white/10 md:border-b-0 md:border-r border-white/10 bg-neutral-950/90 px-5 py-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">Administrador</p>
              <h1 className="mt-2 text-2xl font-black text-yellow-400">Burger QR</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-200 transition hover:bg-yellow-500/10 hover:text-yellow-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-left text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="flex-1 p-5"> 
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-400">Panel administrativo</p>
              <h2 className="text-3xl font-black text-white">Control central</h2>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
