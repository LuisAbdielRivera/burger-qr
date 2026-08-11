import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const [code, setCode] = useState(location.state?.code || sessionStorage.getItem('burgerqr:last_order_code') || '')

  useEffect(() => {
    if (location.state?.code) setCode(location.state.code)
  }, [location.state])

  const copyCode = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(String(code))
      alert(`Código ${code} copiado al portapapeles`)
    } catch {
      alert(`Tu código es: ${code}`)
    }
  }

  if (!code) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-5 gap-5 text-center">
        <h1 className="text-3xl font-black text-yellow-400">No hay un pedido reciente</h1>
        <button onClick={() => navigate('/')} className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
          Volver al menú
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-5 space-y-6">
      <div className="text-6xl">✓</div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-yellow-400">¡Pedido Recibido!</h1>
        <p className="text-neutral-400 text-sm">Tu pedido ha llegado al encargado.</p>
      </div>

      <div className="w-full bg-blue-500/20 border border-blue-400/50 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-blue-400 uppercase tracking-wider font-bold">ⓘ Importante</p>
        <p className="text-sm text-blue-300">
          Tu pedido se preparará cuando presentes este código al encargado.
          <span className="block mt-2 font-bold">Te recomendamos tomar una captura de pantalla.</span>
        </p>
      </div>

      <div className="w-full">
        <p className="text-xs text-neutral-500 uppercase tracking-wider text-center mb-3">
          Tu código de pedido
        </p>
        <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/50 rounded-2xl p-6 text-center">
          <p className="text-7xl font-black text-yellow-400 tracking-widest">{code}</p>
        </div>
      </div>

      <div className="w-full space-y-3 text-center">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-sm text-neutral-300"><span className="text-yellow-400 font-bold">Paso 1:</span> Guarda este código</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-sm text-neutral-300"><span className="text-yellow-400 font-bold">Paso 2:</span> Acércate al mostrador</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-sm text-neutral-300"><span className="text-yellow-400 font-bold">Paso 3:</span> Muestra el código al encargado</p>
        </div>
      </div>

      <div className="w-full space-y-3 pt-4">
        <button onClick={() => navigate('/')} className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black rounded-2xl">
          ← Volver al menú
        </button>
        <button onClick={copyCode} className="w-full py-3 px-4 bg-white/10 text-white font-bold rounded-xl border border-white/20">
          📋 Copiar código
        </button>
      </div>
    </div>
  )
}
