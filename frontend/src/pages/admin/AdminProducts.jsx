import { useEffect, useMemo, useState } from 'react'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../services/products.service.js'
import { getApiError } from '../../services/api.js'

const emptyForm = {
  id: null,
  name: '',
  desc: '',
  price: '',
  available: true,
  image: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    try {
      setProducts(await getProducts())
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudieron cargar los productos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setEditing(false)
  }

  const handleImageFile = (file) => {
    if (!file) {
      setImageFile(null)
      setImagePreview(form.image || '')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.desc.trim() || !form.price || (!editing && !imageFile)) {
      setError(editing ? 'Nombre, descripción y precio son obligatorios.' : 'En un producto nuevo también debes seleccionar una imagen.')
      return
    }

    setSaving(true)
    setError('')

    try {
      if (editing) {
        const updated = await updateProduct(form.id, {
          name: form.name.trim(),
          desc: form.desc.trim(),
          price: form.price,
          available: form.available,
          imageFile,
        })

        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? updated : product)),
        )
      } else {
        const created = await createProduct({
          name: form.name.trim(),
          desc: form.desc.trim(),
          price: form.price,
          available: form.available,
          imageFile,
        })

        setProducts((current) => [created, ...current])
      }

      resetForm()
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo guardar el producto.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      desc: product.desc,
      price: String(product.price),
      available: product.available,
      image: product.image,
    })
    setImageFile(null)
    setImagePreview(product.image || '')
    setEditing(true)
    setError('')
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return

    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))

      if (editing && form.id === product.id) resetForm()
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo eliminar el producto.'))
    }
  }

  const productCount = useMemo(() => products.length, [products])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-white">Productos</h3>
            <p className="text-sm text-neutral-400">Administración conectada a PostgreSQL y Cloudinary.</p>
          </div>
          <span className="rounded-full bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-300">
            {productCount} productos
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <h4 className="mb-4 text-lg font-black text-white">Listado de productos</h4>

          {loading ? (
            <p className="text-neutral-400">Cargando productos...</p>
          ) : (
            <div className="space-y-4">
              {products.length === 0 && <p className="text-neutral-500">No hay productos todavía.</p>}

              {products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-white/10 bg-black/80 p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold text-white">{product.name}</p>
                          <p className="text-sm text-neutral-400">${product.price}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.available
                            ? 'bg-emerald-400/10 text-emerald-300'
                            : 'bg-red-400/10 text-red-300'
                        }`}>
                          {product.available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <h4 className="mb-4 text-lg font-black text-white">
            {editing ? 'Editar producto' : 'Crear producto'}
          </h4>

          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-sm text-neutral-300">
              Título
              <input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block text-sm text-neutral-300">
              Descripción
              <textarea
                value={form.desc}
                onChange={(e) => setForm((current) => ({ ...current, desc: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
                rows="3"
              />
            </label>

            <label className="block text-sm text-neutral-300">
              Precio
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((current) => ({ ...current, available: e.target.checked }))}
                className="h-5 w-5 accent-yellow-400"
              />
              Disponible para nuevos pedidos
            </label>

            <label className="block text-sm text-neutral-300">
              {editing ? 'Cambiar imagen (opcional)' : 'Imagen del producto'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none"
              />
            </label>

            {imagePreview && (
              <div className="rounded-3xl border border-white/10 bg-black/80 p-3">
                <p className="text-sm text-neutral-400">Vista previa</p>
                <img src={imagePreview} alt="Vista previa" className="mt-3 w-full max-h-64 rounded-3xl object-cover" />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 text-black font-black disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar producto'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
