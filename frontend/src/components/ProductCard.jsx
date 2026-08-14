import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import {
  Plus,
  Eye,
  Check,
} from 'lucide-react'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <article className="overflow-hidden rounded-[26px] border border-white/10 bg-[#080808]">

      <Link
        to={`/producto?id=${encodeURIComponent(product.id)}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-3 top-3">

            <span className="flex items-center gap-1.5 rounded-full bg-[#D9FF00] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">

              <Check
                size={12}
                strokeWidth={3}
              />

              Disponible

            </span>

          </div>

        </div>
      </Link>


      <div className="p-4 sm:p-5">

        <div className="min-w-0">

          <h2 className="text-lg font-black leading-tight text-white sm:text-xl">
            {product.name}
          </h2>

          {product.desc && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-neutral-500">
              {product.desc}
            </p>
          )}

        </div>


        <div className="mt-4 flex items-center justify-between gap-3">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              Precio
            </p>

            <p className="mt-0.5 text-2xl font-black text-[#FFD400]">
              ${Number(product.price).toLocaleString()}
            </p>

          </div>


          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F700C6] text-white shadow-lg shadow-[#F700C6]/10 transition hover:bg-[#ff25d4] active:scale-95"
            aria-label={`Agregar ${product.name}`}
          >
            <Plus
              size={23}
              strokeWidth={2.5}
            />
          </button>

        </div>


        <Link
          to={`/producto?id=${encodeURIComponent(product.id)}`}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white"
        >

          <Eye size={15} />

          Ver detalle

        </Link>

      </div>

    </article>
  )
}