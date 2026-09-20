# It's Not Gossip Training: setup guide

Follow these steps once and the whole system is live. Nothing here needs coding, it's all copy and paste. Budget about 30 minutes.

## What you're setting up

- **Supabase** (free): holds the user accounts and all the training data
- **Vercel** (free): hosts the website itself
- **GitHub** (free): stores the code, Vercel deploys from it

---

## Step 1: Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (easiest with a Google account).
2. Click **New project**. Name it `ing-training`, choose a strong database password (save it somewhere safe, you rarely need it), region **West EU (London)**.
3. Wait a minute or two for it to finish creating.

## Step 2: Create the database tables

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Open the file `supabase/schema.sql` in this folder, copy ALL of it.
3. Paste it into the SQL editor and click **Run**. You should see "Success. No rows returned".

## Step 3: Connect the app to Supabase

You need two things from Supabase: the **Project URL** and the **Publishable key**.

- **Publishable key**: go to **Project Settings** (gear icon) then **API Keys**. Under the heading **Publishable key** you'll see one starting `sb_publishable_...`. Click the copy icon next to it. (Supabase used to call this the "anon / public" key. It's the same thing, safe to use in a browser.)
- **Project URL**: this is on a different page. Click the green **Connect** button at the top of the dashboard, and copy the `Project URL` (looks like `https://xxxxx.supabase.co`). It's also under **Project Settings → Data API**.

Then, in this folder, open the file `.env.local` and replace the two placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co   # the Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...          # the Publishable key
```

## Step 4: Make signing up smooth (recommended)

By default Supabase makes every new user click a confirmation email before they can log in. For salon staff this is friction we don't need.

1. In Supabase go to **Authentication → Sign In / Providers → Email**.
2. Turn **Confirm email** OFF and save.

If you'd rather keep email confirmation on, instead go to **Authentication → Emails → Templates** and change the links in two templates:

- **Confirm signup**: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
- **Reset password**: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`

Either way, ALSO do the template change for **Reset password** above, so the "forgotten password" flow works.

## Step 5: Try it on your Mac

In Terminal:

```
cd "path/to/ing-training"
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev
```

Open http://localhost:3000 and create a test account. Complete the module and check your certificate appears.

## Step 6: Make yourself admin

1. In Supabase, open **SQL Editor** and run (with your real email):

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

2. Log out and back in on the site. You'll now see an **Admin** link in the header with every user, their progress, before and after scores, and a CSV download.

## Step 7: Put it on the internet

1. Create a free account at [github.com](https://github.com) and one at [vercel.com](https://vercel.com) (sign up to Vercel *with* your GitHub account).
2. Push this folder to a new GitHub repository (ask Claude to do this part for you, it's one command once you're logged in to GitHub).
3. In Vercel click **Add New → Project**, pick the repository, and before deploying add the two environment variables from Step 3 (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
4. Click **Deploy**. You'll get a live URL like `ing-training.vercel.app`.
5. Back in Supabase go to **Authentication → URL Configuration** and set **Site URL** to your live URL. Add `http://localhost:3000/**` to **Redirect URLs** so local testing keeps working.

## Step 8 (optional): Use your own web address

In Vercel go to the project's **Settings → Domains** and add `training.itsnotgossip.org`. Vercel shows you one DNS record to add wherever itsnotgossip.org's domain is managed. Then update the Supabase Site URL to match.

---

## Adding future modules

Each module is one file in `src/lib/modules/`. To add module two, copy `turning-conversations.ts`, change the content, and add it to the list in `src/lib/modules/index.ts`. Ask Claude to convert your next PowerPoint or document into a module file, everything else (tracking, certificates, admin reporting) works automatically.

## If something breaks

- **"Invalid API key" or endless loading**: the two values in `.env.local` (or Vercel's environment variables) don't match Supabase. Re-copy them.
- **Sign up works but log in says email not confirmed**: Step 4 wasn't saved.
- **Password reset emails link to the wrong place**: the Reset password template in Step 4 wasn't updated, or the Site URL in Step 7.5 is wrong.
