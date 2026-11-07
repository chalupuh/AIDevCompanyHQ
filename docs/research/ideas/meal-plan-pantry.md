# Meal Plan Pantry

## Working name and pitch

**PantryPlan** — A weekly meal planner that starts with what you already have in the pantry, so you cook from your own recipes and only buy what's missing — fully offline, no scraping, no subscription.

## Target user and job-to-be-done

**Target:** Home cooks (typically one person per household planning meals) who want to reduce food waste and avoid last-minute grocery trips without subscribing to a recipe service.

**Job-to-be-done:** "I want to plan a week of meals using the recipes I already know and the ingredients I already own, then get a shopping list that only shows what I actually need to buy."

## Differentiator

The scan identified that recipe and meal-planning apps push subscriptions and web-clipping paywalls. PantryPlan closes this gap:

- **User-owned recipe database** — no scraped content, no paywalled recipes. Users enter their own (METHODOLOGY §3 originality: we don't reuse anyone's proprietary recipe content).
- **Pantry subtraction** — the app subtracts what's already in the pantry before generating the shopping list, directly addressing food waste and overspending (scan §7 pain signals).
- **No accounts, fully offline** — addresses "too complicated" and "privacy concerns" complaint patterns from METHODOLOGY §2.

## MVP feature list

1. **Pantry database** — add/remove ingredients with quantity and expiry date; mark items as "in stock."
2. **Recipe entry** — manual recipe creation with ingredient list and quantities. No scraping.
3. **Weekly meal planner** — assign recipes to weekdays; supports scaling servings.
4. **Smart shopping list** — auto-generated from the meal plan, minus pantry inventory.
5. **Shopping list organization** — group items by grocery store section (dairy, produce, etc.).
6. **Meal plan history** — save and reuse past weekly plans.

**Deliberately left out:**

- Recipe scraping or web import (would require external APIs, subscription risk, and violate §3 if content is proprietary).
- Barcode scanning for pantry entry (adds complexity; manual entry is fine for MVP).
- Nutrition tracking or calorie counting (out of scope; different job).
- Grocery delivery integration (requires third-party APIs and accounts).
- Social sharing or recipe communities.

## Platforms & needs

```
Platforms & needs: web [y] · iOS [y] · Android [n] · accounts/sync [n] · payments [n] · external APIs [none] · Track: Full
```

**Technical notes:**

- **Local-first storage:** SQLite (mobile) or IndexedDB (web). No backend server needed — all data lives on the user's device.
- **Sync:** Not included in MVP. A later cycle could add optional cloud backup, but it's not core to the value proposition.
- **Notifications:** Weekly meal-planning reminder and "expiring soon" alerts for pantry items. Uses local push notifications, no server.
- **Payments:** Free for MVP. Monetization via optional one-time unlock for advanced features (expiry tracking, recipe categories). No payment infrastructure needed initially.
- **APIs:** None required. Everything is local CRUD.
- **⚠️ Complexity risk:** The shopping list algorithm (recipe ingredients minus pantry, with unit normalization and section grouping) is the hardest part. It's doable but requires careful data modeling. This pushes the idea to Full track (Ease 3).

## Ease-of-development estimate

**Rubric score: 3** (1–2 months; third-party APIs not needed but the data model and shopping list algorithm add meaningful complexity).

**Estimated MVP time: 6 weeks.**

Reasoning: The pantry database and recipe entry are standard CRUD. The weekly planner is a scheduling UI. The hard part is the shopping list engine: merging ingredients across multiple recipes, normalizing units (cups vs ml, lbs vs grams), subtracting pantry quantities, and grouping by store section. This requires thoughtful data modeling and testing. Web-first MVP (easier to iterate) with optional mobile follow-up.

## Monetization idea

**Freemium with one-time unlock.** Free tier: meal planner + basic shopping list + up to 10 recipes. $4.99 one-time unlock: unlimited recipes, pantry expiry tracking, recipe categories/favorites, and meal plan templates (e.g., "low-carb week"). No subscription needed, which directly differentiates against competitors.

Alternative: free forever if the goal is user acquisition and brand building; offer a "recipe book" PDF export as a paid add-on.

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 3 | L | Meal planning is a popular category, but scan fetched no evidence; all demand signals are assumptions. |
| **Gap / Differentiation** | 3 | M | Pantry subtraction is a real differentiator, but several apps offer some form of it; not a unique mechanic. |
| **Ease of development** | 3 | M | More complex than a simple tracker — data model for pantry/recipes/shopping list is non-trivial. Full track. |
| **Monetization** | 4 | H | One-time unlock for recipe limit + advanced features is proven in recipe/meal-planning apps. |
| **Competition** | 3 | L | Recipe and meal-planning apps are established (Paprika, CopyMeThat), but mostly subscription-based and web-scrape-focused. Assumption. |
| **Retention** | 4 | M | Weekly meal planning is an ongoing, recurring task; users who adopt it return every week. |
| **Risk** | 5 | H | No regulated data, no personal-data sensitivity, no children's data. Pure utility. |

**Opportunity Score calculation:**

```
= (3×0.20 + 3×0.20 + 3×0.20 + 4×0.10 + 3×0.10 + 4×0.10 + 5×0.10) ÷ 5 × 100
= (0.60 + 0.60 + 0.60 + 0.40 + 0.30 + 0.40 + 0.50) ÷ 5 × 100
= 3.40 ÷ 5 × 100
= 68.0
```

**Opportunity Score: 68** (Promising — shortlist if room, otherwise Park).

## Risks and originality check

### Originality gate (§3)

**PASSES.** PantryPlan is an original product in the meal-planning category. No app's name, branding, or proprietary recipe content is being reused. All recipes are user-entered (no scraping). The differentiator — pantry subtraction with offline-only design — is clearly stated. No regulated content.

### Key risks

1. **Complexity vs. payoff (medium-high):** The shopping list algorithm is the hardest part of the MVP. If it doesn't work well (e.g., poor unit normalization, messy merged ingredients), the core value proposition collapses. Consider starting with a simpler version: just a raw ingredient list without subtraction, then iterate.
2. **User effort to populate pantry and recipes (medium):** Users must manually enter recipes and pantry items. If this feels like too much work, adoption will be low. The MVP should minimize friction: recipe templates, common pantry presets, and batch entry.
3. **Demand unverified (medium):** The scan has no fetched evidence. Recipe/meal-planning apps are established, but the exact pain of "no pantry subtraction" isn't verified.
4. **Platform choice (medium):** Web-first makes sense for iteration speed, but the target audience (home cooks) may prefer mobile. Consider a PWA approach to bridge both.
5. **Retention cliff (low-medium):** Weekly planning requires habit formation. Users who skip a week may lose their pantry state and disengage. Onboarding should emphasize quick setup.

---

## Calibration notes (rd-manager, cycle 2026-11-07)
- **Brief constraint failed:** the analyst scored Ease 3 (Full track), which is reasonable given unit normalization and merging. The cycle brief allows **Ease ≥ 4 only**, so this idea is **parked**, the same way `roommate-expense-splitter` was in cycle 1. It is not rejected.
- **Gap 3 M -> 2 L:** a pantry feature and one-time pricing are believed to already exist in established recipe managers (*assumption*, e.g. Paprika is sold as a one-time purchase). That contradicts the "mostly subscription-based" premise.
- **Competition 3 L -> 2 L:** same reason. It is an established category with long-lived incumbents.
- **Monetization 4 H -> 3 M:** H confidence needs evidence, and none was fetched. Kept consistent with the other one-time-unlock ideas this cycle.
- **Platforms & needs line flagged:** web [y] · iOS [y] · Android [n] goes against the brief's mobile-first preference. iOS without Android has no stated reason. If it is re-scored, either go web-only (PWA) or mobile on both platforms. Track: Full (Ease 3) is correct.
- To raise the score: scope a version without pantry subtraction (a plain merged list) that reaches Ease 4, plus evidence that pantry-aware lists are an unmet request.
- **Recomputed:** (3·.2 + 2·.2 + 3·.2 + 3·.1 + 2·.1 + 4·.1 + 5·.1) ÷ 5 × 100 = **60** (was 68).
