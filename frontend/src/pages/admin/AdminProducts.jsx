import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  CircleCheck,
  CircleX,
  PackageOpen,
  ImagePlus,
  Save,
  X,
  AlertTriangle,
} from 'lucide-react'

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

  // Modal de eliminación
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    product: null,
  })

  const loadProducts = async () => {
    setLoading(true)

    try {
      setProducts(await getProducts())
      setError('')
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudieron cargar los productos.'
        )
      )
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

    if (
      !form.name.trim() ||
      !form.desc.trim() ||
      !form.price ||
      (!editing && !imageFile)
    ) {
      setError(
        editing
          ? 'Nombre, descripción y precio son obligatorios.'
          : 'En un producto nuevo también debes seleccionar una imagen.'
      )

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
          current.map((product) =>
            product.id === updated.id ? updated : product
          )
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
      setError(
        getApiError(
          requestError,
          'No se pudo guardar el producto.'
        )
      )
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

  // Abre nuestro modal personalizado
  const handleDelete = (product) => {
    setDeleteModal({
      open: true,
      product,
    })
  }

  // Confirma la eliminación
  const confirmDelete = async () => {
    const product = deleteModal.product

    if (!product) return

    setDeleteModal({
      open: false,
      product: null,
    })

    try {
      await deleteProduct(product.id)

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      )

      if (editing && form.id === product.id) {
        resetForm()
      }
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudo eliminar el producto.'
        )
      )
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      product: null,
    })
  }

  const productCount = useMemo(
    () => products.length,
    [products]
  )

  return (
    <div className="space-y-6">

      {deleteModal.open && deleteModal.product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#090909] shadow-2xl">

            {/* Línea superior */}
            <div className="h-1 bg-gradient-to-r from-[#F700C6] via-[#FFD400] to-[#D9FF00]" />

            <div className="p-6 sm:p-7">

              {/* Icono */}
              <div className="flex justify-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <AlertTriangle
                    size={32}
                    strokeWidth={1.8}
                  />
                </div>

              </div>

              {/* Texto */}
              <div className="mt-5 text-center">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                  Confirmar eliminación
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  ¿Eliminar producto?
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Estás a punto de eliminar
                  <span className="font-bold text-white">
                    {' '}{deleteModal.product.name}
                  </span>
                  . Esta acción no se puede deshacer.
                </p>

              </div>

              {/* Botones */}
              <div className="mt-7 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3.5 text-sm font-black text-white transition hover:bg-red-600"
                >
                  <Trash2 size={17} />
                  Eliminar
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[28px] border border-[#F700C6]/30 bg-[#080808] p-5 sm:p-7">

        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#F700C6]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">
                <UtensilsCrossed
                  size={24}
                  strokeWidth={2.3}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                  Menú
                </p>

                <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  Productos
                </h3>
              </div>

            </div>

            <p className="mt-4 max-w-xl text-sm text-neutral-400">
              Administra los productos que estarán disponibles
              para los clientes de Burger QR.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="rounded-2xl border border-[#D9FF00]/30 bg-[#D9FF00]/10 px-5 py-3 text-center">

              <p className="text-2xl font-black text-[#D9FF00]">
                {productCount}
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Productos
              </p>

            </div>

          </div>

        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

          <CircleX
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>

        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        <section className="relative overflow-hidden rounded-[28px] border border-[#FFD400]/25 bg-[#080808]">

          <div className="border-b border-white/10 px-5 py-5 sm:px-7">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                  Catálogo
                </p>

                <h4 className="mt-1 text-xl font-black text-white">
                  Tus productos
                </h4>

                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  Productos registrados en el sistema.
                </p>

              </div>

              <div className="hidden rounded-2xl bg-[#FFD400]/10 p-3 text-[#FFD400] sm:block">
                <PackageOpen size={25} />
              </div>

            </div>

          </div>


          <div className="p-4 sm:p-6">

            {loading ? (

              <div className="flex min-h-[220px] items-center justify-center">

                <div className="flex items-center gap-3 text-neutral-400">

                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9FF00]/30 border-t-[#D9FF00]" />

                  <span>
                    Cargando productos...
                  </span>

                </div>

              </div>

            ) : (

              <div className="grid gap-4 sm:grid-cols-2">

                {products.length === 0 && (

                  <div className="col-span-full flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/30 px-5 text-center">

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD400]/10 text-[#FFD400]">
                      <PackageOpen
                        size={32}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h5 className="font-black text-white">
                      No hay productos todavía
                    </h5>

                    <p className="mt-2 max-w-sm text-sm text-neutral-500">
                      Crea tu primer producto para comenzar
                      a construir el menú.
                    </p>

                  </div>

                )}


                {products.map((product) => (

                  <article
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-black/60"
                  >

                    {/* Imagen */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Estado */}
                      <div className="absolute left-3 top-3">

                        <span
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold backdrop-blur-md ${
                            product.available
                              ? 'bg-[#D9FF00]/90 text-black'
                              : 'bg-red-500/90 text-white'
                          }`}
                        >

                          {product.available ? (
                            <>
                              <CircleCheck size={13} />
                              Disponible
                            </>
                          ) : (
                            <>
                              <CircleX size={13} />
                              No disponible
                            </>
                          )}

                        </span>

                      </div>

                    </div>


                    {/* Información */}
                    <div className="p-4">

                      <h5 className="truncate font-black text-white">
                        {product.name}
                      </h5>

                      <p className="mt-1 text-2xl font-black text-[#FFD400]">
                        ${product.price}
                      </p>


                      {/* Acciones */}
                      <div className="mt-4 grid grid-cols-2 gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-[#F700C6]/30 bg-[#F700C6]/10 px-3 py-2.5 text-xs font-bold text-[#F700C6] transition hover:bg-[#F700C6] hover:text-white"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={15} />
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </div>
        </section>

        <section className="relative h-fit overflow-hidden rounded-[28px] border border-[#D9FF00]/30 bg-[#080808]">

          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#D9FF00]/10 blur-3xl" />

          <div className="relative border-b border-white/10 px-5 py-5 sm:px-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D9FF00]">
                  Administración
                </p>

                <h4 className="mt-1 text-xl font-black text-white">
                  {editing
                    ? 'Editar producto'
                    : 'Crear producto'}
                </h4>

                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  {editing
                    ? 'Actualiza la información del producto.'
                    : 'Agrega un nuevo producto al menú.'}
                </p>

              </div>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Cancelar edición"
                >
                  <X size={18} />
                </button>
              )}

            </div>

          </div>


          <form
            onSubmit={handleSave}
            className="space-y-5 p-5 sm:p-7"
          >

            {/* Nombre */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Nombre
              </span>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="Ej. Hamburguesa clásica"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-[#F700C6] focus:ring-2 focus:ring-[#F700C6]/10"
              />

            </label>


            {/* Descripción */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Descripción
              </span>

              <textarea
                value={form.desc}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    desc: e.target.value,
                  }))
                }
                placeholder="Describe los ingredientes del producto..."
                rows="4"
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-[#F700C6] focus:ring-2 focus:ring-[#F700C6]/10"
              />

            </label>


            {/* Precio */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Precio
              </span>

              <div className="relative mt-2">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#FFD400]">
                  $
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      price: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-white/10 bg-black py-3.5 pl-9 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/10"
                />

              </div>

            </label>


            {/* Disponibilidad */}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-[#D9FF00]/30">

              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    available: e.target.checked,
                  }))
                }
                className="h-5 w-5 cursor-pointer accent-[#D9FF00]"
              />

              <div>
                <p className="text-sm font-bold text-white">
                  Disponible para pedidos
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Los clientes podrán solicitar este producto.
                </p>
              </div>

            </label>


            {/* Imagen */}
            <label className="block">

              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {editing
                  ? 'Cambiar imagen'
                  : 'Imagen del producto'}
              </span>

              <div className="mt-2 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-black">

                <label className="flex cursor-pointer flex-col items-center justify-center px-5 py-6 text-center">

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">
                    <ImagePlus size={24} />
                  </div>

                  <p className="text-sm font-bold text-white">
                    Seleccionar imagen
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">
                    JPG, PNG o WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      handleImageFile(
                        e.target.files?.[0]
                      )
                    }
                    className="hidden"
                  />

                </label>

              </div>

            </label>


            {/* Vista previa */}
            {imagePreview && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">

                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Vista previa
                  </p>

                  <ImagePlus
                    size={16}
                    className="text-[#FFD400]"
                  />

                </div>

                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="max-h-64 w-full object-cover"
                />

              </div>
            )}


            {/* Botones */}
            <div className="flex flex-col gap-3 pt-2">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-[#F700C6]/10 transition hover:bg-[#ff25d4] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : editing ? (
                  <>
                    <Save size={18} />
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Crear producto
                  </>
                )}

              </button>


              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <X size={17} />
                  Cancelar edición
                </button>
              )}

            </div>

          </form>

        </section>

      </div>

    </div>
  )
}