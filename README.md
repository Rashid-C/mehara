## Local Development

Install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Copy `.env.example` to `.env` before starting locally.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Minimum local variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@mehara.local"
ADMIN_PASSWORD="replace-this-with-a-strong-admin-password"
SESSION_SECRET="replace-this-with-a-long-random-secret-32-plus-chars"
AUTH_SECRET="replace-this-with-a-long-random-secret-32-plus-chars"
LOCAL_UPLOADS_ENABLED="true"
NEXT_PUBLIC_LOCAL_UPLOADS_ENABLED="true"
NEXT_PUBLIC_UPLOADTHING_ENABLED="false"
```

Optional variables:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
UPLOADTHING_TOKEN=""
```

## Deploying To Vercel

GitHub to Vercel setup:

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Keep the framework preset as `Next.js`.
4. Set the build command to `npm run build` if Vercel does not auto-detect it.
5. Add the environment variables below in Vercel Project Settings.

Recommended Vercel environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
NEXTAUTH_URL="https://your-domain.vercel.app"
ADMIN_EMAIL="your-admin-email"
ADMIN_PASSWORD="your-strong-admin-password"
SESSION_SECRET="long-random-secret"
AUTH_SECRET="long-random-secret"
LOCAL_UPLOADS_ENABLED="false"
NEXT_PUBLIC_LOCAL_UPLOADS_ENABLED="false"
NEXT_PUBLIC_UPLOADTHING_ENABLED="true"
UPLOADTHING_TOKEN="your-uploadthing-token"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Important hosting notes:

- Prisma is configured for Postgres in `prisma/schema.prisma`; Neon is the intended production database.
- Product, order, customer, and store settings data now use Prisma with Postgres.
- `SESSION_SECRET` and `AUTH_SECRET` must be unique random values with at least 32 characters.
- Local image uploads are disabled on Vercel. Use UploadThing there.
- After setting `DATABASE_URL`, run `npm run db:generate`, then `npm run db:migrate` locally or `npm run db:deploy` in deployment.

## Neon + Prisma Setup

1. Create a Neon project and database.
2. Copy the pooled or direct Neon connection string.
3. Set `DATABASE_URL` with `sslmode=require`.
4. Run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Use `npm run db:deploy` instead of `npm run db:migrate` in production deployments.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
