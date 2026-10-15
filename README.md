# Photoshop Community

A dark-first social image-sharing platform starter built with Next.js 15 App Router, TypeScript strict, Tailwind CSS, Prisma/PostgreSQL, Auth.js, Cloudflare R2 presigned uploads, Sharp-ready image processing, TanStack Query, Vitest, and Playwright.

## Included

- Responsive landing page, category exploration, trending view, search shell, post details, profile, albums view, editor, upload form, settings shell, admin metrics, login and registration.
- Prisma models for users, OAuth accounts, sessions, posts, images, tags, likes, comments/replies, follows, albums, reports, and notifications.
- Credentials authentication with Argon2id, optional Google OAuth, registration endpoint, cursor-paginated feed, likes endpoint, comments endpoint, and R2 presign endpoint.
- SEO metadata, post Open Graph metadata, sitemap, robots, error and not-found pages, reduced-motion support, and basic secure headers.
- Unit and Playwright E2E tests.

## Requirements

- Node.js 20.11+
- PostgreSQL 14+ (Neon or Supabase recommended)
- Cloudflare R2 account for real uploads (optional for browsing the seeded feed)
- npm

## Local setup

```bash
cp .env.example .env
npm install
```

Edit `.env` and set `DATABASE_URL`, `AUTH_SECRET`, and `APP_URL`. Generate a secret with:

```bash
openssl rand -base64 32
```

Run migrations and seed demo content:

```bash
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000.

Seed account: `demo@photoshop.local` / `ChangeMe-123!`. Change or remove this account before deploying any public instance.

## Neon / Supabase

1. Create a PostgreSQL project in Neon or Supabase.
2. Copy the connection string into `DATABASE_URL`; use the provider's pooled URL for runtime where appropriate and a direct URL for migrations if required by the provider.
3. Ensure SSL is enabled.
4. Run `npx prisma migrate dev --name init` locally. For deployment, run `npm run db:deploy`.

## Cloudflare R2

1. Create an R2 bucket and API token with only the required bucket permissions.
2. Add account ID, access key, secret, bucket name, and public media base URL to `.env`.
3. Configure the bucket's CORS to allow `PUT` from your app origin and headers `Content-Type`; restrict origins to your real domains.
4. Configure a custom media domain for production. Avoid relying on a public development hostname for a production deployment.
5. The upload endpoint issues short-lived presigned URLs for supported MIME declarations and files up to 15 MB.

Important: browser-declared MIME type and size are not proof of actual file content. Before production, add a finalize-upload endpoint that downloads or streams each object through magic-byte MIME sniffing, Sharp decode/re-encode, dimension limits, metadata stripping, and a quarantine state. Only publish verified derivatives. The current upload UI uploads the first selected image to the post record; multi-file upload selection is supported in the UI but gallery attachment needs the finalize workflow to be extended.

## Google OAuth

1. Create OAuth credentials in Google Cloud Console.
2. Set authorized origin to your local app URL and redirect URI to `http://localhost:3000/api/auth/callback/google`.
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
4. Configure the production domain and callback URL in Google Cloud Console before launch.

## Deploy to Vercel

1. Push the project to a private or public Git repository.
2. Import it into Vercel and configure all environment variables.
3. Set `APP_URL`, `NEXTAUTH_URL`, `DATABASE_URL`, and `AUTH_SECRET` to production values.
4. Provision R2 and OAuth secrets if those features are enabled.
5. Run `npm run db:deploy` as a controlled release step, then deploy the application.
6. Add your custom domain in Vercel, update DNS as instructed, and verify HTTPS.
7. Check `/api/health`, authentication, upload CORS, and database connectivity after deployment.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm run db:studio
```

## Production readiness checklist

This repository is a runnable foundation, not a claim of fully audited production readiness. Before accepting public traffic, complete and verify: email verification and password reset tokens, rate limiting backed by a shared store, CSRF/origin protections for all state-changing endpoints, a CSP tailored to deployment, real MIME sniffing and Sharp sanitization, upload orphan cleanup, robust multi-file processing, complete album CRUD and follow/notification flows, report queue actions with audit logs, account deletion/export, email delivery, abuse prevention, privacy/legal review, backups, observability, dependency scanning, and load tests.

The starter Terms and Privacy pages are intentionally labeled as requiring legal review. Do not treat them as legal advice.
