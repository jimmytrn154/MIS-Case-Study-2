# FreshWave

FreshWave is a fictional mid-sized regional grocery chain. This repository is a university prototype for **FreshWave Assistant**, an AI-driven customer-facing platform that connects a selected store's live inventory, promotions, and a customer's own preferences into personalized meal plans and a ready-to-checkout shopping cart.

The prototype demonstrates how a physical-store grocery chain could combine its existing strengths (local inventory, in-store pickup) with AI-driven digital convenience — without inventing a fictional catalog the AI can hallucinate freely against. Every price, stock count, and promotion the assistant references comes from structured mock data in this repo, not from the model.

This is a polished course prototype, not production software — there is no real backend, database, authentication, or payment processing.

## The FreshWave Assistant

FreshWave Assistant is the in-app AI helper at the center of the prototype. It is grounded, on every request, in:

- the selected store's live inventory (product, price, current stock)
- active promotions (percentage discounts, member deals, sell-by deals)
- the demo customer's profile (household size, budget habits, dietary restrictions, loyalty status)

**What it can do:**

- **Have an ordinary conversation** about products, deals, and general shopping questions, grounded strictly in the store's real inventory and promotions — it will say a product isn't available rather than invent one, and it will never invent a price.
- **Generate a personalized, structured meal plan** on request (e.g. "Plan five dinners for two people under $60, no pork") — a day-by-day plan built entirely from real FreshWave products, respecting the customer's dietary restrictions and stated budget.
- **Price every meal plan using application code, not the model.** The AI decides *what* to cook and how much of each product to buy; this app looks up the real product prices and stock, computes every line cost, meal cost, total, and savings figure itself, and drops any product the model gets wrong (an unknown ID, an out-of-stock item) rather than trusting it blindly.
- **Turn a meal plan into a shopping list and cart.** Duplicate ingredients across meals are consolidated (e.g. chicken breast needed on two different days merges into one line), quantities are capped to real stock, and the consolidated list can be added to the cart in one action.
- **Simulate a store pickup reservation** — a clearly-labeled prototype confirmation, not a real order.
- **Stay available under transient failures.** Requests fall back across a configurable chain of Gemini models (rate limits, timeouts, and server errors move to the next model; configuration or auth errors fail immediately rather than masking a real problem).

**How it stays grounded:** the assistant's system prompt — its identity, strict grounding rules, and behavior contract — lives in its own dedicated file, [`lib/ai/system-prompt.ts`](lib/ai/system-prompt.ts), along with the logic that injects live store, inventory, promotion, and customer data into every request. All structured output from the model is validated with Zod before the app ever trusts or renders it.

**Where it lives:** the chat interface is at `/assistant`; generated meal plans render as cards inline in that same conversation, with a shopping-list summary and an "Add meal plan to cart" action.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Gemini API** (`@google/genai`), called only from server-side code
- **Zod** for validating both API input and all AI-derived output
- Local TypeScript/JSON mock data — no database

## Getting started

```bash
npm install
npm run dev
```

The app needs a Gemini API key to power the assistant. Create `.env.local` in the project root:

```bash
GEMINI_API_KEY=your-api-key-here

# Optional — model fallback chain, tried in order. Falls back automatically
# on rate limits/timeouts/server errors; auth/config errors fail fast.
GEMINI_PRIMARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL_1=
GEMINI_FALLBACK_MODEL_2=
GEMINI_FALLBACK_MODEL_3=
```

`GEMINI_API_KEY` is required for the assistant to respond; without it, the rest of the app (browsing, cart, account) still works normally.

## Project structure

```
app/            Routes: home/shop, assistant, meal-plan, cart, account, /api/chat
components/     UI, grouped by domain (assistant, cart, grocery, layout, ui)
data/           Structured mock data: products, categories, promotions, store, customer
lib/            Application logic; lib/ai/ holds the Gemini client, system prompt,
                model-fallback chain, and structured meal-plan pipeline
types/          Shared TypeScript types and Zod schemas
```
