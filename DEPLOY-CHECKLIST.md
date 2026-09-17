# Deploy checklist: putting the training online

Goal: get the training live at **training.itsnotgossip.org**, a subdomain sitting alongside the main WordPress site. The main site is not touched. Nothing here costs money.

The database (Supabase) is already set up and shared between your Mac and the live site, so there is no database work to redo. This is only about hosting the app and pointing the web address at it.

There are two ways to do this. Pick ONE.

---

## Route A: Hand it to a web developer (fastest, ~30–45 min for them)

Give them this folder and these five facts. Anyone comfortable with Vercel will know exactly what to do.

1. It's a **Next.js 16** app. Deploy it to **Vercel** (free tier is fine).
2. Two environment variables are needed on Vercel, values are in the local **`.env.local`** file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Add the custom domain **training.itsnotgossip.org** in Vercel, and create the DNS record it asks for wherever itsnotgossip.org's DNS is managed.
4. In **Supabase → Authentication → URL Configuration**, set **Site URL** to `https://training.itsnotgossip.org` and add both that and `http://localhost:3000/**` to **Redirect URLs**.
5. Full context is in **SETUP-GUIDE.md** (Steps 7 and 8).

Then skip to "Final step: link it from your website" at the bottom.

---

## Route B: Do it yourself, no command line (~1 hour, friendly apps only)

### Part 1: Put the code on GitHub

1. Download and install **GitHub Desktop** from **desktop.github.com**.
2. Open it and **create a free GitHub account** when prompted (or sign in).
3. In GitHub Desktop: menu **File → Add Local Repository**.
4. Click **Choose…** and select this folder:
   `/Users/sarah/Documents/ING Training/ing-training`
5. It will say "this directory is not a Git repository." Click the blue link to **create a repository here**, then click **Create Repository**.
6. Click **Publish repository** (top right). **Tick "Keep this code private."** Click Publish.

Your code is now safely on GitHub. (Your secret `.env.local` file is automatically left out, so nothing private is uploaded.)

### Part 2: Deploy on Vercel

7. Go to **vercel.com** and click **Sign Up**. Choose **Continue with GitHub** so they're linked.
8. Click **Add New → Project**. You'll see your `ing-training` repo. Click **Import**.
9. Before clicking Deploy, open the **Environment Variables** section and add these two (copy the values from your `.env.local` file on your Mac):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (the URL from .env.local) |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | (the sb_publishable... key from .env.local) |

10. Click **Deploy** and wait a couple of minutes. You'll get a live address like `ing-training.vercel.app`. It already works.

### Part 3: Use your own web address

11. In your Vercel project, go to **Settings → Domains**.
12. Type **training.itsnotgossip.org** and click **Add**.
13. Vercel shows you **one DNS record** (a "CNAME"). Copy it.
14. Add that record wherever **itsnotgossip.org**'s domain is managed (the same place the main website's address is controlled). If you're not sure where that is, whoever built the main site will know. This is the one step that needs access to your domain settings.
15. Wait for Vercel to show a green tick next to the domain (can take a few minutes to a couple of hours).

### Part 4: Tell Supabase the new address

16. In **Supabase → Authentication → URL Configuration**:
    - Set **Site URL** to `https://training.itsnotgossip.org`
    - Under **Redirect URLs**, add `https://training.itsnotgossip.org/**` and `http://localhost:3000/**`
    - Save.

---

## Final step: link it from your website

On the main WordPress site, add a **"Training"** button or menu item that links to **https://training.itsnotgossip.org**. Now visitors flow straight from the charity site into the training, and it all feels like one place.

---

## Good to know

- **Updating the site later:** once it's on Vercel, any change we make and save to GitHub redeploys automatically. No need to repeat this checklist.
- **The two Supabase jobs you already did** (grants fix and turning off email confirmation) apply to the live site too, because it's the same database. Nothing to redo.
- **Cost:** Vercel's free tier comfortably covers a training site like this. The subdomain is free.
