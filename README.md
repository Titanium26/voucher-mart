# VoucherMart

A full-stack web application built with **Next.js (App Router, TypeScript, TailwindCSS, Prisma, and Neon PostgreSQL)** that provides user authentication with email verification, secure login/logout, password reset, and account management.  

This project was created as part of a coding challenge, with a focus on clean architecture, security best practices, and user-friendly design.

---

## ✨ Features

- **Authentication**
  - Sign up with email verification
  - Secure password hashing (Argon2)
  - Login / Logout with session cookies
  - Forgot password (one-time token)
  - Soft delete (set account `status=INACTIVE` with password re-entry)
- **Account Management**
  - View username and email in account modal
  - Change password with validation rules (uppercase, lowercase, number, special character)
- **UI/UX**
  - Responsive, desktop-first layout with TailwindCSS
  - Notice messages for signup, login, account actions
  - Promo banners with gradient backgrounds and images
- **Security**
  - Prisma ORM with PostgreSQL
  - Sessions stored in DB with hashed tokens
  - Soft delete instead of full removal for auditability
  - Email verification & password reset tokens hashed and expired

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [TailwindCSS](https://tailwindcss.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (serverless cloud Postgres)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: Custom system with Argon2 password hashing, session cookies, email tokens

---

## 📦 Dependencies

Install everything with:

```bash
npm install next react react-dom   @prisma/client prisma   zod argon2 nodemailer resend   tailwindcss postcss autoprefixer
```

### Breakdown

#### Production Dependencies
- `next` — Next.js framework
- `react` — React core
- `react-dom` — React DOM renderer
- `@prisma/client` — Prisma ORM client
- `zod` — input validation
- `argon2` — password hashing
- `nodemailer` — email sending (SMTP)
- `resend` — optional email API provider

#### Dev Dependencies
- `prisma` — Prisma CLI & migration tools
- `tailwindcss` — utility-first CSS framework
- `postcss` — required for Tailwind
- `autoprefixer` — required for Tailwind

If you’re using **TypeScript**:
```bash
npm install --save-dev typescript @types/node @types/react @types/react-dom
```

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/voucher-mart.git
   cd voucher-mart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Neon PostgreSQL**
   - Go to [Neon](https://neon.tech/) and create a free Postgres database.
   - Copy the **connection string (pooled)** from the Neon dashboard.
   - Example:
     ```
     postgresql://USER:PASSWORD@ep-xxx--pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
     ```

4. **Create `.env` file**
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST--pooler.REGION.aws.neon.tech/DBNAME?sslmode=require"
   APP_URL="http://localhost:3000"
   RESEND_API_KEY="your-resend-key"   # optional for real email
   SHOW_VERIFY_LINK=1                 # optional: expose link in API response for demo
   ```

5. **Prisma migration**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Run the dev server**
   ```bash
   npm run dev
   ```

   App runs at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
app/
  api/
    auth/              # signup, login, logout, reset password
    verify/            # email verification
  dashboard/           # authenticated user area
  login/               # login UI
  register/            # signup UI
  verify/              # success & invalid pages
components/            # reusable UI components (e.g., Banner)
lib/                   # db, crypto, mailer, validation, utils
prisma/                # schema.prisma (User, Token, Session)
public/                # static assets (logos, banners, favicon)
```

---

## 🗄️ Database Schema (Prisma)

Here’s a simplified version of the key models:

```prisma
model User {
  id               Int        @id @default(autoincrement())
  username         String     @unique
  email            String     @unique
  passwordHash     String
  emailVerified    DateTime?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  lastLoginAt      DateTime?
  failedLoginCount Int        @default(0)
  status           UserStatus @default(INACTIVE)

  tokens           Token[]
  sessions         Session[]
}

model Session {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  tokenHash String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
}

model Token {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  kind      String
  tokenHash String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
}

enum UserStatus {
  ACTIVE
  INACTIVE
}
```

---

## 🔒 Security Considerations

- **Passwords** are hashed with Argon2; never stored in plain text.
- **Sessions** are stored server-side in the DB with a hashed token.
- **Tokens** for verification and reset are hashed and expire after 30 minutes.
- **Soft delete**: accounts are set to `INACTIVE` rather than removed, preventing accidental data loss.
- **Validation**: all inputs validated with Zod; password rules enforced server-side.
