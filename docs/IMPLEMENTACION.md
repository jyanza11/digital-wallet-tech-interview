# Recap: Implementación Digital Wallet (ePayco)

## Estructura del monorepo

```
digital-wallet/
├── apps/
│   ├── api/          # NestJS + Prisma + Swagger (puerto 3001)
│   └── web/          # Next.js (puerto 3000) — pendiente de implementar
├── packages/
│   ├── database/     # Prisma schema + client + tipos
│   ├── ui/           # Componentes compartidos (Button, Card, Code)
│   ├── eslint-config/
│   └── typescript-config/
```

---

## API implementada

### Base URL
- **API:** `http://localhost:3001/api`
- **Swagger:** `http://localhost:3001/api/docs`
- **CORS:** permitido para `http://localhost:3000` (frontend)

### 1. Clientes (`/api/clients`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/clients/register` | Registrar cliente y crear billetera |

**Body (registro):**
```json
{
  "document": "9999999999",
  "name": "Juan Jose Yanza Herrera",
  "email": "jjyanza1@gmail.com",
  "phone": "0987654321"
}
```

---

### 2. Billetera (`/api/wallet`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/wallet/recharge` | Recargar billetera |
| POST | `/api/wallet/balance` | Consultar saldo |

**Body (recarga):**
```json
{
  "document": "9999999999",
  "phone": "0987654321",
  "amount": 1500
}
```

**Body (consulta saldo):**
```json
{
  "document": "9999999999",
  "phone": "0987654321"
}
```

---

### 3. Pagos con OTP (`/api/payments`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/payments/request` | Solicitar pago → genera OTP y envía por email |
| POST | `/api/payments/confirm` | Confirmar pago con OTP |
| GET | `/api/payments/session/:id` | Estado de sesión de pago |

**Body (solicitar pago):**
```json
{
  "document": "9999999999",
  "phone": "0987654321",
  "amount": 50
}
```

**Body (confirmar pago):**
```json
{
  "sessionId": "uuid-de-sesion",
  "token": "123456"
}
```

---

## Formato de respuesta API

Todas las respuestas pasan por un interceptor:

```json
{
  "success": true,
  "message": "Mensaje opcional",
  "data": { ... }
}
```

Errores (4xx/5xx) devuelven `success: false` y estructura consistente vía `HttpExceptionFilter`.

---

## Backend técnico

### Base de datos y Prisma

- **ORM:** Prisma (`@repo/database`) con MySQL
- **Schema:** `packages/database/prisma/schema.prisma`
- **Modelos:** `Client`, `Wallet`, `Transaction`, `PaymentSession`, `LoginOtp`
- **Transacciones:** `$transaction` en recargas y pagos (atomicidad)
- **Migraciones:** Prisma Migrate para versionado del schema

**Configuración de base de datos:**

1. **Levantar MySQL con Docker Compose** (recomendado, base limpia):
   ```bash
   # Desde la raíz del proyecto
   docker compose up -d
   ```
   Base de datos limpia y lista. Para resetear (eliminar datos):
   ```bash
   docker compose down -v
   docker compose up -d
   ```
   **DATABASE_URL** con compose: `mysql://root:root@localhost:3306/digital_wallet`

   **Alternativa con docker run:**
   ```bash
   docker run --name mysql-wallet \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=digital_wallet \
     -p 3306:3306 -d mysql:8.0
   ```

2. **Configurar `DATABASE_URL`** en `packages/database/.env` y `apps/api/.env`:
   ```env
   # Si se usó docker-compose:
   DATABASE_URL="mysql://root:root@localhost:3306/digital_wallet"
   ```

3. **Generar cliente Prisma:**
   ```bash
   pnpm --filter @repo/database exec prisma generate
   ```

4. **Aplicar migraciones:**
   ```bash
   # Desarrollo (crea migraciones con historial)
   pnpm --filter @repo/database exec prisma migrate dev
   
   # O push directo (sin historial, solo desarrollo)
   pnpm --filter @repo/database exec prisma db push
   ```

5. **Ver datos con Prisma Studio:**
   ```bash
   pnpm --filter @repo/database exec prisma studio
   ```
   Abre http://localhost:5555

**Nota:** `apps/api` también necesita `DATABASE_URL` en su `.env` (mismo valor).

### Email

- **Adaptadores:** Patrón adapter para múltiples proveedores
- **Proveedores:** Resend, Gmail (SMTP), Console (solo logs)
- **Templates:** Handlebars (`.hbs`) en `apps/api/src/email/templates/`
- **Configuración:** Variable `EMAIL_PROVIDER` en `apps/api/.env`

### Validación y documentación

- **Validación:** class-validator en DTOs
- **Docs:** Swagger en `/api/docs` (configurado con `@nestjs/swagger`)
- **Respuestas:** Interceptor unifica formato `{ success, message, data?, error? }`
- **Errores:** HttpExceptionFilter para respuestas consistentes

---

## Frontend (`apps/web`) — implementado

### Stack tecnológico

- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **Estilos:** Tailwind CSS v4
- **UI:** shadcn/ui (componentes accesibles)
- **Formularios:** React Hook Form + Zod (validación)
- **Estado:** Zustand (sesión persistida en localStorage)
- **HTTP:** Fetch API con cliente en `lib/api.ts`

### Cliente API

- **Archivo:** `apps/web/lib/api.ts`
- **Estructura de respuesta:** `{ success, message, data?, error? }` (según enunciado)
- **Funciones:** `registerClient`, `rechargeWallet`, `checkBalance`, `requestPayment`, `confirmPayment`, `requestLoginOtp`, `confirmLoginOtp`

### Configuración

- **Variable de entorno:** `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3001/api`)
- **Archivo:** Copiar `apps/web/.env.example` a `apps/web/.env.local` si se usa otra URL

### Rutas y flujos (enunciado)

| Ruta | Funcionalidad | Enunciado |
|------|----------------|-----------|
| `/` | Inicio con enlaces | — |
| `/register` | **Registro de clientes** (documento, nombres, email, celular) | registroCliente |
| `/wallet/recharge` | **Recarga de billetera** (documento, celular, valor) | recargarBilletera |
| `/wallet/balance` | **Consulta de saldo** (documento, celular) | consultarSaldo |
| `/payments/request` | **Solicitar pago** (documento, celular, valor → OTP al email, ID de sesión) | solicitarPago |
| `/payments/confirm` | **Confirmar pago** (ID de sesión, token 6 dígitos) | confirmarPago |

### Características implementadas

- **Validación:** Campos obligatorios y formato (token 6 dígitos, montos > 0, emails válidos)
- **Mensajes:** Toasts (Sonner) con éxito/error según respuesta API
- **Navegación:** Layout global con navbar y enlaces a todas las secciones
- **Autenticación:** Login con OTP en dos pasos (email/doc/phone → código por correo)
- **Sesión:** Persistida en localStorage con Zustand, guarda usuario y saldo
- **Protección de rutas:** Guards (`SessionGuard`, `RedirectIfAuthenticated`)
- **Temas:** Dark/Light mode con next-themes
- **Responsive:** Diseño adaptable con Tailwind

### Componentes destacados

- **Formularios:** Reutilizables con shadcn/ui (`Form`, `FormField`, `Input`, `Button`)
- **Balance Display:** Componente visual para mostrar saldo (`components/balance-display.tsx`)
- **Input OTP:** Componente de shadcn para códigos de 6 dígitos
- **Guards:** Componentes para proteger rutas y redirigir según sesión
