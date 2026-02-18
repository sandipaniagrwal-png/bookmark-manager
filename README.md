This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Problems Faced & Solutions

## 1. Google OAuth Issues in Production

Problem: Login failed after deployment.
Solution: Added Vercel URL in Supabase Auth settings and configured correct redirect URI in Google Cloud Console.

---

## 2. Realtime Not Syncing Across Tabs

Problem: Bookmarks added in one tab didn’t appear in another.
Solution:

* Enabled replication for the `bookmarks` table in Supabase
* Implemented proper `postgres_changes` subscription
* Removed custom browser events

---

## 3. Delete Not Working

Problem: Delete action failed silently.
Solution: Added Row Level Security (RLS) DELETE policy:

-sql

auth.uid() = user_id;

This ensures users can delete only their own bookmarks.

---

## 4. Environment Variables Missing on Vercel

Problem: App crashed after deployment.
Solution: Added required environment variables in Vercel dashboard and redeployed.

---

## Key Learnings

* Security must be enforced using RLS policies.
* Supabase Realtime requires replication enabled.
* OAuth requires proper redirect configuration.
* Production environments need separate environment variable setup.
