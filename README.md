# Decision Coach

A conversational decision-reflection prototype, now with email magic-link
sign-in via Supabase, ready to deploy on Vercel.

## What's here

- `app/page.tsx` — the landing page (ported from the original `index.html`)
- `app/login/page.tsx` — magic-link sign-in form
- `app/auth/callback/route.ts` — handles the link Supabase emails to the user
- `app/dashboard/page.tsx` — a protected placeholder page, only visible when signed in
- `proxy.ts` — keeps the login session refreshed and redirects signed-out users away from `/dashboard`
- `lib/supabase/` — the three Supabase client helpers (browser, server, proxy)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (GitHub login is fastest).
2. Click **New project**. Pick any name and a database password (save the password somewhere, you likely won't need it again for this app, but don't lose it).
3. Wait ~2 minutes for the project to finish provisioning.
4. In the left sidebar, go to **Project Settings -> API**.
5. Copy the **Project URL** and the **anon public** key.

## 2. Set your local environment variables

```bash
cp .env.local.example .env.local
```

Paste the URL and anon key from step 1 into `.env.local`.

## 3. Turn on email magic-link sign-in

Magic link is Supabase's default email auth method, so there's nothing to
toggle on for local development. Two things worth checking in the dashboard
under **Authentication -> URL Configuration** once you're ready to deploy:

- **Site URL**: set this to your Vercel URL once you have one (e.g. `https://decision-coach.vercel.app`)
- **Redirect URLs**: add `https://decision-coach.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` for local testing)

Without this, the magic link will redirect to the wrong place after deploying.

## 4. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Click **Sign in**, enter your email, then
check your inbox for the link. It'll drop you on `/dashboard`.

## 5. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign up with GitHub, click **Add New -> Project**, and import the repo.
3. Before deploying, add the two environment variables (same names as `.env.local`) under **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
5. Once deployed, copy your live URL and go back to Supabase's **Authentication -> URL Configuration** (step 3) to set the Site URL and add `https://<your-vercel-url>/auth/callback` to Redirect URLs.
6. Re-test sign-in on the live URL, the first deploy's magic link will fail until step 5 is done.

## Where the database comes in

Right now the only thing stored is the auth session itself (handled entirely
by Supabase). There's no app data table yet. Once you're ready to save
actual decision-coaching conversations, that's a new Supabase table (e.g.
`decisions`) plus a couple of queries in `app/dashboard/page.tsx` — happy to
build that next whenever you want it.
