# API REST - Digital Wallet

API REST construida con **NestJS** para el sistema de billetera digital.

## Requisitos previos

- **Base de datos MySQL** corriendo (ver [README principal](../../README.md) para instrucciones)
- **Migraciones aplicadas** (ver sección de base de datos en README principal)
- **Cliente Prisma generado** (`prisma generate`)

## Configuración

1. **Copiar el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configurar las variables en `.env`:**

   **Base de datos (obligatorio):**
   ```env
   DATABASE_URL="mysql://usuario:password@localhost:3306/digital_wallet"
   ```
   Debe ser el mismo valor que en `packages/database/.env`.

   **Email (obligatorio):**
   ```env
   EMAIL_PROVIDER=gmail  # o resend, console
   GMAIL_USER=correo@ejemplo.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

   Ver más detalles en el [README principal](../../README.md#configuración-de-email-api).

## Ejecutar en desarrollo

Desde la raíz del monorepo:

```bash
pnpm --filter api dev
```

O desde `apps/api`:

```bash
cd apps/api
pnpm dev
```

La API queda disponible en **http://localhost:3001**.

## Documentación Swagger

Una vez corriendo, accede a:

**http://localhost:3001/api/docs**

Desde allí se pueden ver todos los endpoints, probarlos y consultar los esquemas de request/response.

## Estructura del proyecto

```
apps/api/
├── src/
│   ├── clients/          # Módulo de clientes (registro, login)
│   ├── wallet/           # Módulo de billetera (recarga, saldo)
│   ├── payments/         # Módulo de pagos (request, confirm)
│   ├── email/            # Servicio de email (adapters, templates)
│   ├── prisma/           # Módulo Prisma (servicio compartido)
│   ├── common/           # Interceptores, filtros, DTOs comunes
│   └── utils/            # Utilidades compartidas (maskEmail, etc.)
├── .env                  # Variables de entorno (crear desde .env.example)
└── nest-cli.json         # Configuración NestJS (incluye templates .hbs)
```

## Endpoints principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/clients/register` | POST | Registrar cliente |
| `/api/clients/login/request` | POST | Solicitar OTP de login |
| `/api/clients/login/confirm` | POST | Confirmar login con OTP |
| `/api/wallet/recharge` | POST | Recargar billetera |
| `/api/wallet/balance` | POST | Consultar saldo |
| `/api/payments/request` | POST | Solicitar pago (genera OTP) |
| `/api/payments/confirm` | POST | Confirmar pago con OTP |
| `/api/payments/session/:id` | GET | Estado de sesión de pago |

Ver ejemplos en `api-example.http` (raíz del proyecto).

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia en modo desarrollo (watch) |
| `pnpm build` | Compila para producción |
| `pnpm start` | Inicia la versión compilada |
| `pnpm start:prod` | Inicia en modo producción |

## Tecnologías

- **NestJS:** Framework Node.js
- **Prisma:** ORM (cliente en `@repo/database`)
- **MySQL:** Base de datos
- **Swagger:** Documentación automática
- **class-validator:** Validación de DTOs
- **Handlebars:** Templates de email
- **Resend/Gmail:** Proveedores de email

## Notas importantes

- **Prisma Client:** Se genera en `packages/database` y se importa como `@repo/database`
- **Templates de email:** Los archivos `.hbs` se copian a `dist/` durante el build (ver `nest-cli.json`)
- **CORS:** Configurado para permitir `http://localhost:3000` (frontend)
