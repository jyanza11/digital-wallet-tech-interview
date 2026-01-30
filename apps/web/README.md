# Billetera Digital – Frontend (Next.js)

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4** + **shadcn/ui**
- **Fuente:** Poppins (Google Fonts)
- **Toasts:** Sonner
- **Formularios:** React Hook Form + Zod + @hookform/resolvers

## Instalación

Desde la raíz del monorepo:

```bash
pnpm install
```

## Configuración Tailwind v4 + shadcn

1. **Tailwind v4** ya está configurado en `package.json` (`tailwindcss@^4`, `@tailwindcss/postcss`) y en `postcss.config.mjs`. Los estilos del tema shadcn están en `app/globals.css` con `@import "tailwindcss"` y `@theme inline`.

2. **Añadir componentes shadcn** (opcional; ya hay botón e input custom en `components/ui`):

   ```bash
   cd apps/web
   pnpm dlx shadcn@latest add button input card label sonner
   ```

   Si el CLI pregunta por Tailwind v4, confirmar que se usa v4. Si pregunta por el directorio de componentes, usar `@/components`.

## Fuente Poppins

La fuente **Poppins** se carga en `app/layout.tsx` con `next/font/google` y se aplica al body mediante la variable `--font-poppins` y la utilidad `font-sans` de Tailwind (definida en `@theme inline` en `globals.css`).

## Variables de entorno

Copiar `apps/web/.env.example` a `apps/web/.env.local` y ajustar:

- `NEXT_PUBLIC_API_URL`: URL base de la API (por defecto `http://localhost:3001/api`).

## Desarrollo

```bash
pnpm dev
# o solo la web:
pnpm --filter web dev
```

La app se sirve en **http://localhost:3000**.
