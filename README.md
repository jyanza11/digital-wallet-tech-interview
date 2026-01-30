# Digital Wallet - ePayco (Prueba técnica)

Sistema que simula una **billetera digital**: registro de clientes, recarga de saldo, pagos con confirmación mediante token (OTP) y consulta de saldo.

- **Frontend:** React (Next.js) en `apps/web`
- **API REST:** NestJS en `apps/api`
- **Base de datos:** MySQL con Prisma ORM en `packages/database`

---

## Requerimientos

- Node.js >= 18
- pnpm 9
- MySQL (local o remoto)

---

## Instalación

Desde la raíz del monorepo:

```bash
pnpm install
```

---

## Configuración de base de datos

### 1. Instalar y levantar MySQL

**Docker Compose**

En la raíz del proyecto hay un `docker-compose.yml` que levanta MySQL 8 con una base de datos limpia. Ejecutar:

```bash
# Desde la raíz del monorepo
docker compose up -d
```

Esto crea el contenedor `digital-wallet-mysql`, la base de datos `digital_wallet` y espera a que MySQL esté listo. Para una base **limpia** (sin datos previos), la primera vez ya lo está; para resetear:

```bash
docker compose down -v   # elimina contenedor y volumen (datos)
docker compose up -d    # levanta de nuevo, base vacía
```

**URL de conexión con Docker Compose:** usuario `root`, contraseña `root`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/digital_wallet"
```


### 2. Configurar la URL de conexión

Crear el archivo `.env` en `packages/database`:

```bash
cd packages/database
cp .env.example .env  # Si existe el ejemplo, o crearlo manualmente
```

Editar `packages/database/.env` con la configuración deseada:

```env
DATABASE_URL="mysql://wallet_user:wallet_password@localhost:3306/digital_wallet"
```

**Formato:** `mysql://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_DB`

Si se usó **Docker Compose**, utilizar en ambos `.env`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/digital_wallet"
```

### 3. Generar el cliente Prisma

Genera los tipos TypeScript del cliente Prisma:

```bash
# Desde la raíz del monorepo
pnpm --filter @repo/database exec prisma generate

# O desde packages/database
cd packages/database
pnpm db:generate
```

Esto crea el cliente en `packages/database/node_modules/.prisma/client` y los tipos TypeScript.

### 4. Aplicar migraciones (crear tablas)

**Opción A: Migraciones con historial (recomendado para producción)**

```bash
# Desde la raíz
pnpm --filter @repo/database exec prisma migrate dev

# O desde packages/database
cd packages/database
pnpm db:migrate
```

Esto:
- Crea la carpeta `packages/database/prisma/migrations/` con el historial
- Aplica las migraciones a la base de datos
- Genera el cliente Prisma automáticamente

**Opción B: Push directo (solo desarrollo, sin historial)**

```bash
# Desde la raíz
pnpm --filter @repo/database exec prisma db push

# O desde packages/database
cd packages/database
pnpm db:push
```

Esto sincroniza el schema directamente sin crear archivos de migración. Útil para prototipado rápido.

**Opción C: Aplicar migraciones existentes (producción)**

Si ya existen migraciones creadas y solo se desea aplicarlas:

```bash
pnpm --filter @repo/database exec prisma migrate deploy
```

### 5. Verificar la base de datos

Abrir Prisma Studio para ver los datos:

```bash
pnpm --filter @repo/database exec prisma studio
```

Se abre en **http://localhost:5555**.

### Resumen de comandos Prisma

| Comando | Descripción | Cuándo usar |
|---------|-------------|-------------|
| `prisma generate` | Genera el cliente TypeScript | Después de cambiar el schema o instalar |
| `prisma migrate dev` | Crea migración y la aplica | Desarrollo con historial |
| `prisma migrate deploy` | Aplica migraciones existentes | Producción |
| `prisma db push` | Sincroniza schema sin migraciones | Prototipado rápido |
| `prisma studio` | Muestra la interfaz visual de la DB | Explorar datos |

### Flujo de trabajo con Prisma

**Cuando cambias el schema (`packages/database/prisma/schema.prisma`):**

1. **Crear migración (desarrollo):**
   ```bash
   pnpm --filter @repo/database exec prisma migrate dev --name descripcion_cambio
   ```
   Esto:
   - Crea un archivo de migración en `packages/database/prisma/migrations/`
   - Aplica la migración a la base de datos
   - Genera el cliente Prisma automáticamente

2. **O push directo (solo desarrollo rápido):**
   ```bash
   pnpm --filter @repo/database exec prisma db push
   ```
   Sincroniza el schema sin crear archivos de migración.

3. **Aplicar migraciones existentes (producción):**
   ```bash
   pnpm --filter @repo/database exec prisma migrate deploy
   ```

**Después de cambios en el schema:**
- El cliente Prisma se regenera automáticamente con `migrate dev`
- Si se usa `db push`, ejecutar manualmente: `pnpm --filter @repo/database exec prisma generate`
- Reinicia la API para que use el nuevo cliente

### Notas importantes

- **Después de cambiar `schema.prisma`:** ejecutar siempre `prisma generate` y luego `migrate dev` o `db push`.
- **En el monorepo:** el cliente Prisma se genera en `packages/database` y se importa en `apps/api` como `@repo/database`.
- **Variables de entorno:** `apps/api` también necesita `DATABASE_URL` en su `.env` (mismo valor que en `packages/database/.env`).
- **Migraciones:** Los archivos en `prisma/migrations/` son versionados en Git. No edites migraciones ya aplicadas.

---

## Cómo ejecutar la API REST

**Requisito previo:** La base de datos debe estar corriendo y las migraciones aplicadas.

Desde la raíz:

```bash
pnpm --filter api dev
```

O desde `apps/api`:

```bash
cd apps/api && pnpm dev
```

La API queda en **http://localhost:3001**.  
Documentación Swagger: **http://localhost:3001/api/docs**.

**Configuración:** Copiar `apps/api/.env.example` a `apps/api/.env` y ajustar las variables (ver sección de email más abajo).

---

## Cómo levantar el frontend

Desde la raíz:

```bash
pnpm --filter web dev
```

O desde `apps/web`:

```bash
cd apps/web && pnpm dev
```

La app se sirve en **http://localhost:3000**.

Configuración opcional: en `apps/web` copiar `.env.example` a `.env.local` y ajustar `NEXT_PUBLIC_API_URL` si la API no está en `http://localhost:3001/api`.

---

## Configuración de email (API)

El envío de correos (OTP de pago, bienvenida, etc.) usa un **adaptador** elegido por variable de entorno:

| Variable | Valores | Descripción |
|----------|--------|-------------|
| `EMAIL_PROVIDER` | `resend` \| `gmail` \| `console` | Proveedor a usar. `console` solo registra en logs y no envía. |

- **`resend`:** Requiere `RESEND_API_KEY` y opcionalmente `MAIL_FROM`. En modo prueba Resend solo permite enviar al correo registrado en la cuenta.
- **`gmail`:** Requiere `GMAIL_USER` (correo del remitente) y `GMAIL_APP_PASSWORD` (o `GMAIL_SECRET`) — contraseña de aplicación de Google, no la contraseña normal. Permite enviar a cualquier destinatario.
- **`console`:** No envía correos; escribe el contenido en la consola (útil para desarrollo).

En `apps/api` copiar `.env.example` a `.env` y configurar las variables del proveedor que se utilice. Ejemplo para Gmail:

```env
EMAIL_PROVIDER=gmail
GMAIL_USER=correo@ejemplo.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

## Endpoints disponibles (enunciado)

Todas las respuestas siguen una estructura uniforme: `{ success, message, data?, error? }`.

| Funcionalidad        | Endpoint (base: `/api`)     | Método | Parámetros / cuerpo |
|----------------------|-----------------------------|--------|----------------------|
| Registro de clientes | `/clients/register`         | POST   | document, name, email, phone |
| Recarga de billetera | `/wallet/recharge`          | POST   | document, phone, amount |
| Consulta de saldo   | `/wallet/balance`           | POST   | document, phone |
| Solicitar pago       | `/payments/request`        | POST   | document, phone, amount |
| Confirmar pago       | `/payments/confirm`        | POST   | sessionId, token (6 dígitos) |

### Archivo de ejemplos

En la raíz del proyecto hay un archivo `api-example.http` con ejemplos listos para usar en REST Client (VS Code) o similar. Incluye variables configurables para facilitar las pruebas.

### Ejemplos de uso

**1. Registro de cliente**

```http
POST /api/clients/register
Content-Type: application/json

{
  "document": "1234567890",
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "3001234567"
}
```

**2. Recargar billetera**

```http
POST /api/wallet/recharge
Content-Type: application/json

{
  "document": "1234567890",
  "phone": "3001234567",
  "amount": 50000
}
```

**3. Consultar saldo**

```http
POST /api/wallet/balance
Content-Type: application/json

{
  "document": "1234567890",
  "phone": "3001234567"
}
```

**4. Solicitar pago (genera OTP y envía al email)**

```http
POST /api/payments/request
Content-Type: application/json

{
  "document": "1234567890",
  "phone": "3001234567",
  "amount": 25000
}
```

Respuesta incluye `sessionId` y mensaje de que el token fue enviado. El token de 6 dígitos llega al email del cliente.

**5. Confirmar pago**

```http
POST /api/payments/confirm
Content-Type: application/json

{
  "sessionId": "<UUID devuelto en solicitar pago>",
  "token": "123456"
}
```

---

## Flujo en el frontend

1. **Iniciar sesión** (`/login`): en dos pasos. (1) Correo, documento y celular → se valida que coincidan con un cliente y se envía un código OTP al correo. (2) Se ingresa el código de 6 dígitos → se valida y se guarda la sesión en localStorage.
2. **Registro** (`/register`): documento, nombres, email, celular. Tras éxito se guarda la sesión en localStorage.
3. **Recarga** (`/wallet/recharge`): documento, celular, valor. Requiere sesión; actualiza saldo en sesión.
4. **Consulta de saldo** (`/wallet/balance`): documento y celular. Requiere sesión; muestra saldo y actualiza sesión.
5. **Solicitar pago** (`/payments/request`): documento, celular, valor. Genera sesión de pago y envía OTP al email. En la UI se muestra un enlace a confirmar con el `sessionId` en la URL.
6. **Confirmar pago** (`/payments/confirm`): ID de sesión y token de 6 dígitos. Puede abrirse con `?sessionId=...` desde el paso anterior.

Las rutas `/wallet/*` y `/payments/*` están protegidas: si no hay sesión, se redirige a `/login`.

---

## Scripts del monorepo

| Comando              | Descripción                    |
|----------------------|--------------------------------|
| `pnpm dev`           | Inicia API y web en desarrollo |
| `pnpm build`         | Build de todos los proyectos   |
| `pnpm lint`          | Lint en todo el repo           |
| `pnpm check-types`   | Verificación de tipos          |

---

## Estructura del proyecto

- `apps/api`: API NestJS, Prisma, Swagger, validación (class-validator) y envío de email (OTP).
- `apps/web`: Next.js (React), Tailwind v4, shadcn/ui, Zustand (sesión persistida), React Hook Form + Zod.
- `packages/database`: Schema Prisma y cliente compartido (MySQL).

Documentación adicional: `apps/api/README.md`, `apps/web/README.md`, `docs/IMPLEMENTACION.md`.

---

## Verificación rápida

Para verificar que todo está configurado correctamente:

1. **Base de datos:**
   ```bash
   # Verificar conexión
   pnpm --filter @repo/database exec prisma db pull
   # O abrir Prisma Studio
   pnpm --filter @repo/database exec prisma studio
   ```

2. **API:**
   - Debe iniciar sin errores en http://localhost:3001
   - Swagger disponible en http://localhost:3001/api/docs
   - Verificar que `DATABASE_URL` esté en `apps/api/.env`

3. **Frontend:**
   - Debe iniciar sin errores en http://localhost:3000
   - Verificar que `NEXT_PUBLIC_API_URL` apunte a `http://localhost:3001/api`

4. **Prisma Client:**
   ```bash
   # Si hay errores de tipos, regenera el cliente
   pnpm --filter @repo/database exec prisma generate
   ```

---

## Solución de problemas comunes

**Error: "Can't reach database server"**
- Verificar que MySQL esté corriendo: `docker ps` (si se usa Docker) o `mysql -u usuario -p`
- Revisar `DATABASE_URL` en `packages/database/.env` y `apps/api/.env`

**Error: "Prisma Client not found"**
- Ejecutar: `pnpm --filter @repo/database exec prisma generate`

**Error: "Table doesn't exist"**
- Aplica migraciones: `pnpm --filter @repo/database exec prisma migrate dev`

**Error: "Email not sent"**
- Verificar `EMAIL_PROVIDER` y las credenciales en `apps/api/.env`
- Si se usa Gmail, debe utilizarse una contraseña de aplicación, no la contraseña normal
