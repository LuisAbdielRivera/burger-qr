import { useState } from 'react'
import {
  X,
  Check,
  SlidersHorizontal,
  CircleCheck,
  ShoppingBag,
} from 'lucide-react'

const PERSONALIZATION_OPTIONS = [
  'Sin catsup',
  'Sin mostaza',
  'Sin mayonesa',
  'Sin cebolla',
  'Sin lechuga',
  'Sin tomate',
  'Sin chile',
  'Sin queso',
  'Extra queso',
  'Doble carne',
  'Con tocino',
  'Con aguacate',
  'Sin pan (solo carne)',
]

export default function EditItemModal({
  item,
  onSave,
  onClose,
}) {
  const [selectedNotes, setSelectedNotes] = useState(
    item.notes || []
  )

  const toggleNote = (note) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(
        selectedNotes.filter(
          (selected) => selected !== note
        )
      )
    } else {
      setSelectedNotes([
        ...selectedNotes,
        note,
      ])
    }
  }

  const handleSave = () => {
    onSave({
      ...item,
      notes: selectedNotes,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm">

      <div className="w-full max-w-2xl overflow-hidden rounded-t-[30px] border border-white/10 bg-[#080808] shadow-2xl">

        {/* Línea de identidad */}
        <div className="flex h-1">

          <span className="w-1/3 bg-[#F700C6]" />
          <span className="w-1/3 bg-[#FFD400]" />
          <span className="w-1/3 bg-[#D9FF00]" />

        </div>


        <div className="max-h-[85vh] overflow-y-auto">

          <header className="border-b border-white/10 px-5 py-5 sm:px-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">

                  <SlidersHorizontal
                    size={22}
                    strokeWidth={2}
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F700C6]">
                    Personalización
                  </p>

                  <h2 className="mt-1 text-lg font-black text-white sm:text-xl">
                    {item.name}
                  </h2>

                </div>

              </div>


              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={19} />
              </button>

            </div>

          </header>

          <div className="space-y-5 p-5 sm:p-6">

            <section>

              <div className="mb-3">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9FF00]">
                  ¿Cómo lo quieres?
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Selecciona las opciones que quieras modificar.
                </p>

              </div>


              <div className="grid gap-2 sm:grid-cols-2">

                {PERSONALIZATION_OPTIONS.map(
                  (option) => {

                    const selected =
                      selectedNotes.includes(option)

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          toggleNote(option)
                        }
                        className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          selected
                            ? 'border-[#F700C6]/50 bg-[#F700C6]/10'
                            : 'border-white/10 bg-black/40 hover:bg-white/5'
                        }`}
                      >

                        {/* Checkbox visual */}
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            selected
                              ? 'border-[#F700C6] bg-[#F700C6] text-white'
                              : 'border-neutral-700 bg-black'
                          }`}
                        >

                          {selected && (
                            <Check
                              size={14}
                              strokeWidth={3}
                            />
                          )}

                        </span>


                        <span
                          className={`text-sm font-semibold ${
                            selected
                              ? 'text-white'
                              : 'text-neutral-300'
                          }`}
                        >
                          {option}
                        </span>

                      </button>
                    )
                  }
                )}

              </div>

            </section>

            {selectedNotes.length > 0 && (

              <section className="overflow-hidden rounded-[22px] border border-[#F700C6]/25 bg-[#F700C6]/5">

                <div className="flex items-center gap-2 border-b border-[#F700C6]/10 px-4 py-3">

                  <CircleCheck
                    size={17}
                    className="text-[#F700C6]"
                  />

                  <p className="text-xs font-bold uppercase tracking-wider text-[#F700C6]">
                    Cambios seleccionados
                  </p>

                </div>


                <div className="space-y-2 p-4">

                  {selectedNotes.map((note) => (

                    <div
                      key={note}
                      className="flex items-center gap-2 text-sm text-neutral-300"
                    >

                      <span className="h-1.5 w-1.5 rounded-full bg-[#D9FF00]" />

                      {note}

                    </div>

                  ))}

                </div>

              </section>

            )}

            <section className="flex items-center justify-between rounded-[22px] border border-[#FFD400]/20 bg-[#FFD400]/5 px-4 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">

                  <ShoppingBag size={19} />

                </div>

                <div>

                  <p className="text-xs text-neutral-500">
                    Precio
                  </p>

                  <p className="text-sm font-bold text-white">
                    {item.name}
                  </p>

                </div>

              </div>


              <p className="text-2xl font-black text-[#FFD400]">
                ${Number(item.price).toLocaleString()}
              </p>

            </section>

            <div className="grid grid-cols-2 gap-3 pt-1">

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>


              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-[#F700C6]/10 transition hover:bg-[#ff25d4]"
              >

                <Check
                  size={18}
                  strokeWidth={2.5}
                />

                Guardar cambios

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}