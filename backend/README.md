# Burger QR Backend

Backend de Burger QR con Node.js, Express, Prisma, PostgreSQL, JWT, Multer y Cloudinary.

## Requisitos

- Node.js 18+
- PostgreSQL
- Cuenta de Cloudinary

## Instalación

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

## Variables de entorno

Copia `.env.example` a `.env` y completa las credenciales locales.

> Nunca subas `.env` al repositorio.

## Crear administrador

Define temporalmente `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno y ejecuta:

```bash
npm run admin:create
```

El script almacena únicamente el hash de la contraseña mediante bcrypt.

## Desarrollo

```bash
npm run dev
```

Servidor: `http://localhost:4000`

Health check: `GET /api/health`

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
```

## Endpoints principales

### Auth

- `POST /api/auth/login`

### Productos

- `GET /api/products` — público
- `POST /api/products` — admin
- `PUT /api/products/:id` — admin
- `DELETE /api/products/:id` — admin

Las operaciones de escritura utilizan `multipart/form-data` para soportar imágenes.

### Pedidos

- `POST /api/orders` — público, para clientes
- `GET /api/orders` — admin
- `PATCH /api/orders/:id/status` — admin

## Cambios de esta versión

- Separación del servicio de Cloudinary en `src/services/cloudinary.service.js`.
- Eliminación del helper duplicado `cloudinaryUpload.js`.
- Middleware global de errores.
- `GET /api/orders` protegido con JWT.
- `OrderItem.unitPrice` para conservar el precio histórico de cada producto.
- `Product.imagePublicId` para poder administrar/eliminar imágenes de Cloudinary.
- Conversión segura de `available` cuando se usa `multipart/form-data`.
- Validaciones básicas de precio, cantidad y disponibilidad.
- Creación de administrador sin contraseña hardcodeada.
- Health check `/api/health`.
