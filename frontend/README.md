This is the Next.js frontend for RiskNexus.

## Local setup

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` for the local FastAPI service.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for server-side account storage. The service-role key must never use a `NEXT_PUBLIC_` prefix or be exposed to the browser.
- `AUTH_SECRET` as a private random value of at least 32 characters for signing the session cookie.

Apply the SQL files in `../supabase/migrations/` to the Supabase project. The frontend manages signup and login itself: passwords are scrypt-hashed by the server and user records are stored in `public.app_users`. It does not use Supabase Auth.

Run the FastAPI backend from the `../backend/` directory with:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

If the browser reports 404 for every `/api/v1/...` request, verify that `NEXT_PUBLIC_API_URL` points to this FastAPI service and that its `/docs` page opens at `http://localhost:8000/docs`. Confirm that RiskNexus, not another application, is listening on that port.

## Run the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
