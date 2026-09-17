# It's Not Gossip Training

Online training platform for [It's Not Gossip](https://www.itsnotgossip.org) (Registered Charity No. 1214504). Salon professionals create an account, complete domestic abuse awareness modules, and download a certificate. Pre and post self-assessment surveys measure the impact of the training.

**To get this live, follow [SETUP-GUIDE.md](./SETUP-GUIDE.md).**

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

## Local development

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # Node lives here on Sarah's Mac
npm run dev
```

Requires `.env.local` with the Supabase URL and anon key (see `.env.local.example`).
