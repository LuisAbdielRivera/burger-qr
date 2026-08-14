import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  ChefHat,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const navItems = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/admin/productos',
    label: 'Productos',
    icon: UtensilsCrossed,
  },
  {
    to: '/admin/pedidos',
    label: 'Pedidos',
    icon: ClipboardList,
  },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAdminAuth()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/admin/login')
  }

  const handleNavigation = () => {
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#050505]/95 px-4 backdrop-blur-md md:hidden">

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <Menu size={26} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-[#FFD400]">
            LOS CANELOS
          </span>

          <ChefHat
            size={24}
            strokeWidth={2.4}
            className="text-[#D9FF00]"
          />
        </div>

        <div className="h-11 w-11" />
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-white/10 bg-[#050505] shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >

        <div className="flex h-full flex-col px-6 py-6">

          {/* Header sidebar */}
          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white">
                Administrador
              </p>

              <div className="mt-2 flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#FFD400]">
                  LOS CANELOS
                </h1>

                <ChefHat
                  size={27}
                  strokeWidth={2.5}
                  className="text-[#D9FF00]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>

          </div>

          {/* Navegación */}
          <nav className="mt-10 space-y-3">

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigation}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-bold transition-all ${
                    isActive
                      ? 'bg-[#F700C6] text-white shadow-[0_0_25px_rgba(247,0,198,0.18)]'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    size={23}
                    strokeWidth={2.3}
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-[#D9FF00]'
                    }
                  />

                  <span>{item.label}</span>
                </Link>
              )
            })}

          </nav>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex items-center gap-4 rounded-2xl border border-[#F700C6]/60 bg-[#F700C6]/5 px-4 py-4 text-base font-bold text-[#F700C6] transition hover:bg-[#F700C6] hover:text-white"
          >
            <LogOut size={23} strokeWidth={2.3} />

            <span>Cerrar sesión</span>
          </button>

          {/* Decoración */}
          <div className="pointer-events-none mt-auto flex items-end justify-between pt-10">

            <div className="grid grid-cols-6 gap-2 opacity-60">
              {Array.from({ length: 30 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index % 3 === 0
                      ? 'bg-[#F700C6]'
                      : 'bg-[#D9FF00]'
                  }`}
                />
              ))}
            </div>

            <ChefHat
              size={90}
              strokeWidth={1.2}
              className="text-[#FFD400]/30"
            />

          </div>

        </div>
      </aside>

      <div className="flex min-h-screen">

        {/* Sidebar desktop */}
        <aside className="relative hidden w-[320px] shrink-0 overflow-hidden border-r border-white/10 bg-[#050505] md:flex md:flex-col">

          <div className="flex h-full flex-col px-7 py-7">

            {/* Marca */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-white">
                Administrador
              </p>

              <div className="mt-3 flex items-center gap-3">
                <h1 className="text-3xl font-black text-[#FFD400]">
                  LOS CANELOS
                </h1>

                <ChefHat
                  size={32}
                  strokeWidth={2.4}
                  className="text-[#D9FF00]"
                />
              </div>
            </div>

            <nav className="mt-12 space-y-3">

              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F700C6] text-white shadow-[0_0_25px_rgba(247,0,198,0.18)]'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon
                      size={24}
                      strokeWidth={2.4}
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-[#D9FF00] group-hover:text-[#FFD400]'
                      }
                    />

                    <span>{item.label}</span>
                  </Link>
                )
              })}

            </nav>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-10 flex items-center gap-4 rounded-2xl border border-[#F700C6]/60 bg-[#F700C6]/5 px-5 py-4 text-left text-base font-bold text-[#F700C6] transition hover:bg-[#F700C6] hover:text-white"
            >
              <LogOut
                size={24}
                strokeWidth={2.4}
              />

              <span>Cerrar sesión</span>
            </button>

            <div className="pointer-events-none relative mt-auto h-56">

              <div className="absolute bottom-0 left-0 grid grid-cols-8 gap-3 opacity-60">
                {Array.from({ length: 48 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index % 3 === 0
                        ? 'bg-[#F700C6]'
                        : 'bg-[#D9FF00]'
                    }`}
                  />
                ))}
              </div>

              <ChefHat
                size={120}
                strokeWidth={1}
                className="absolute bottom-2 right-3 text-[#FFD400]/20"
              />

            </div>

          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-black px-4 py-6 sm:px-6 lg:px-10">

          <div className="mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white sm:text-sm">
              Panel administrativo
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Control{' '}
              <span className="text-[#D9FF00]">
                central
              </span>
            </h2>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-[#F700C6]" />
              <span className="h-1 w-6 rounded-full bg-[#FFD400]" />
              <span className="h-1 w-10 rounded-full bg-[#D9FF00]" />
            </div>

          </div>

          <Outlet />

        </main>

      </div>
    </div>
  )
}