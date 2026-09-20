# It's Not Gossip Training

Online training platform for [It's Not Gossip](https://www.itsnotgossip.org) (Registered Charity No. 1214504). Salon professionals create an account, complete domestic abuse awareness modules, and download a certificate. Pre and post self-assessment surveys measure the impact of the training.

**Live at [training.itsnotgossip.org](https://training.itsnotgossip.org).**

To stand the whole thing up from scratch, on a new database or elsewhere, see
[SETUP-GUIDE.md](./SETUP-GUIDE.md).

## Stack

- [Next.js](https://nextjs.org) (App Router) hosted on Vercel
- [Supabase](https://supabase.com) for accounts and data (schema in `supabase/schema.sql`)
- Tailwind CSS, branded to the charity (purple `#7e639c`, pink `#d479b2`, Nunito)

## Key places in the code

| What | Where |
|------|-------|
| Module content | `src/lib/modules/turning-conversations.ts` |
| Module list | `src/lib/modules/index.ts` |
| Module player (steps, quizzes, surveys) | `src/components/ModulePlayer.tsx` |
| Certificate | `src/app/modules/[slug]/certificate/page.tsx` |
| Admin dashboard | `src/app/admin/page.tsx` |
| Auth pages | `src/app/{login,register,forgot-password,reset-password}` |
| Route protection | `src/proxy.ts` |

## How it's deployed

| Piece | Where it lives |
|-------|----------------|
| Code | `github.com/itsnotgossip/ing-training`, branch `main` |
| Hosting | Vercel, project `ing-training`, under the charity's own account |
| Database and accounts | Supabase |
| Domain | `training.itsnotgossip.org`, a CNAME on `training` managed at IONOS |

Pushing to `main` deploys automatically, usually within a couple of minutes.
There is no separate release step.

Things worth knowing before changing any of it:

- The two Supabase values live in Vercel under **Settings → Environment
  Variables**. They are compiled into the build, so changing one needs a
  redeploy before it takes effect.
- Supabase's **Authentication → URL Configuration** has to list the live
  address, or password reset emails point at the wrong place. Keep
  `http://localhost:3000/**` in the redirect list so local work keeps working.
- The main WordPress site shares the domain. Only the `training` record
  belongs to this app; leave every other DNS record alone.
- The repository is public because Vercel's free plan will not deploy a
  private repository owned by an organisation. Keep credentials out of it.
  Real protection comes from Supabase's row level security, in
  `supabase/schema.sql`, not from the code being hidden.

## Local development

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # only needed if Node is installed here
npm run dev
```

Requires `.env.local` with the Supabase URL and anon key (see `.env.local.example`).
