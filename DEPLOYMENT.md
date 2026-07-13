# Deployment Guide

This guide explains the full production deployment flow for this Salon Mate project using Vercel and a hosted PostgreSQL database such as Neon.

## What Production Needs

The app has two parts:

- Next.js app on Vercel
- PostgreSQL database for services, staff, bookings, sessions, and availability blocks

The public booking flow depends on these API routes:

- `/api/services`
- `/api/availability`
- `/api/bookings`

If `DATABASE_URL` is missing or points to the wrong database, the public booking UI falls back to preview mode and shows `Booking Offline`.

## 1. Create Production Database

Use a hosted PostgreSQL provider. Neon is a good simple option.

1. Go to `https://console.neon.tech`.
2. Create a new Neon project.
3. Choose a nearby region.
4. Copy the connection string from Neon.

The connection string should look like this:

```text
postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

Do not use a local database URL such as:

```text
postgresql://postgres:postgres@localhost:5432/salon_mate?schema=public
```

Vercel cannot connect to your local machine.

## 2. Add Database URL To Vercel

In Vercel:

1. Open the `salon-mate` project.
2. Go to `Settings > Environment Variables`.
3. Add or edit this variable:

```text
Key: DATABASE_URL
Value: your Neon PostgreSQL connection string
Environment: Production
```

If you test preview deployment URLs, add the same variable for `Preview` too.

The key must be exactly:

```text
DATABASE_URL
```

Do not rename it to `production`, `STORAGE_URL`, or another name. This codebase reads `process.env.DATABASE_URL`.

## 3. Push Database Schema

Run these commands from the project root:

```bash
cd /home/nilupulg/Documents/PROJECTS/salon-mate
```

Push the Prisma schema to the production database:

```bash
DATABASE_URL="your Neon PostgreSQL connection string" npx prisma db push
```

Seed default services, business hours, and staff/admin accounts:

```bash
DATABASE_URL="your Neon PostgreSQL connection string" npx prisma db seed
```

Expected successful output includes:

```text
Your database is now in sync with your Prisma schema.
The seed command has been executed.
```

This project currently uses `prisma db push` because there is no `prisma/migrations` folder. If migrations are added later, use `npx prisma migrate deploy` for production instead.

## 4. Redeploy Vercel

After adding or changing environment variables, redeploy the app.

In Vercel:

1. Go to `Deployments`.
2. Select the latest deployment.
3. Click `Redeploy`.

Alternatively, push a new commit to the production branch.

## 5. Verify Production APIs

Open these URLs after redeploy:

```text
https://your-production-domain.vercel.app/api/services
https://your-production-domain.vercel.app/api/availability
```

Expected result:

- `/api/services` returns a `services` JSON array.
- `/api/availability` returns `staff` and `days` JSON arrays.

Bad results:

- `Online booking is not connected yet`: `DATABASE_URL` is missing in Vercel or the deployment was not redeployed after adding it.
- Database/table error: run `npx prisma db push` against the production database.
- Empty or old staff/services: run `npx prisma db seed` against the production database.
- Vercel SSO redirect: deployment protection is enabled on that URL.

## 6. Verify Public Booking

On the public website:

1. Select a service.
2. Go to `Date & Time`.
3. Confirm staff avatars appear.
4. Select date and time.
5. Fill customer details.
6. Confirm booking.

The final button should say:

```text
Confirm Booking
```

If it says:

```text
Booking Offline
```

the app is still using fallback data because `/api/services` or `/api/availability` failed.

## 7. Verify Admin Booking Blocks

1. Log in at `/admin/login`.
2. Go to `Settings`.
3. Select a staff avatar or `Whole salon`.
4. Pick a date.
5. Choose a full day block or a start/end time.
6. Click `Block Time`.

After success, the block should appear in the `Availability Blocks` table.

Then check the public booking flow. The blocked date/time should no longer be available for the selected staff member or salon.

## Seeded Admin Accounts

The seed script creates these accounts unless seed environment variables override them:

```text
Super Admin: salonmate@gmail.com / sadmin12345
Owner: srinathdimuthu@gmail.com / admin12345
Vinu: vinu@salonmate.local / staff12345
Sanju: sanju@salonmate.local / staff12345
Salindeee: salindee@salonmate.local / staff12345
```

For production, change these passwords after the first login or set safer values before running the seed:

```bash
SEED_SUPER_ADMIN_EMAIL="..."
SEED_SUPER_ADMIN_PASSWORD="..."
SEED_OWNER_EMAIL="..."
SEED_OWNER_PASSWORD="..."
DATABASE_URL="your Neon PostgreSQL connection string" npx prisma db seed
```

## Deployment Protection

Vercel preview deployments can be protected by SSO. If a public API URL redirects to Vercel login, public users cannot use booking on that URL.

Use the production domain for customer testing, or disable deployment protection for the deployment you want to test publicly.

## Common Problems

### Prisma schema not found

Problem:

```text
Could not find Prisma Schema
```

Cause: command was run outside the project folder.

Fix:

```bash
cd /home/nilupulg/Documents/PROJECTS/salon-mate
DATABASE_URL="your Neon PostgreSQL connection string" npx prisma db push
```

### Localhost database URL in Vercel

Problem:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/salon_mate
```

Cause: Vercel cannot connect to your local machine.

Fix: replace it with the Neon hosted PostgreSQL URL.

### Duplicate DATABASE_URL warning in Vercel

If Neon/Vercel integration says `DATABASE_URL` already exists, keep the existing `DATABASE_URL` and make sure its value is the real Neon connection string.

The app only needs one correct `DATABASE_URL`.

### Booking still offline after setup

Checklist:

1. `DATABASE_URL` exists in Vercel for the environment you are testing.
2. Vercel deployment was redeployed after env changes.
3. `npx prisma db push` succeeded against the production DB.
4. `npx prisma db seed` succeeded against the production DB.
5. `/api/services` returns JSON.
6. `/api/availability` returns JSON.
7. The URL is not protected by Vercel SSO.

## Security Notes

Do not commit real database URLs or passwords.

If a database password was shared in chat, screenshots, or logs, rotate the password in Neon and update `DATABASE_URL` in Vercel.

After rotating the password:

1. Update Vercel `DATABASE_URL`.
2. Redeploy Vercel.
3. Test `/api/services` and `/api/availability`.
