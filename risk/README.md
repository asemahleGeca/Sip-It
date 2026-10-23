# RISK IT

RISK IT is an Expo clothing shop built with Expo Router stack screens and Supabase. The customer journey is:

**Welcome → Create account / Sign in → Collection → Bag → Delivery checkout → Order confirmation**

There are no tab screens. Customers must be signed in to enter the collection or submit an order.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and set the project URL and **anon/publishable** key. Never put a service-role key in the app.
3. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. It creates the profile, product, order, and order-item tables; row-level-security policies; a profile trigger; an atomic stock-checking `place_order` RPC; and three sample products.
4. In Supabase Authentication settings, choose whether new accounts require email confirmation. With confirmation enabled, new customers confirm their email and then sign in before shopping.
5. Start the app with `npm install` followed by `npm run start`.

The TypeScript database and shop models in [`src/models`](./src/models) mirror the SQL schema and are used to type-check Supabase queries and checkout.

Products and sample prices are in USD. Update the sample product data and the currency formatters in `src/app/shop.tsx`, `src/app/cart.tsx`, and `src/app/checkout.tsx` for the store's market.

## Checkout and payments

Checkout validates delivery information and records an order with status `awaiting_payment`. Product prices and stock are read and checked again by the Supabase RPC, so the app does not accept a client-supplied total. This starter does **not** collect payment, calculate shipping or taxes, or send fulfillment notifications. Connect a payment provider and server-side fulfillment flow before accepting live orders.

## Development

```sh
npm run start
npm run lint
```
