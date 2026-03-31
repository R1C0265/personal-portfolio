# Waku Limited — Website + CRM

Full-stack Next.js 14 application. One project, one server, one `npm run dev`.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MySQL + Prisma ORM |
| Auth | JWT in httpOnly cookies + bcrypt |
| Email | Resend |
| Image uploads | Cloudinary (via API, no Multer) |
| Validation | Zod |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| UI | Tailwind CSS + Lucide icons + Framer Motion |
| Charts | Recharts |

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- MySQL 8+ running locally (or remote)

### 2. Database
```bash
mysql -u root -p -e "CREATE DATABASE waku_db;"
```

### 3. Install & configure
```bash
cp .env.example .env
# Open .env and fill in all values (see Environment Variables section below)

npm install
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run
```bash
npm run dev
# → http://localhost:3000
```

That's it. One command, one port.

---

## First Login (after seeding)

| Field | Value |
|---|---|
| URL | http://localhost:3000/auth/login |
| Email | admin@wakulimited.com |
| Password | WakuAdmin2026! |

**Change this password immediately after first login.**

---

## Environment Variables

Copy `.env.example` to `.env` and fill these in:

### Required — app won't start without these
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/waku_db"
JWT_SECRET="generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
```

### Required — for email notifications on new inquiries
```env
RESEND_API_KEY="re_xxxx"         # from resend.com — free tier: 3000 emails/month
ADMIN_EMAIL="you@example.com"    # where notifications are sent
FROM_EMAIL="onboarding@resend.dev" # use this for testing (no domain verification needed)
```

### Required — for product image uploads
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
# All three are on your Cloudinary dashboard — free tier is plenty
```

### Change for production
```env
COOKIE_SECURE="true"        # set true when you have HTTPS
NODE_ENV="production"
```

---

## Project Structure

```
waku-v2/
├── prisma/
│   ├── schema.prisma       ← DB tables: User, Product, Inquiry, Note
│   └── seed.ts             ← Creates superAdmin + sample products
│
├── src/
│   ├── app/
│   │   ├── api/            ← All backend logic lives here (replaces Express)
│   │   │   ├── auth/       login, logout, me, register
│   │   │   ├── inquiries/  CRUD, notes, stats, CSV export
│   │   │   ├── products/   CRUD with Cloudinary image upload
│   │   │   └── admin/users/ Staff account management (SuperAdmin only)
│   │   │
│   │   ├── (public)/       ← Public website (shares header + bottom nav)
│   │   │   ├── page.tsx    Home
│   │   │   ├── products/   Products listing
│   │   │   ├── order/      Inquiry/order form
│   │   │   ├── about/      About page
│   │   │   └── contact/    Contact page
│   │   │
│   │   ├── admin/          ← CRM (protected — ADMIN/SUPER_ADMIN only)
│   │   │   ├── page.tsx    Dashboard with stats + chart
│   │   │   ├── inquiries/  Lead management
│   │   │   ├── customers/  Customer directory
│   │   │   ├── products/   Product management (with image upload)
│   │   │   └── users/      Staff accounts (SUPER_ADMIN only)
│   │   │
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   │
│   ├── components/
│   │   ├── layout/         Providers, AuthHydrator
│   │   ├── public/         PublicHeader, BottomNav, page client components
│   │   ├── admin/          AdminShell, all admin client components
│   │   └── auth/           LoginClient, RegisterClient
│   │
│   ├── lib/
│   │   ├── api.ts          Axios instance (baseURL: /api)
│   │   ├── auth.ts         JWT helpers — requireAuth(), requireRole(), setAuthCookie()
│   │   ├── cloudinary.ts   uploadImage(), deleteImage()
│   │   ├── db.ts           Prisma client singleton
│   │   ├── email.ts        Resend email helper
│   │   ├── utils.ts        cn(), formatPrice(), formatDate(), STATUS_CONFIG
│   │   └── validations.ts  Zod schemas for all inputs
│   │
│   ├── hooks/useAuth.ts    Hydrates Zustand store from /api/auth/me on load
│   ├── store/authStore.ts  Global auth state (Zustand + localStorage persist)
│   ├── types/index.ts      Shared TypeScript types
│   └── middleware.ts       Edge route protection (no React, no DB)
```

---

## Roles & Permissions

| Role | Can do |
|---|---|
| `CUSTOMER` | Public site, submit inquiries, register/login |
| `ADMIN` | CRM: view/update inquiries, customers, products |
| `SUPER_ADMIN` | Everything above + delete records + manage staff accounts |

SuperAdmin accounts can only be created by another SuperAdmin (or via seed).

---

## Where to make changes

| Task | File |
|---|---|
| Add a DB table | `prisma/schema.prisma` → run `npm run db:migrate` |
| Add an API endpoint | Create `src/app/api/[resource]/route.ts` |
| Add a page | Create `src/app/[pagename]/page.tsx` |
| Change brand colours | `tailwind.config.ts` → `theme.extend.colors` |
| Change fonts | `src/app/layout.tsx` → font imports |
| Add form validation | `src/lib/validations.ts` |
| Add global state | `src/store/` |
| Change JWT expiry | `.env` → `JWT_EXPIRES_IN` |
| Add email template | `src/lib/email.ts` |

---

## Deployment

**Frontend + API — Vercel (easiest)**
```bash
npm run build
# Push to GitHub, connect to Vercel, add env vars in Vercel dashboard
```

**Database — PlanetScale, Railway, or any MySQL host**
- Update `DATABASE_URL` in your host's env vars
- Run `npx prisma migrate deploy` (not `dev`) in production

**Domain + SSL**
- Set `COOKIE_SECURE=true` once you have HTTPS
- Set `FROM_EMAIL` to your verified Resend domain email

---

## Scripts

```bash
npm run dev          # development server → localhost:3000
npm run build        # production build
npm run start        # run production build
npm run db:migrate   # apply schema changes
npm run db:seed      # seed superAdmin + products
npm run db:studio    # visual DB browser (Prisma Studio)
```
