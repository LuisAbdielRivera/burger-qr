import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { getApiError } from '../../services/api.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      setError(getApiError(requestError, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950/95 p-8 shadow-xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-yellow-400/80">Área privada</p>
          <h1 className="text-4xl font-black text-white">Admin Login</h1>
          <p className="text-sm text-neutral-400">Accede al panel administrativo de Burger QR.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-neutral-300">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="admin@burgerqr.com"
              autoComplete="username"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="********"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 text-black font-black disabled:opacity-60"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
