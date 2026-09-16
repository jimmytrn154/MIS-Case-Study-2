# FreshWave

FreshWave is a fictional mid-sized regional grocery chain. This repository is a university prototype of its connected grocery experience: product discovery, deterministic retail intelligence, pantry and cart workflows, and **FreshWave Assistant**, an AI grocery and meal-planning helper.

The application combines FreshWave Riverside's structured mock inventory and promotions with a demo customer's preferences, purchase history, pantry, and cart. Gemini can explain this supplied context and generate grounded meal ideas, but it is never the source of truth for products, prices, discounts, quantities, dates, provenance, predictions, or store routes.

This is a polished course prototype, not production retail software. There is no real retailer integration, backend database, authentication, payment processing, indoor positioning, or completed order fulfillment. Cart, pickup, purchase, supplier, and location experiences are explicitly simulated.

## Product identities and boundaries

| Identity | Current role |
| --- | --- |
| **FreshWave** | The fictional regional grocery brand represented by the application. |
| **FreshWave Riverside** | The selected fictional demo store at 1450 Riverside Ave, with structured inventory, hours, aisles, shelves, freshness dates, and coordinates. |
| **Sarah** | The fixed demo customer: household of two, member since 2024, budget-conscious and high-protein preferences, a no-pork restriction, purchase history, loyalty data, and a Virtual Pantry. |
| **FreshWave Assistant** | A concise, practical AI shopping associate that answers grocery questions, creates grounded recipes and meal plans, explains supplied intelligence, and suggests available alternatives. |
| **FreshWave application logic** | The authoritative layer for inventory, prices, totals, discounts, dates, pantry mutations, restock predictions, traceability relationships, and aisle routing. |
| **Gemini** | A server-side language model used for conversation and generation only; its structured output is validated before the UI accepts it. |

All stores, customers, farms, inventory, purchases, pantry records, prices, and promotions in this repository are fictional demonstration data.

## Core application experience

| Route | Capability |
| --- | --- |
| `/` | Browse and filter the 42-product catalog, review promotional panels and cart context, and open dashboard cards for pantry expiry, restocks, anti-waste offers, cart routing, and local provenance. |
| `/products/[id]` | Review product availability, effective price, shelf location, cart actions, and traceability when producer data exists. |
| `/assistant` | Chat with FreshWave Assistant, generate validated meal plans, consolidate shopping lists, and add plans to the shared cart. |
| `/cart` | Adjust quantities, retain verified promotional pricing, simulate pickup, convert a confirmed demo cart into pantry batches, or plan an aisle route. |
| `/deals/anti-waste` | Browse deterministic freshness markdowns, with frequent purchases ranked as personalized offers. |
| `/my-kitchen/smart-fridge` | Review purchase-history predictions adjusted by current pantry stock before confirming a proposed restock cart. |
| `/my-kitchen/pantry` | Track at-home quantities and expiry status, generate pantry-grounded recipes, deduct cooked ingredients, and confirm restocks. |
| `/in-store-navigator` | Turn the cart into a deterministic Riverside aisle sequence and mark products or sections as collected. |
| `/account` | View Sarah's fictional profile, preferences, restriction, loyalty summary, and selected store. |

The standalone `/meal-plan` route remains a placeholder; generated meal plans currently render inside the `/assistant` conversation, where they can be reviewed and added to the cart.

## FreshWave Intelligence Layer

The repository now includes the shared data foundation for five connected prototype capabilities:

- smart anti-waste promotions based on store freshness data and purchase history
- predictive Smart Fridge restock recommendations
- local product traceability
- an aisle-based in-store shopping navigator
- a Virtual Pantry with freshness and stock awareness

These capabilities share the existing product catalog through stable `productId` references rather than maintaining isolated mock datasets. Product records now support store aisle and shelf locations plus optional, category-appropriate freshness and provenance fields. Supporting typed datasets cover Sarah's purchase history and pantry, fictional local farms, and the FreshWave Riverside floor plan.

The shared data-model and feature milestones through responsive/mobile polish are implemented: Smart Anti-Waste Promotions, Smart Fridge, Transparent Local Traceability, In-Store Navigator, Virtual Pantry, the connected home dashboard, and a single grounded assistant context spanning those capabilities.

### Smart Anti-Waste Promotions

Open `/deals/anti-waste` to see perishable Riverside products within their three-day freshness window. The application—not Gemini—calculates markdowns using a fixed ladder: 15% with three days remaining, 25% with two days, 35% with one day, and 40% on the freshness date. Expired products and products with more than three days remaining are excluded.

Sarah's purchase history also affects ordering without changing eligibility or prices. Products purchased at least three times are labeled and ranked first. Adding an offer to the cart preserves its computed anti-waste price throughout cart and meal-plan pricing.

### Smart Fridge predictive restocking

Open `/my-kitchen/smart-fridge` to see products Sarah is likely to need within seven days. For each repeatedly purchased product, application code averages the days between purchases, adds that interval to the most recent purchase date, and compares the prediction with the fixed demo date. Confidence is derived from the number of observations and how much the historical intervals vary; it is not presented as a trained AI forecast.

Sarah can select predictions and prepare a proposed restock cart. The proposal supports removal and quantity changes, and the shared cart is modified only after explicit confirmation. Before recommendations are shown, current pantry quantities can suppress unnecessary purchases or promote depleted and low-stock products to “needed now.”

### Transparent Local Traceability

Traceable products display an origin badge in the catalog and link to `/products/[id]`. Their product detail pages resolve farm, region, harvest or production date, and approximate distance from the shared product and farm records. Honeycrisp apples, for example, show a September 10 harvest at the fictional Green Valley Orchard, 18 km from FreshWave Riverside.

The farm-to-store visualization is a responsive SVG schematic derived from the stored coordinates. It requires no map service, paid API, or new dependency and is explicitly labeled as fictional prototype data rather than live supplier tracking. Non-traceable products still have detail pages and clearly state that producer-level provenance is unavailable.

### In-Store Navigator

Open `/in-store-navigator` directly or use “Plan my in-store route” from the cart. The deterministic routing function groups cart products by their shared aisle IDs, orders shelves within each section, and follows FreshWave Riverside's fixed clockwise traversal order from Entrance to Checkout. Unknown and zero-quantity cart lines are ignored, and duplicate product lines are consolidated into one route item.

The responsive schematic floor plan highlights visited sections and the recommended path. After choosing “Start Shopping,” Sarah can mark individual products or entire sections as collected and see route progress. This is explicitly aisle guidance for the prototype—not indoor GPS or live position tracking.

### Virtual Pantry

Open `/my-kitchen/pantry` to inspect Sarah's at-home inventory. Expiration state is recalculated in application code: zero quantity is low stock, past dates are expired, dates within three days are Use Soon, and remaining items are classified by their stored low-stock threshold. The cart's “Simulate completed purchase” action explicitly converts confirmed demo cart quantities into new pantry batches, applies structured package-to-pantry unit conversions where needed, and then clears the cart; it does not represent a real payment or order.

“Cook with what I have” sends Gemini only the current, non-expired pantry products, quantities, units, statuses, and dates, with Use Soon items first. Application code rejects unknown product IDs, caps every suggested consumption amount to the available quantity, and supplies product names and units from structured FreshWave data. “Mark as Cooked” shows a confirmation list before deducting quantities, never permits a negative result, and moves depleted items into Upcoming Restock. Restock items enter the cart only after the customer selects “Add to cart.”

### Cross-feature integration

Smart Fridge recommendations now combine historical purchase timing with the current Virtual Pantry. Sufficient home stock suppresses an otherwise near-term recommendation, while depleted or threshold-level stock promotes a product to “needed now.” In Sarah's demo, two milk cartons defer the historical milk recommendation, empty eggs remain urgent, and low paper-towel stock advances its forecast. The original behavioral calculation remains visible and the pantry adjustment is deterministic.

Pantry recipes also check structured anti-waste offers after Gemini returns. If a recipe would finish an ingredient that currently has a store anti-waste deal, the application—not Gemini—shows the verified discount and price and lets Sarah add it to the cart. The home page summarizes restock, pantry-expiry, personalized anti-waste, cart-route, and local-origin signals in compact cards linking to their source features.

### Gemini intelligence context

Every main-assistant request now carries the current browser pantry and cart state to the server. Server-side application code validates those records against Sarah and the FreshWave catalog, recalculates pantry freshness, combines pantry state with historical restock predictions, computes deterministic anti-waste offers, resolves fictional producer relationships, and builds the current cart's aisle route. Gemini receives the resulting structured context; it does not perform those business calculations.

The system prompt explicitly prohibits invented pantry quantities, expiry or origin dates, farms, discounts, aisle locations, and indoor positioning. The assistant may explain verified results, personalize suggestions, generate recipes, and suggest catalog-grounded alternatives, while application logic remains authoritative for prices, discounts, inventory, dates, pantry state, predictions, and routing. The dedicated pantry-recipe prompt follows the same boundary.

### Responsive and mobile behavior

The five intelligence feature surfaces are verified at 390px, 430px, tablet, and desktop widths. Pantry and restock actions expand on narrow screens, dense navigator rows wrap without hiding shelf details, provenance metadata remains readable, SVG farm and store maps scale to their containers, and modal content stays scrollable within short mobile viewports. Interactive controls use touch-friendly targets and the application prevents page-level horizontal overflow.

### Consistent demonstration scenario

The current data establishes one reproducible scenario for the demo customer, Sarah:

- Sarah regularly purchases milk, eggs, bananas, chicken, rice, and paper towels.
- Her pantry has broccoli and chicken that should be used soon, two cartons of milk, available rice, and depleted eggs.
- FreshWave Riverside has chicken approaching its sell-by date and Honeycrisp apples traceable to the fictional Green Valley Orchard.
- Every catalog product has a valid aisle and shelf-zone assignment used by the current In-Store Navigator.

Freshness and prediction examples use the fixed demonstration date `2026-09-14`, exported from `data/demo-date.ts`. This keeps classroom demonstrations and tests repeatable instead of allowing outcomes to change with the computer's current date.

## The FreshWave Assistant

FreshWave Assistant is the in-app AI helper at the center of the prototype. It is grounded, on every request, in:

- FreshWave Riverside's structured demo inventory (product, price, current stock)
- active promotions (percentage discounts, member deals, sell-by deals)
- the demo customer's profile (household size, preferences, dietary restrictions, loyalty status)
- current Virtual Pantry quantities and application-calculated freshness states
- pantry-aware restock recommendations and predictions currently covered by home stock
- deterministic anti-waste offers and fictional local-producer provenance
- the current cart's schematic aisle route

**What it can do:**

- **Have an ordinary conversation** about products, deals, pantry state, restocks, origins, routes, and general shopping questions, grounded strictly in supplied FreshWave data—it will say information is unavailable rather than inventing it.
- **Generate a personalized, structured meal plan** on request (e.g. "Plan five dinners for two people under $60, no pork")—a day-by-day plan built entirely from supplied catalog products, respecting the customer's dietary restrictions and stated budget.
- **Price every meal plan using application code, not the model.** The AI decides *what* to cook and how much of each product to buy; the app looks up structured catalog prices and stock, computes every line cost, meal cost, total, and savings figure itself, and drops any product the model gets wrong rather than trusting it blindly.
- **Turn a meal plan into a shopping list and cart.** Duplicate ingredients across meals are consolidated, quantities are capped to catalog stock, and the consolidated list can be added to the cart in one action.
- **Simulate a store pickup reservation** — a clearly-labeled prototype confirmation, not a real order.
- **Stay available under transient failures.** Requests fall back across a configurable chain of Gemini models (rate limits, timeouts, and server errors move to the next model; configuration or auth errors fail immediately rather than masking a real problem).

**How it stays grounded:** the assistant's system prompt—its identity, strict grounding rules, and behavior contract—lives in [`lib/ai/system-prompt.ts`](lib/ai/system-prompt.ts). Each request receives structured store, inventory, promotion, customer, pantry, restock, anti-waste, provenance, and route context assembled by application code. Zod validates request and AI response shapes, and application resolvers reject unknown products, cap quantities to stock or pantry availability, and calculate all displayed monetary values.

**Where it lives:** the chat interface is at `/assistant`; generated meal plans render as cards inline in that same conversation, with a shopping-list summary and an "Add meal plan to cart" action.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Gemini API** (`@google/genai`), called only from server-side code
- **Zod** for validating both API input and all AI-derived output
- Typed local TypeScript mock data and browser `localStorage` — no database

## Data architecture

The intelligence layer remains deliberately local and explainable:

| Data | Source | Purpose |
| --- | --- | --- |
| Products | `data/products.ts` | Prices, stock, dietary tags, freshness, provenance, and store location |
| Promotions | `data/promotions.ts` | Catalog promotion identities and labels |
| Customer | `data/customer.ts` | Sarah's household, preferences, restriction, and loyalty context |
| Store | `data/store.ts` | Selected Riverside identity, address, hours, and schematic coordinates |
| Purchase history | `data/purchase-history.ts` | Historical buying intervals for Sarah |
| Pantry | `data/pantry.ts` | Sarah's explicit at-home quantities and freshness state |
| Farms | `data/farms.ts` | Clearly fictional producer profiles and coordinates |
| Store aisles | `data/store-aisles.ts` | Ordered zones and schematic floor-plan geometry |
| Demo clock | `data/demo-date.ts` | Stable reference date for deterministic demonstrations |

Shared domain contracts are defined in `types/intelligence.ts`, including `PurchaseHistory`, `PantryItem`, `Farm`, `StoreAisle`, `ShoppingRoute`, `RestockPrediction`, and `AntiWasteOffer`. Application code—not Gemini—is responsible for prices, discounts, dates, inventory, pantry quantities, predictions, and store routing.

The shared cart, Virtual Pantry, and assistant conversation persist in browser `localStorage`. They are local prototype state, not synchronized customer records. Removing the site's browser storage restores the seeded demonstration state on the next visit.

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

For a reliable walkthrough, begin at `/`, use the seeded Sarah scenario, and treat every pickup, completed-purchase, farm, and route interaction as a simulation. The app's deterministic intelligence features do not require Gemini; only assistant conversation and pantry-recipe generation call the API.

## Validation

```bash
npm run typecheck
npm run lint
npm run test:data
npm run test:anti-waste
npm run test:smart-fridge
npm run test:traceability
npm run test:routing
npm run test:pantry
npm run test:cross-feature
npm run test:assistant-context
npm run build
```

The framework-free test scripts cover shared-data referential integrity, anti-waste pricing, restock prediction, traceability, routing, pantry mutation, cross-feature pantry/restock behavior, and the structured assistant context. `test:data` additionally verifies unique IDs, valid product/farm/aisle relationships, freshness-field consistency, and the core Sarah demonstration facts.

## Project structure

```
app/            App Router pages plus server-only chat and pantry-recipe endpoints
components/     UI grouped by assistant, cart, deals, grocery, home, kitchen,
                navigator, pantry, traceability, layout, and shared controls
data/           Shared mock data: catalog, customer, pantry, history, farms, store layout
lib/            Deterministic pricing, prediction, pantry, provenance, and routing logic;
                lib/ai/ contains the Gemini client, prompts, context, and response pipeline
types/          Grocery, intelligence, assistant-context, chat, pantry-recipe,
                and meal-plan contracts/schemas
scripts/        Framework-free data, feature-logic, integration, and grounding tests
```
