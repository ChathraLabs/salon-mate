
# Salon Website UI Design (Copy)

This is a Next.js version of the Salon Website UI Design (Copy). The original project is available at https://www.figma.com/design/mYz8eGihBX2EgL0Tfx8Yfn/Salon-Website-UI-Design--Copy-.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the Next.js development server.

Run `npm run build` to create a production build.

## Backend setup

Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL database.

Run `npm run db:generate` to generate the Prisma client.

Run `npm run db:migrate` to create database tables during local development.

Run `npm run db:seed` to seed default services, business hours, and the first owner account.

Admin pages are available at `/admin/login` and `/admin/bookings`.
