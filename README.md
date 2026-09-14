# FreshWave

FreshWave is a fictional mid-sized regional grocery chain. This repository is a university prototype for **FreshWave Assistant**, an AI-driven customer-facing platform that connects a selected store's live inventory, promotions, and a customer's own preferences into personalized meal plans and a ready-to-checkout shopping cart.

The prototype demonstrates how a physical-store grocery chain could combine its existing strengths (local inventory, in-store pickup) with AI-driven digital convenience — without inventing a fictional catalog the AI can hallucinate freely against. Every price, stock count, and promotion the assistant references comes from structured mock data in this repo, not from the model.

This is a polished course prototype, not production software — there is no real backend, database, authentication, or payment processing.

## FreshWave Intelligence Layer

The repository now includes the shared data foundation for five connected prototype capabilities:

- smart anti-waste promotions based on store freshness data and purchase history
- predictive Smart Fridge restock recommendations
- local product traceability
- an aisle-based in-store shopping navigator
- a Virtual Pantry with freshness and stock awareness

These capabilities share the existing product catalog through stable `productId` references rather than maintaining isolated mock datasets. Product records now support store aisle and shelf locations plus optional, category-appropriate freshness and provenance fields. Supporting typed datasets cover Sarah's purchase history and pantry, fictional local farms, and the FreshWave Riverside floor plan.

The shared data-model, Smart Anti-Waste Promotions, Smart Fridge, Transparent Local Traceability, and In-Store Navigator milestones are implemented. Virtual Pantry workflows and expanded Gemini context will be added in subsequent milestones.

### Smart Anti-Waste Promotions

Open `/deals/anti-waste` to see perishable Riverside products within their three-day freshness window. The application—not Gemini—calculates markdowns using a fixed ladder: 15% with three days remaining, 25% with two days, 35% with one day, and 40% on the freshness date. Expired products and products with more than three days remaining are excluded.

Sarah's purchase history also affects ordering without changing eligibility or prices. Products purchased at least three times are labeled and ranked first. Adding an offer to the cart preserves its computed anti-waste price throughout cart and meal-plan pricing.

### Smart Fridge predictive restocking

Open `/my-kitchen/smart-fridge` to see products Sarah is likely to need within seven days. For each repeatedly purchased product, application code averages the days between purchases, adds that interval to the most recent purchase date, and compares the prediction with the fixed demo date. Confidence is derived from the number of observations and how much the historical intervals vary; it is not presented as a trained AI forecast.

Sarah can select predictions and prepare a proposed restock cart. The proposal supports removal and quantity changes, and the shared cart is modified only after explicit confirmation. Pantry-aware prediction adjustments are intentionally deferred until the Virtual Pantry and cross-feature integration milestones.

### Transparent Local Traceability

Traceable products display an origin badge in the catalog and link to `/products/[id]`. Their product detail pages resolve farm, region, harvest or production date, and approximate distance from the shared product and farm records. Honeycrisp apples, for example, show a September 10 harvest at the fictional Green Valley Orchard, 18 km from FreshWave Riverside.

The farm-to-store visualization is a responsive SVG schematic derived from the stored coordinates. It requires no map service, paid API, or new dependency and is explicitly labeled as fictional prototype data rather than live supplier tracking. Non-traceable products still have detail pages and clearly state that producer-level provenance is unavailable.

### In-Store Navigator

Open `/in-store-navigator` directly or use “Plan my in-store route” from the cart. The deterministic routing function groups cart products by their shared aisle IDs, orders shelves within each section, and follows FreshWave Riverside's fixed clockwise traversal order from Entrance to Checkout. Unknown and zero-quantity cart lines are ignored, and duplicate product lines are consolidated into one route item.

The responsive schematic floor plan highlights visited sections and the recommended path. After choosing “Start Shopping,” Sarah can mark individual products or entire sections as collected and see route progress. This is explicitly aisle guidance for the prototype—not indoor GPS or live position tracking.

### Consistent demonstration scenario

The current data establishes one reproducible scenario for the demo customer, Sarah:

- Sarah regularly purchases milk, eggs, bananas, chicken, rice, and paper towels.
- Her pantry has broccoli and chicken that should be used soon, two cartons of milk, available rice, and depleted eggs.
- FreshWave Riverside has chicken approaching its sell-by date and Honeycrisp apples traceable to the fictional Green Valley Orchard.
- Every catalog product has a valid aisle and shelf-zone assignment for future store routing.

Freshness and prediction examples use the fixed demonstration date `2026-09-14`, exported from `data/demo-date.ts`. This keeps classroom demonstrations and tests repeatable instead of allowing outcomes to change with the computer's current date.

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

## Data architecture

The intelligence layer remains deliberately local and explainable:

| Data | Source | Purpose |
| --- | --- | --- |
| Products | `data/products.ts` | Prices, stock, dietary tags, freshness, provenance, and store location |
| Purchase history | `data/purchase-history.ts` | Historical buying intervals for Sarah |
| Pantry | `data/pantry.ts` | Sarah's explicit at-home quantities and freshness state |
| Farms | `data/farms.ts` | Clearly fictional producer profiles and coordinates |
| Store aisles | `data/store-aisles.ts` | Ordered zones and schematic floor-plan geometry |
| Demo clock | `data/demo-date.ts` | Stable reference date for deterministic demonstrations |

Shared domain contracts are defined in `types/intelligence.ts`, including `PurchaseHistory`, `PantryItem`, `Farm`, `StoreAisle`, `ShoppingRoute`, `RestockPrediction`, and `AntiWasteOffer`. Application code—not Gemini—will remain responsible for prices, discounts, dates, inventory, pantry quantities, predictions, and store routing.

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

## Validation

```bash
npm run typecheck
npm run lint
npm run test:data
npm run test:anti-waste
npm run test:smart-fridge
npm run test:traceability
npm run test:routing
npm run build
```

`test:data` verifies shared-data referential integrity, including unique IDs, valid product/farm/aisle relationships, valid quantities, freshness-field consistency, and the core Sarah demonstration facts.

## Project structure

```
app/            Routes: home/shop, assistant, meal-plan, cart, account, /api/chat
components/     UI, grouped by domain (assistant, cart, grocery, layout, ui)
data/           Shared mock data: catalog, customer, pantry, history, farms, store layout
lib/            Application logic; lib/ai/ holds the Gemini client, system prompt,
                model-fallback chain, and structured meal-plan pipeline
types/          Grocery, intelligence-domain, chat, and meal-plan contracts/schemas
scripts/        Framework-free integrity and Gemini fallback tests
```
