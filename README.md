# Northstar ecommerce storefront

A responsive React + Vite ecommerce experience with a public product catalog,
product detail pages, Firebase email/password authentication, account settings,
and a per-user persisted cart.

## Run locally

```bash
npm install
npm run dev
```

## Environment variables

Create `.env` beside `package.json`:

```env
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com
VITE_FIREBASE_WEB_API_KEY=YOUR_FIREBASE_WEB_API_KEY
VITE_CRUDCRUD_API_URL=https://crudcrud.com/api/YOUR_CRUDCRUD_KEY
```

Enable the Email/Password provider in Firebase Authentication. The Realtime
Database is used by the contact form, while CrudCrud stores each signed-in
customer's cart. CrudCrud development endpoints expire, so replace that URL
when the service issues a new endpoint.

## Checks

```bash
npm run lint
npm run build
```
