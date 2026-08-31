# Deploying Willary STEM to Vercel

The app is a Next.js 16 project with Prisma + Postgres. Vercel hosts the app;
**Postgres must be hosted separately** (Neon) — the local `prisma dev` database
only works on your machine.

You can deploy today on a free `*.vercel.app` URL and add your real domain later.

---

## 1. Push the code to GitHub

From `willary-stem/` (repo is already initialised, branch `main`):

```bash
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<you>/willary-stem.git
git push -u origin main
```

## 2. Import into Vercel

1. <https://vercel.com> → **Add New… → Project** → import the `willary-stem` repo.
2. Framework preset: **Next.js** (auto-detected). Root directory: leave `./` if
   the repo root *is* `willary-stem`; set it to `willary-stem` if you pushed the
   whole outer folder.
3. Don't worry if the first deploy fails — there's no database yet. Add it next.

## 3. Add the database (Neon via the Vercel integration)

In the Vercel **project** → **Storage** tab → **Create Database** →
**Neon** (Marketplace) → pick a region near Kenya → **Create**.

This provisions the Neon project and **auto-adds env vars** to the Vercel
project — including `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED`
(non-pooled). The Prisma schema reads both of those names directly, so **no
database env var needs setting by hand.**

Then add the remaining variables — Vercel project →
**Settings → Environment Variables** (Production **and** Preview):

| Key | Value |
|---|---|
| `AUTH_SECRET` | run `openssl rand -base64 32` and paste the result |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` (update after adding a domain) |
| `SEED_ADMIN_EMAIL` | your admin login email |
| `SEED_ADMIN_PASSWORD` | strong password, 10+ chars |
| `SEED_ADMIN_NAME` | `William Otwola` |
| `SEED_SECRET` | any long random string (used once, step 5) |

Optional now, add when needed:
- `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `EMAIL_FROM` — lead-notification emails
- `BLOB_READ_WRITE_TOKEN` — **required for admin media uploads**. Storage tab →
  **Create Database → Blob** and it's added automatically. Until then, uploads
  fail but pasting image URLs still works.
- `MPESA_*` — BuildFest M-Pesa payments (see `.env.example`). Set
  `MPESA_CALLBACK_URL` to
  `https://<your-domain>/api/mpesa/callback?token=<MPESA_CALLBACK_SECRET>`.

## 4. Redeploy

Vercel project → **Deployments** → **Redeploy** the latest (or just `git push`).
The build runs `vercel-build` → `prisma generate && prisma migrate deploy &&
next build`, so every table is created automatically. You now have
`https://<project>.vercel.app`.

> If a deploy ever fails with a "prepared statement" error, append
> `?pgbouncer=true` to `DATABASE_URL` in Vercel and redeploy.

## 5. Seed the production database (once)

The DB is empty after deploy. Load the starter content + create your admin user:

```
https://<project>.vercel.app/api/seed?secret=<SEED_SECRET>
```

Open that URL once in a browser. It's idempotent (safe to hit again — it skips
tables that already have rows). Then sign in at
`https://<project>.vercel.app/admin/login` with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` and change the password / add real staff under
**Admin → Staff & roles**.

_Alternative:_ pull the prod env locally and seed from your machine —
`npx vercel env pull .env.production` then
`DATABASE_URL="$(grep DATABASE_URL_UNPOOLED .env.production | cut -d= -f2- | tr -d '\"')" npm run db:seed`

## 6. Later — add your real domain

1. Buy the domain, then Vercel → Project → **Settings → Domains** → add it and
   follow the DNS instructions.
2. Update `NEXT_PUBLIC_SITE_URL` to `https://www.yourdomain.com` and redeploy
   (this fixes sitemap / robots / Open Graph URLs).
3. If M-Pesa is live, update `MPESA_CALLBACK_URL` to the new domain.
4. Submit `https://www.yourdomain.com/sitemap.xml` in Google Search Console.

## Redeploys

Every `git push` to `main` triggers a new deploy. New Prisma migrations you
create locally (`npm run db:migrate`) are applied automatically by
`prisma migrate deploy` during the Vercel build.

## Notes / limits

- **Media uploads**: need `BLOB_READ_WRITE_TOKEN`. Large videos (> ~4.5 MB) can't
  be uploaded through the serverless function — use YouTube/Vimeo links for those.
- **Neon free tier** sleeps on idle → the first request after a quiet spell is
  ~1 s slower. Fine for this traffic.
- `.env` is git-ignored and never leaves your machine — all production secrets
  live only in Vercel's env-var settings.
