# Next.js Starter with Passkeys (MSSQL)

A modern, production-ready Next.js starter template featuring passwordless authentication with WebAuthn passkeys, Auth.js v5, Prisma ORM, and shadcn/ui.

**📦 Database: Microsoft SQL Server** - Enterprise-grade database with Azure integration.

## ✨ Features

- 🔐 **Passkey Authentication** - Secure, passwordless authentication using WebAuthn
- ⚡ **Next.js 16** - Latest Next.js with App Router and Server Actions
- 🎨 **shadcn/ui** - Beautiful, accessible UI components
- 🗄️ **Prisma ORM** - Type-safe database access
- 🔒 **Auth.js v5** - Modern authentication with NextAuth beta
- 📱 **Device Biometrics** - Face ID, Touch ID, Windows Hello support
- 🚀 **TypeScript** - Full type safety
- 🎯 **Multi-Database Support** - PostgreSQL, MSSQL, SQLite, Cloudflare D1 (different branches)

## 🚀 Quick Start

### Using create-next-app (Recommended)

```bash
# PostgreSQL (main branch - default)
npx create-next-app@latest my-app --example https://github.com/squirrelsoft-dev/next-starter

# MSSQL
npx create-next-app@latest my-app --example https://github.com/squirrelsoft-dev/next-starter/tree/mssql

# SQLite
npx create-next-app@latest my-app --example https://github.com/squirrelsoft-dev/next-starter/tree/sqlite

# Cloudflare D1
npx create-next-app@latest my-app --example https://github.com/squirrelsoft-dev/next-starter/tree/cloudflare-d1
```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/squirrelsoft-dev/next-starter.git
   cd next-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL` - Your SQL Server connection string
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `RP_ID`, `RP_NAME`, `RP_ORIGIN` - WebAuthn configuration

4. **Set up the database**
   ```bash
   # Quick setup (no migration files)
   npm run db:push

   # Or create a migration (recommended for teams)
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Microsoft SQL Server (This Branch)

SQL Server is perfect for enterprise applications and integrates seamlessly with Azure.

**Local Development with Docker:**
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name mssql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Setup:**
```bash
# Initialize the database
npm run db:push

# Or create migrations
npm run db:migrate
```

**Azure SQL Database:**
1. Create a SQL Database in Azure Portal
2. Get the connection string from Azure
3. Update your `.env` with the Azure connection string
4. Run `npm run db:push`

**Benefits:**
- ✅ Enterprise-grade reliability and security
- ✅ Excellent Azure integration
- ✅ Advanced features (stored procedures, triggers, etc.)
- ✅ Strong T-SQL support
- ✅ Built-in high availability options

**Connection String Format:**
```
sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD;encrypt=true
```

### Other Databases

Check out the respective branches for database-specific configurations:
- `main` - PostgreSQL (production-ready)
- `sqlite` - SQLite (file-based)
- `cloudflare-d1` - Cloudflare D1 (edge database)

## 🔐 Passkey Authentication

### How It Works

1. **Registration**: User provides an email and clicks "Register Passkey"
   - Browser prompts for biometric authentication (Face ID, Touch ID, etc.)
   - A cryptographic key pair is generated on the device
   - Public key is stored in your database
   - Private key stays on the user's device (never transmitted)

2. **Sign In**: User clicks "Sign In with Passkey"
   - Browser prompts for biometric authentication
   - Device signs a challenge with the private key
   - Server verifies the signature with the stored public key
   - User is authenticated!

### Browser Support

Passkeys work on:
- ✅ Chrome/Edge 108+
- ✅ Safari 16+
- ✅ Firefox 119+

Devices:
- ✅ iPhone/iPad (iOS 16+)
- ✅ Mac (macOS Ventura+)
- ✅ Android (9+)
- ✅ Windows (10+)
- ✅ Hardware security keys (YubiKey, etc.)

### Production Deployment

When deploying to production, update your `.env`:

```bash
# Your production domain
RP_ID="yourdomain.com"
RP_NAME="Your App Name"
RP_ORIGIN="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"
```

**Important**: Passkeys are tied to your domain. Testing with `localhost` creates different credentials than production.

## 📁 Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/  # Auth.js API routes
│   ├── auth/                     # Authentication pages
│   │   ├── signin/              # Sign in/register page
│   │   └── error/               # Error page
│   ├── dashboard/               # Protected dashboard
│   ├── generated/prisma/        # Generated Prisma Client
│   ├── globals.css              # Global styles
│   └── page.tsx                 # Home page
├── components/
│   ├── auth/                    # Auth components
│   │   └── signin-form.tsx      # Passkey sign-in form
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   └── utils.ts                 # Utility functions
├── prisma/
│   └── schema.prisma            # Database schema
├── auth.ts                      # Auth.js configuration
└── middleware.ts                # Auth middleware
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org)
- **Authentication**: [Auth.js v5 (NextAuth)](https://authjs.dev)
- **Database ORM**: [Prisma](https://prisma.io)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: [TypeScript](https://typescriptlang.org)

## 📝 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
# Development workflow
npm run db:push              # Quick schema sync (no migration files)
npm run db:migrate           # Create and apply migration
npm run db:migrate:create    # Create migration without applying
npm run db:studio            # Open Prisma Studio (GUI)

# Production deployment
npm run db:migrate:deploy    # Apply migrations (CI/CD)

# Prisma Client
npm run db:generate          # Regenerate Prisma Client

# Utilities
npm run db:pull              # Pull schema from existing database
npm run db:seed              # Run seed script
npm run db:reset             # Reset database and rerun migrations
npm run db:format            # Format schema.prisma file
```

**When to use what:**
- **Development**: Use `npm run db:push` for rapid iteration
- **Team collaboration**: Use `npm run db:migrate` to create migration files that can be committed
- **Production**: Use `npm run db:migrate:deploy` in your CI/CD pipeline

## 🔧 Configuration

### Adding OAuth Providers

Want to add Google, GitHub, etc.? Edit `auth.ts`:

```typescript
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Passkey({ /* ... */ }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // ...
};
```

### Customizing the UI

shadcn/ui components are in `components/ui/`. Customize them directly:

```bash
# Add more components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Apply changes:
   ```bash
   # Quick sync (development)
   npm run db:push

   # Or create migration (team collaboration)
   npm run db:migrate
   ```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

Vercel automatically detects Next.js and configures everything.

### Other Platforms

This template works on any platform that supports Node.js:
- Netlify
- Railway
- Fly.io
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this template for any project!

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Prisma Documentation](https://prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [WebAuthn Guide](https://webauthn.guide)

---

**Built with ❤️ using Next.js, Auth.js, and Passkeys**
