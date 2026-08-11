# Burger QR Frontend

Frontend React + Vite conectado al backend Burger QR.

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

3. Asegúrate de tener el backend ejecutándose en `http://localhost:4000`.

4. Ejecuta:

```bash
npm run dev
```

## Flujo integrado

- `GET /api/products` para el menú público.
- `POST /api/auth/login` para el acceso administrativo.
- `POST/PUT/DELETE /api/products` para el CRUD de productos.
- `POST /api/orders` para crear pedidos.
- `GET /api/orders` para el panel administrativo.
- `PATCH /api/orders/:id/status` para actualizar estados.

El token JWT del administrador se guarda en `localStorage` y se agrega automáticamente a las peticiones protegidas.
