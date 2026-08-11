/**
 * EditItemModal - Modal para editar personalización de un item
 * Props:
 *  - item: object - item a editar
 *  - onSave: function - callback al guardar cambios
 *  - onClose: function - callback al cerrar
 */

import { useState } from 'react'

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

export default function EditItemModal({ item, onSave, onClose }) {
  const [selectedNotes, setSelectedNotes] = useState(item.notes || [])

  const toggleNote = (note) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter(n => n !== note))
    } else {
      setSelectedNotes([...selectedNotes, note])
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
      {/* Modal Panel */}
      <div className="w-full bg-gradient-to-t from-black to-neutral-950 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto border-t border-neutral-800">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-yellow-400">
                Personalizar
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                {item.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white text-2xl transition"
            >
              ✕
            </button>
          </div>

          {/* Opciones de personalización */}
          <div className="space-y-2 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
              Selecciona cómo quieres tu hamburguesa
            </p>

            {PERSONALIZATION_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition group"
              >
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(option)}
                  onChange={() => toggleNote(option)}
                  className="w-5 h-5 accent-yellow-400 cursor-pointer"
                />
                <span className="text-white group-hover:text-yellow-400 transition">
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Resumen de cambios */}
          {selectedNotes.length > 0 && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3">
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                Resumen
              </p>
              <div className="space-y-1">
                {selectedNotes.map((note) => (
                  <p
                    key={note}
                    className="text-sm text-yellow-400 flex items-center gap-2 before:content-['✓'] before:font-bold"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Precio final */}
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <span className="text-neutral-400">Total:</span>
            <span className="text-2xl font-black text-yellow-400">
              ${item.price.toLocaleString()}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black rounded-xl transition"
            >
              ✓ Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
