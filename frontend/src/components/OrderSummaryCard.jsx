import {
  Pencil,
  Trash2,
  Check,
  Tag,
} from 'lucide-react'

export default function OrderSummaryCard({
  item,
  isLast,
  onRemove,
  onEdit,
}) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-white/10 bg-[#080808]">

      <div className="p-4 sm:p-5">

        <div className="flex items-start gap-4">

          <div className="min-w-0 flex-1">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F700C6]/10 text-[#F700C6]">
                <Tag size={18} />
              </div>

              <div className="min-w-0">

                <h3 className="truncate text-base font-black text-white sm:text-lg">
                  {item.name}
                </h3>

                {item.desc && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
                    {item.desc}
                  </p>
                )}

              </div>

            </div>

          </div>


          <div className="shrink-0 text-right">

            <p className="text-lg font-black text-[#FFD400]">
              ${Number(item.price).toLocaleString()}
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-600">
              c/u
            </p>

          </div>

        </div>


        {item.notes && item.notes.length > 0 && (

          <div className="mt-4 rounded-2xl border border-[#F700C6]/20 bg-[#F700C6]/5 p-3">

            <div className="mb-2 flex items-center gap-2">

              <Check
                size={15}
                className="text-[#F700C6]"
                strokeWidth={2.5}
              />

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F700C6]">
                Personalización
              </p>

            </div>

            <div className="space-y-1">

              {item.notes.map((note, index) => (

                <p
                  key={index}
                  className="flex items-start gap-2 text-xs leading-5 text-neutral-300"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#D9FF00]" />
                  {note}
                </p>

              ))}

            </div>

          </div>

        )}


        <div className="mt-4 flex gap-2">

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(item.uniqueId)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F700C6]/25 bg-[#F700C6]/5 px-3 py-2.5 text-xs font-bold text-[#F700C6] transition hover:bg-[#F700C6]/10"
            >
              <Pencil size={15} />
              Editar
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove?.(item.uniqueId)}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">
              Eliminar
            </span>
          </button>

        </div>

      </div>

      {!isLast && (
        <div className="h-px bg-white/5" />
      )}

    </article>
  )
}