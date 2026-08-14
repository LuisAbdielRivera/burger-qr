import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Copy,
  Check,
  Store,
  Smartphone,
  TicketCheck,
  ArrowLeft,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const location = useLocation()

  const [code, setCode] = useState(
    location.state?.code ||
      sessionStorage.getItem('burgerqr:last_order_code') ||
      ''
  )

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (location.state?.code) {
      setCode(location.state.code)
    }
  }, [location.state])

  const copyCode = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(String(code))
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2500)
    } catch {
      setCopied(false)
    }
  }

  if (!code) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-10 text-white">

        {/* Fondo */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#F700C6]/10 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#D9FF00]/10 blur-[100px]" />

        <section className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-[#080808] p-6 text-center sm:p-8">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">
            <AlertCircle
              size={32}
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#FFD400]">
            Pedido
          </p>

          <h1 className="mt-2 text-2xl font-black text-white">
            No hay un pedido reciente
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            No encontramos un código de pedido guardado
            en este dispositivo.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#ff25d4]"
          >
            <ArrowLeft size={18} />
            Volver al menú
          </button>

        </section>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6 sm:py-12">

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#F700C6]/10 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[#D9FF00]/10 blur-[110px]" />



      <div className="relative mx-auto w-full max-w-md">

        <section className="text-center">

          {/* Indicador */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D9FF00]/10 text-[#D9FF00]">

            <CheckCircle2
              size={48}
              strokeWidth={1.7}
            />

          </div>


          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-[#D9FF00] sm:text-xs">
            Pedido confirmado
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            ¡Pedido recibido!
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-400">
            Tu pedido ya llegó al encargado y está listo
            para comenzar su preparación.
          </p>

        </section>

        <section className="mt-7 rounded-[24px] border border-[#FFD400]/25 bg-[#FFD400]/5 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
              <AlertCircle size={19} />
            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-[#FFD400]">
                Importante
              </p>

              <p className="mt-1.5 text-xs leading-5 text-neutral-400">
                Presenta este código al encargado para
                identificar y recibir tu pedido.
              </p>

            </div>

          </div>

        </section>

        <section className="mt-6">

          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
            Tu código de pedido
          </p>


          <div className="relative overflow-hidden rounded-[28px] border border-[#F700C6]/40 bg-[#080808]">

            {/* Línea superior */}
            <div className="flex h-1">

              <span className="w-1/3 bg-[#F700C6]" />
              <span className="w-1/3 bg-[#FFD400]" />
              <span className="w-1/3 bg-[#D9FF00]" />

            </div>


            <div className="px-5 py-7 text-center sm:py-8">

              <div className="flex items-center justify-center gap-2 text-[#F700C6]">

                <TicketCheck
                  size={18}
                  strokeWidth={2}
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  Código
                </span>

              </div>


              <p className="mt-4 break-all text-5xl font-black tracking-[0.15em] text-[#FFD400] sm:text-6xl">
                {code}
              </p>


              <p className="mt-4 text-xs text-neutral-600">
                Guarda este código para recoger tu pedido.
              </p>

            </div>

          </div>

        </section>

        <section className="mt-6">

          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            ¿Qué sigue?
          </p>


          <div className="space-y-2">

            {/* Paso 1 */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#080808] p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F700C6]/10 text-[#F700C6]">
                <ClipboardCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Guarda tu código
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Puedes tomar una captura de esta pantalla.
                </p>
              </div>

            </div>


            {/* Paso 2 */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#080808] p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9FF00]/10 text-[#D9FF00]">
                <Store size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Acércate al mostrador
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Espera a que tu pedido esté listo.
                </p>
              </div>

            </div>


            {/* Paso 3 */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#080808] p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
                <Smartphone size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Muestra tu código
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  El encargado verificará tu pedido.
                </p>
              </div>

            </div>

          </div>

        </section>

        <section className="mt-6 space-y-3">

          {/* Copiar */}
          <button
            type="button"
            onClick={copyCode}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition ${
              copied
                ? 'bg-[#D9FF00] text-black'
                : 'bg-[#F700C6] text-white hover:bg-[#ff25d4]'
            }`}
          >

            {copied ? (
              <>
                <Check size={18} />
                ¡Código copiado!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copiar código
              </>
            )}

          </button>


          {/* Volver */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Volver al menú
          </button>

        </section>

        <p className="pb-4 pt-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-700">
          Gracias por tu compra
        </p>

      </div>

    </main>
  )
}