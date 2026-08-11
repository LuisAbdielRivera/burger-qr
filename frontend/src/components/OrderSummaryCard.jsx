/**
 * OrderSummaryCard - Card individual de item en el resumen del pedido
 * Props:
 *  - item: objeto con { name, price, desc?, notes?, uniqueId }
 *  - isLast: boolean para separador
 *  - onRemove: function(uniqueId) - para eliminar item
 *  - onEdit: function(uniqueId) - para editar personalización
 */

export default function OrderSummaryCard({ item, isLast, onRemove, onEdit }) {
  return (
    <div className="group bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300">
      {/* Item Content */}
      <div className="p-4 space-y-3">
        {/* Nombre, Precio y Acciones */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition">
              {item.name}
            </h3>
            {item.desc && (
              <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
                {item.desc}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-black text-yellow-400 text-lg">
              ${item.price.toLocaleString()}
            </p>
            {/* Botones de acción */}
            <div className="flex gap-2">
              {/* Botón Editar */}
              {(item.notes || onEdit) && (
                <button
                  onClick={() => onEdit?.(item.uniqueId)}
                  className="text-xs bg-white/10 hover:bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-lg transition border border-yellow-400/30 hover:border-yellow-400"
                  title="Editar personalización"
                >
                  Editar
                </button>
              )}
              {/* Botón Eliminar */}
              <button
                onClick={() => onRemove?.(item.uniqueId)}
                className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-2 py-1 rounded-lg transition border border-red-500/30 hover:border-red-500"
                title="Eliminar del carrito"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Personalizaciones */}
        {item.notes && item.notes.length > 0 && (
          <div className="bg-black/40 border border-neutral-800 rounded-lg p-3 space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Personalización
            </p>
            {item.notes.map((note, i) => (
              <p
                key={i}
                className="text-sm text-neutral-300 flex items-start gap-2 before:content-['✓'] before:text-yellow-400 before:font-bold before:mr-1"
              >
                {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Separator visual */}
      {!isLast && <div className="h-px bg-neutral-800" />}
    </div>
  )
}

