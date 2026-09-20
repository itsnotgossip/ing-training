# Deploy checklist: putting the training online

**Goal:** the training live at **training.itsnotgossip.org**, a subdomain sitting alongside the main WordPress site. The main site is not touched.

**Who does what:** steps marked **[Sarah]** need the charity's own accounts. Steps marked **[Graham]** need the developer or the domain login. Do them in order, sitting together where possible.

---

## Where things stand

Already done, nothing to redo:

- The **code** is on GitHub at **github.com/itsnotgossip/ing-training** (private), owned by the charity's own organisation rather than any individual or agency.
- The **database** (Supabase) is set up and shared between the local copy and the live site. The schema, the grants fix and turning off email confirmation are all done.
- The **domain** itsnotgossip.org is managed at **IONOS**.

Still to do: everything below.

---

## Before you start

Have these to hand:

1. The two Supabase values, from the `.env.local` file on the developer's Mac:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. Login for the **Supabase** account (Sarah's).
3. Login for **IONOS**, where the domain lives.
4. An email address the charity controls, **info@itsnotgossip.org**, for account sign-ups.

---

## Part 1: Sarah's accounts

### 1. Create a GitHub account **[Sarah]**

Go to **github.com** and sign up. Use an address Sarah controls. This is a personal account representing Sarah, so her own email is correct here. Nobody else should create it or hold the password.

### 2. Add Sarah to the organisation **[Graham]**

In **github.com/itsnotgossip → People → Invite member**, invite Sarah and set her role to **Owner**.

Aim for two owners in total, so the charity is not locked out if one person is unavailable. A second trustee can be added the same way later.

### 3. Create a Vercel account **[Sarah]**

Go to **vercel.com** and sign up, choosing **Continue with GitHub** so the two are linked.

> **Note for Graham:** do not sign up to Vercel with Sarah's details, and do not use your own Limely Vercel login for this. Signing in with GitHub always lands you in your existing account, so the charity needs its own.

### 4. Decide the Vercel scope **[Sarah + Graham]**

Vercel gives every new account a personal (Hobby) space, and lets you create Teams.

- A **Hobby** space is free but is **single-user**, so Graham could not be added.
- A **Team** allows more than one person, and may require a paid plan.

Check the price at sign-up before committing. If a Team costs more than the charity wants to spend, stay on Hobby: **Graham does not need Vercel access for normal work**, because any change pushed to GitHub redeploys the site automatically. Vercel access is only needed for environment variables, domains and build logs.

---

## Part 2: Deploy

### 5. Import the project **[Sarah, with Graham]**

1. In Vercel, click **Add New → Project**.
2. Choose **Install GitHub App** / **Adjust GitHub App Permissions** and point it at the **itsnotgossip** organisation.
3. Grant access to **only the `ing-training` repository**, not all repositories.
4. `ing-training` now appears in the list. Click **Import**.

**Check the scope selector at the top of the import screen says the charity's account**, not a personal or agency one. This is the easiest thing to get wrong.

### 6. Add the environment variables **[Graham]**

Before clicking Deploy, open **Environment Variables** and add both:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from `.env.local` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the `sb_publishable_...` key from `.env.local` |

Names must match exactly, including the `NEXT_PUBLIC_` prefix. Leave them applied to all environments.

### 7. Deploy and check **[Sarah]**

Click **Deploy** and wait a couple of minutes. You will get an address like `ing-training.vercel.app`.

Open it. The landing page should load with the purple branding. **Stop here and fix anything broken before touching the domain.** If the page loads but logging in fails, the two values in step 6 are wrong or misspelled.

---

## Part 3: The custom domain and IONOS

Do this only once step 7 works.

### 8. Add the domain in Vercel **[Sarah]**

1. In the project, go to **Settings → Domains**.
2. Type **training.itsnotgossip.org** and click **Add**.
3. Vercel shows **one CNAME record**. Leave this screen open. You need the exact value it gives you, which looks like `cname.vercel-dns.com` but can differ by account. **Copy what Vercel shows rather than anything written in a guide.**

### 9. Add the DNS record at IONOS **[Graham]**

1. Sign in at **ionos.co.uk**.
2. Go to **Domains & SSL**, click **itsnotgossip.org**, then open its **DNS** settings.
3. Click **Add record** and choose **CNAME**.
4. Fill it in:

   | Field | Value |
   |-------|-------|
   | Type | CNAME |
   | Host name | `training` |
   | Points to | the value Vercel gave you in step 8 |
   | TTL | leave as default |

5. Save.

Two warnings:

- **Enter only `training` in the host name**, not the full address. IONOS adds the domain itself. Putting the whole thing in creates `training.itsnotgossip.org.itsnotgossip.org`.
- **Do not edit or delete any existing records.** The A and www records point at the main WordPress site and it will go offline if they change. You are only adding one new row.

IONOS wording shifts between panel versions, so labels may read slightly differently. The record type and the two values are what matter.

### 10. Wait for the tick **[Sarah]**

Back in Vercel's Domains screen, wait for a green tick next to the domain. Usually minutes, occasionally an hour or two. The HTTPS certificate is issued automatically once it verifies.

---

## Part 4: Tell Supabase the new address

### 11. Update the URL configuration **[Sarah]**

In **Supabase → Authentication → URL Configuration**:

- Set **Site URL** to `https://training.itsnotgossip.org`
- Under **Redirect URLs**, add both:
  - `https://training.itsnotgossip.org/**`
  - `http://localhost:3000/**`
- Save.

Skipping this means password reset and confirmation emails point at the wrong place.

---

## Part 5: Test it properly

At **https://training.itsnotgossip.org**, check each of these:

- [ ] The landing page loads over HTTPS with no browser warning.
- [ ] Creating a new account works, and lands you on the dashboard.
- [ ] Logging out and back in works.
- [ ] The module opens and moves between pages.
- [ ] Progress is remembered: leave halfway, come back, and it resumes.
- [ ] Finishing the module produces a certificate.
- [ ] **Download certificate** gives a PDF with the right name and date.
- [ ] The **Exit site** button, bottom right, leaves the site immediately.
- [ ] It works on a phone.

---

## Part 6: Link it from the main website

On the WordPress site, add a **Training** button or menu item pointing at **https://training.itsnotgossip.org**.

---

## Before go-live: one thing to remove

The certificate page has a development-only preview mode, used to check the certificate design without finishing the module. It is already ignored on the live site, so it is not urgent, but it should be deleted for tidiness. It is marked `TEMPORARY` in:

- `src/app/modules/[slug]/certificate/page.tsx`
- `src/app/modules/[slug]/certificate/download/route.ts`

---

## Good to know

- **Updating the site later:** anything pushed to the `main` branch on GitHub redeploys automatically within a couple of minutes. This checklist is a one-off.
- **Changing a Supabase value later:** update it in Vercel under **Settings → Environment Variables**, then redeploy. Changing it does not happen automatically.
- **Making someone an admin:** run the SQL in `SETUP-GUIDE.md` step 6 against their email address.
- **Ownership:** the code belongs to the charity's GitHub organisation, and Supabase and Vercel belong to Sarah's accounts. Keeping at least two people as owners on each is what stops the charity being locked out.
- **Cost:** GitHub is free for the organisation and this private repo. Supabase's free tier is ample. Vercel is free on Hobby; a Team may not be. See step 4.
