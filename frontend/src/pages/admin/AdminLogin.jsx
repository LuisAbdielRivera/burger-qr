import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { getApiError } from '../../services/api.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/admin/dashboard', { replace: true })
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudo iniciar sesión.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10 text-white">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Magenta */}
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#F700C6]/10 blur-[100px]" />

        {/* Lima */}
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[#D9FF00]/10 blur-[100px]" />

        {/* Amarillo */}
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD400]/5 blur-[100px]" />

      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Línea decorativa */}
        <div className="mb-3 flex h-1.5 w-full overflow-hidden rounded-full">

          <span className="w-1/3 bg-[#F700C6]" />
          <span className="w-1/3 bg-[#FFD400]" />
          <span className="w-1/3 bg-[#D9FF00]" />

        </div>

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#080808] shadow-2xl">

          {/* Encabezado */}
          <div className="border-b border-white/10 px-6 pb-7 pt-8 text-center sm:px-8 sm:pt-10">

            {/* Icono */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">

              <ShieldCheck
                size={34}
                strokeWidth={1.8}
              />

            </div>


            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#FFD400] sm:text-xs">
              Área privada
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              LOS CANELOS
            </h1>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-500">
              Ingresa al panel administrativo para
              gestionar tu negocio.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 sm:p-8"
          >

            {/* Correo */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Correo electrónico
              </span>

              <div className="relative mt-2">

                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-[#F700C6] focus:ring-2 focus:ring-[#F700C6]/10"
                  placeholder="admin@burgerqr.com"
                  autoComplete="username"
                />

              </div>

            </label>


            {/* Contraseña */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Contraseña
              </span>

              <div className="relative mt-2">

                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-[#F700C6] focus:ring-2 focus:ring-[#F700C6]/10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-white/5 hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </label>


            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm leading-5 text-red-300">
                  {error}
                </p>

              </div>
            )}


            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-[#F700C6]/10 transition hover:bg-[#ff25d4] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (

                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Iniciando sesión...
                </>

              ) : (

                <>
                  Entrar al panel

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>

              )}

            </button>

          </form>

          <div className="border-t border-white/5 px-6 py-4 text-center">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-700">
              Acceso administrativo
            </p>

          </div>

        </section>

      </div>

    </main>
  )
}