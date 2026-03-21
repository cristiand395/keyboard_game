# Keyboard Game

MVP de mecanografia con `Next.js 16`, `Tailwind CSS v4`, `shadcn/ui`, `Drizzle`, `Auth.js`, `PostgreSQL` en Docker y `Neon` para entornos remotos.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- shadcn/ui
- Drizzle ORM
- Auth.js
- PostgreSQL 16
- Docker Compose

## Desarrollo

1. Copia `.env.example` a `.env`.
2. Levanta el entorno:

```bash
docker compose up --build
```

3. Ejecuta migraciones y seed dentro del contenedor web:

```bash
docker compose exec web npm run db:migrate
docker compose exec web npm run db:seed
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`

## Despliegue

- Hosting: Vercel
- Base de datos: Neon
- Variables mínimas: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`
