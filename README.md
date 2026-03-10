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
DATABASE_URL="file:./data/mehara.db"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@mehara.local"
ADMIN_PASSWORD="Admin123!"
SESSION_SECRET="replace-this-with-a-long-random-secret"
AUTH_SECRET="replace-this-with-a-long-random-secret"
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
DATABASE_URL="file:/tmp/mehara.db"
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

- Product, order, and user data are currently stored with `better-sqlite3` in `src/lib/db.ts`.
- On Vercel, this app falls back to `/tmp/mehara-data/mehara.db`, which is temporary storage only.
- That means products, orders, admin changes, and registered users can be lost after a cold start or redeploy.
- Local image uploads are disabled on Vercel. Use UploadThing there.
- If you want production-safe hosting, move runtime data off local SQLite to a managed database such as Postgres, Neon, Supabase, Railway, or Turso, then refactor `src/lib/data.ts` / `src/lib/db.ts` or switch fully to Prisma.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
