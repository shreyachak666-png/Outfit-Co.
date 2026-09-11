# Outfit&Co.

A self-managed fashion curation lookbook. Once this is set up and deployed,
**you never need to touch code again** — you add, edit, reorder, hide and
delete outfits entirely from the `/admin` area of your own site.

---

## How it works

- **Public site** (`/`, `/look/[slug]`, `/about`) — reads outfits from your
  database and displays them. Nobody but you can edit anything here.
- **Admin area** (`/admin`) — private, password-protected. This is where you
  add new looks, upload images, paste shopping links, reorder your grid, and
  hide or delete outfits.
- **Database + image storage** — [Supabase](https://supabase.com) (a free-tier
  friendly backend). Everything you publish is stored there permanently —
  closing your browser, restarting your computer, etc. never loses anything.
- **Hosting** — you deploy the website itself (the code in this folder) to a
  host like [Vercel](https://vercel.com) (recommended), Netlify, or Cloudflare
  Pages. The instructions below focus on Vercel because it requires the
  least configuration for a Next.js site like this one, with notes for the
  alternatives.

You only need to follow this setup once. After that, everything happens on
the website itself.

---

## Part 1 — Create your Supabase project (the database)

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click **New Project**. Pick any name (e.g. "outfit-and-co"), set a
   database password (save it somewhere safe — you likely won't need it
   again), and choose a region close to you. Wait a minute or two for it to
   finish provisioning.
3. In your new project, open the **SQL Editor** (left sidebar) → **New
   query**. Open the file `supabase/schema.sql` from this project, copy its
   entire contents, paste it into the SQL editor, and click **Run**.
   This creates your two tables (`outfits` and `products`), locks them down
   so only you can edit them, sets up image storage, and adds one demo
   outfit so you can see how everything looks before you publish anything of
   your own.
4. Create your admin login: in the left sidebar go to **Authentication** →
   **Users** → **Add user** → **Create new user**. Enter the email and
   password you want to use to log in to `/admin`. Leave "Auto Confirm User"
   turned on. This is the *only* account that can manage your site — you
   don't need a public sign-up flow.
5. Get your API keys: go to **Project Settings** (gear icon) → **API**.
   You'll need two values from this page in a moment:
   - **Project URL**
   - **anon / public** key (NOT the `service_role` key — never share that
     one)

---

## Part 2 — Run the site locally (optional, but useful to check everything works)

You'll need [Node.js](https://nodejs.org) 20 or later installed.

```bash
cd outfit-and-co
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in the three values using what you copied from
Supabase in Part 1, step 5:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see the homepage with the demo
outfit. Visit `http://localhost:3000/admin` and log in with the email and
password you created in Part 1, step 4. From there you can try adding a
look, editing the demo, deleting it, etc.

---

## Part 3 — Deploy it so it has a real, public web address

### Option A — Vercel (recommended)

1. Push this project to a GitHub (or GitLab/Bitbucket) repository. If you're
   not familiar with git, the easiest path is: create a new repository on
   GitHub, then drag-and-drop / upload this project's files through GitHub's
   web interface, or ask someone to help you push it with `git`.
2. Go to [vercel.com](https://vercel.com), sign up/log in (you can use your
   GitHub account), click **Add New** → **Project**, and import the
   repository you just created.
3. Vercel will detect it's a Next.js project automatically — you don't need
   to change any build settings.
4. Before deploying, open **Environment Variables** and add the same three
   values from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` — set this to the address Vercel will give you,
     e.g. `https://outfit-and-co.vercel.app`, or your custom domain if you
     attach one. You can update this after your first deploy once you know
     the exact URL, then redeploy.
5. Click **Deploy**. In a minute or two, your site is live at the URL Vercel
   gives you.
6. (Optional) Add a custom domain under **Project Settings** → **Domains** —
   Vercel walks you through pointing your domain's DNS at it.

### Option B — Netlify

1. Push the project to GitHub as above.
2. In Netlify, **Add new site** → **Import an existing project**, connect the
   repository. Netlify auto-detects Next.js (build command `next build`,
   the Netlify Next.js runtime handles the rest).
3. Add the same three environment variables under **Site configuration** →
   **Environment variables**.
4. Deploy.

### Option C — Cloudflare Pages

Cloudflare Pages needs the `@cloudflare/next-on-pages` adapter to run a
Next.js App Router site with Server Actions (used throughout the admin area
here). If you choose this route:

```bash
npm install --save-dev @cloudflare/next-on-pages
```

Follow Cloudflare's [Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
for the exact build command and settings, and add the same three environment
variables in the Pages project settings. Vercel or Netlify will be simpler
for most people.

---

## Your day-to-day workflow (no code, ever)

1. Go to `yourdomain.com/admin` and log in.
2. Click **+ ADD NEW LOOK**.
3. Upload a photo, write a title and (optionally) a short description.
4. Pick a card colour.
5. Click **+ ADD PRODUCT** for each item in the outfit, and paste the
   product name and its shopping/affiliate URL. Add as many or as few as you
   like.
6. Click **Publish Look**.
7. Back on the dashboard, click **Copy Outfit Link** next to your new look —
   this copies its permanent URL (e.g. `yourdomain.com/look/the-burgundy-edit`).
8. Paste that link into Pinterest when you create your pin. Anyone who clicks
   the pin lands directly on that outfit's page — never the homepage.

Other things you can do from the dashboard:

- **Edit** — change the image, text, colour, products or URL slug of any
  look at any time.
- **Hide** — take a look off the public site without deleting it (useful if
  you want to pause something temporarily). **Show** brings it back.
- **Delete** — permanently remove a look (this also deletes its image).
- **Drag the ⠿ handle** — reorder your homepage grid exactly how you want it.

### About the demo outfit

Running the SQL in Part 1 adds one outfit called "The Demo Edit" so you can
see the site working end-to-end before publishing anything real. Log in to
`/admin`, find it on the dashboard, and click **Delete** whenever you're
ready — nothing else depends on it.

---

## Notes on how things are built (only relevant if you ever hire a developer)

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS.
- **Data & auth:** Supabase (Postgres + Auth + Storage), accessed via
  `@supabase/ssr` so your admin session is a secure, server-verified cookie
  — not something stored insecurely in the browser.
- **Images** are compressed in the visitor's browser before upload (so large
  phone photos don't slow down the site), stored in a public Supabase
  Storage bucket, and referenced by URL from the `outfits` table.
- **Reordering** uses drag-and-drop (`@dnd-kit`) and writes the new order to
  the database immediately.
- Every outfit gets a unique `slug` (URL segment) generated from its title;
  editing the title doesn't change the slug unless you edit the slug field
  yourself, so links you've already shared on Pinterest keep working.
- Row-level security policies in `supabase/schema.sql` are what actually
  enforce "only I can edit" — the password login is the front door, but the
  database itself refuses writes from anyone who isn't authenticated.

---

## Troubleshooting

- **Can't log in at `/admin`** — double-check you created the user under
  Supabase → Authentication → Users (Part 1, step 4), and that
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your
  deployment's environment variables exactly match your project's API
  settings.
- **Images won't upload** — confirm you ran the full `supabase/schema.sql`
  script (it creates the `outfit-images` storage bucket and its access
  rules). If you ran it before and changed nothing, re-running it is safe —
  it won't duplicate anything.
- **A Pinterest link 404s** — check the look hasn't been hidden or deleted
  from `/admin/dashboard`, and that the slug in the link matches exactly
  (slugs are case-sensitive, lowercase, hyphenated).
- **Changed `NEXT_PUBLIC_SITE_URL`** — after changing it in your host's
  environment variables, redeploy for it to take effect (it's baked in at
  build time so "Copy Outfit Link" and page metadata use the right domain).
