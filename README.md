# MyOnline Store

A single-seller online store (Daraz-style, but for one owner) built with **Next.js (App Router) + Tailwind CSS + Firebase**, deployable on **Vercel**.

## Stack

| Layer          | Tool                                            |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 16 (App Router) + Tailwind CSS           |
| Database       | Firestore                                        |
| Auth           | Firebase Auth (email/password + Google)         |
| Image hosting  | Manual image URLs (host anywhere — imgbb, Cloudinary, etc.) |
| Payments       | Cash on Delivery, JazzCash, Easypaisa (manual)   |
| Hosting        | Vercel (frontend) + Firebase (backend services)  |

## 1. Create your Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project.
2. **Build > Authentication > Get started** — enable the **Email/Password** and **Google** sign-in providers.
3. **Build > Firestore Database > Create database** — start in production mode (rules are provided below).
4. **Project settings > General > Your apps** — add a Web app and copy the config values.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from your Firebase web app config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_OWNER_UID=
NEXT_PUBLIC_STORE_NAME="My Online Store"
```

`NEXT_PUBLIC_OWNER_UID` controls who can access `/admin`. To get it:

1. Run the app and sign up for an account (email/password or Google) using the email you'll use as the store owner.
2. In the Firebase console, go to **Authentication > Users** and copy that user's **UID**.
3. Paste it into `NEXT_PUBLIC_OWNER_UID` in `.env.local` (and in your Vercel project's environment variables when you deploy).

## 3. Deploy security rules

This repo includes `firestore.rules`. Before deploying it, replace `OWNER_UID` inside the file with the same UID you used for `NEXT_PUBLIC_OWNER_UID`.

Then, using the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore, point to the existing firestore.rules file
firebase deploy --only firestore:rules
```

These rules ensure:

- Anyone can browse active products; only the owner can create/edit/delete products or see hidden ones.
- Signed-in customers can place orders and see only their own orders; only the owner can update order status.

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Sign up via `/login`, then add that account's UID as `NEXT_PUBLIC_OWNER_UID` to unlock `/admin`.
- From `/admin/products`, add your first products (with images, price, stock, category).
- Customers can browse `/products`, add items to their cart, and check out with **Cash on Delivery**, **JazzCash**, or **Easypaisa** (the latter two are recorded for manual confirmation — wire up a real payment gateway later if needed).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add all the `NEXT_PUBLIC_*` environment variables from `.env.local` to the Vercel project settings.
4. Deploy. Firebase (Auth, Firestore) continues to run as your backend; Vercel hosts the Next.js frontend.

## Project structure

```
src/
  app/              Routes (storefront, cart, checkout, orders, admin dashboard)
  components/       Shared UI (navbar, footer, product card)
  lib/              Firebase setup, auth, Firestore data access, cart store, formatting
  types/            Shared TypeScript types (Product, Order, CartItem, ...)
```

## Notes & next steps

- **Payments**: COD is fully self-contained. JazzCash/Easypaisa are currently recorded as the chosen method for manual follow-up — integrate their merchant APIs (or Stripe) when you're ready to automate payment capture.
- **Admin access**: gated purely by `NEXT_PUBLIC_OWNER_UID` + Firestore rules — there's no separate roles system since this is a single-seller store.
- **Categories**: derived dynamically from your products — just set a `category` when creating a product and it'll appear as a filter automatically.
