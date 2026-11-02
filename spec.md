# The Bakery Shop — Sales Dashboard Spec

A mobile-first sales dashboard for the owner and shift staff of **The Bakery Shop**. It answers three questions in under five seconds, one-handed, on a phone behind the counter:

1. **How much have we sold today?**
2. **What is selling (and what is running out)?**
3. **How does today compare with yesterday / last week?**

---

## 1. Design Principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **Mobile first** | Designed at 375 px wide. Tablet and desktop only add columns; nothing is hidden on mobile. |
| 2 | **Big touch targets** | Every tappable element is at least **56 × 56 px** (primary actions **64 px** tall). Spacing between targets is at least 12 px. |
| 3 | **Big, friendly icons** | Icons are **32 px** inline and **48–64 px** on feature tiles, always paired with a text label. Never icon-only. |
| 4 | **Brand-led** | The logo and its warm palette drive the whole UI; accents use the palette's complement (teal) so data stands out. |
| 5 | **Glanceable** | One hero number, a short list of tiles, then detail. No tables wider than the screen. |

---

## 2. Brand Assets

### 2.1 Logo

- Files: `assets/logo.png` (raster, transparent-friendly background) and `assets/logo.avif` (original).
- The logo is a circular badge: espresso + caramel ring, croissant illustration, "The Bakery Shop" script wordmark, "Fresh & Delicious" and "Est. 2022" arcs.
- **Placement**
  - Header: logo at **56 px height**, left-aligned, on the cream background. Do not place it on a dark or orange fill (the brown lettering loses contrast).
  - Loading / splash screen: logo centered at **160 px**, on cream.
  - Favicon / app icon: crop to the circular badge; keep ≥ 10 % clear space around it.
- **Don'ts**: don't recolor, stretch, rotate, add shadows, or shrink below 40 px height.

### 2.2 Colour Palette

Sampled from the logo, plus a **complementary teal** (the logo is warm brown/orange at hue ≈ 25–30°; its complement sits at ≈ 205°).

| Role | Token | Hex | Source / use |
|------|-------|-----|--------------|
| Espresso | `--brown-900` | `#3B2412` | Body text, headings (darker shade of logo's outline brown) |
| Dark chocolate | `--brown-800` | `#5A3619` | Logo ring/wordmark — top bar, selected states |
| Caramel | `--brown-600` | `#7C5633` | Logo wordmark — **primary button fill**, links |
| Croissant | `--orange-500` | `#BA713C` | Logo croissant — chart fills, highlights, large text only |
| Golden crust | `--gold-400` | `#E8B66B` | Croissant highlight — "today" markers, badges |
| Crumb | `--tan-200` | `#DAC6B1` | Borders, dividers, inactive chips |
| Cream (page) | `--cream-50` | `#FBF5EC` | **Page background** |
| White (cards) | `--white` | `#FFFFFF` | Card surfaces |
| **Teal (complement)** | `--teal-600` | `#2A6F7D` | Secondary buttons, comparison/"last week" series, info |
| Sage (positive) | `--green-600` | `#3F7D3A` | Growth, "in stock" |
| Brick (negative) | `--red-600` | `#B3402A` | Decline, "low stock", errors |

**Contrast (WCAG 2.1)** — verified ratios:

| Pair | Ratio | Use |
|------|-------|-----|
| Espresso on Cream | 13.4 : 1 | Body text |
| Dark chocolate on Cream | 9.8 : 1 | Headings |
| White on Caramel | 6.5 : 1 | Primary button label |
| White on Dark chocolate | 10.6 : 1 | Top bar, selected tab |
| White on Teal | 5.7 : 1 | Secondary button label |
| White on Sage / Brick | 5.0 / 5.7 : 1 | Status badges |
| Espresso on Golden crust | 7.8 : 1 | Badges |
| White on Croissant | 3.8 : 1 | ⚠ Large/bold text (≥ 18.66 px bold) only; otherwise use Espresso text on Croissant |

Colour is never the only signal: growth/decline always shows an arrow and a +/− sign; stock status always shows a word.

### 2.3 Typography

- Headings & hero numbers: a rounded or script-flavoured display face to echo the logo wordmark, e.g. **"Pacifico"** or **"Playfair Display"** (hero number only, sparingly); fall back to system serif.
- Body & UI: system sans (`-apple-system, Roboto, "Segoe UI"`), so numbers align and render fast.
- Sizes (mobile): hero number **48 px**, section title **22 px**, card value **28 px**, body **18 px**, caption **14 px** (minimum). Use tabular numerals for all currency/quantities.

### 2.4 Shape & Elevation

- Card radius **20 px**, button radius **16 px**, chip radius **999 px**.
- Cards: white, 1 px `--tan-200` border, soft shadow `0 2px 8px rgba(59,36,18,.08)`.
- Page padding **16 px** on mobile, **24 px** tablet, **32 px** desktop.

---

## 3. Layout (Mobile, 375 px)

```
┌─────────────────────────────────────┐
│ [LOGO 56px]        Mon, 2 Nov  [🔔] │  ← Header (sticky), cream
├─────────────────────────────────────┤
│ [ Today ][ Week ][ Month ][ Custom ]│  ← Period chips (56px tall)
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ TODAY'S SALES                 │  │  ← Hero card (dark chocolate
│  │ $ 2,846.50          ▲ 12.4 %  │  │     bg, white text, gold number)
│  │ vs yesterday $2,532           │  │
│  │ ▁▂▃▅▆▇▆▅▇█  (hourly sparkline)│  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌────────────┐  ┌────────────┐     │
│  │ 🧾 Orders  │  │ 🛒 Avg     │     │  ← KPI tiles, 2-up grid
│  │    214     │  │   $13.30   │     │
│  │  ▲ 8 %     │  │  ▲ 4 %     │     │
│  └────────────┘  └────────────┘     │
│  ┌────────────┐  ┌────────────┐     │
│  │ 🥐 Items   │  │ ⏰ Peak    │     │
│  │    612     │  │ 8–9 AM     │     │
│  └────────────┘  └────────────┘     │
│                                     │
│  Sales by hour                      │  ← Bar chart, full width
│  ▂▃▇█▆▄▃▃▄▅▃▂   today ■  last wk ■  │
│                                     │
│  Best sellers                       │
│  ┌───────────────────────────────┐  │
│  │ 1 🥐 Butter Croissant  96 ▲   │  │  ← Row height 72px, whole row
│  │ 2 🍞 Sourdough Loaf    71     │  │     is tappable
│  │ 3 🥖 Baguette          64 ▼   │  │
│  │ [ See all products  → ]       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Sales by category                  │
│  (donut: Bread / Pastry / Cake /    │
│   Drinks, with big legend rows)     │
│                                     │
│  ⚠ Running low (3)                  │
│  🥐 Almond Croissant · 4 left       │
│                                     │
├─────────────────────────────────────┤
│ [🏠 Home][🧾 Orders][📦 Stock][⚙ More]│  ← Bottom nav, 72px tall
└─────────────────────────────────────┘
```

### Responsive behaviour

| Breakpoint | Layout |
|-----------|--------|
| **< 600 px** (phone) | Single column. KPI tiles 2-up. Bottom navigation bar. |
| **600–1023 px** (tablet) | Hero card spans full width; KPI tiles 4-up; best sellers + category donut side-by-side. Bottom nav stays. |
| **≥ 1024 px** (desktop) | Left side-rail navigation replaces bottom bar; 12-column grid, max content width 1200 px. |

No horizontal scrolling at any width. Charts resize to the container; long product names truncate with an ellipsis after one line.

---

## 4. Components

### 4.1 Header
- Cream background, logo 56 px (left), date (centre/right), notification button **56 × 56 px** (right).
- Sticky; 1 px `--tan-200` bottom border appears on scroll.

### 4.2 Period Selector (chips)
- Options: **Today · Week · Month · Custom**.
- Chip height **56 px**, min-width 88 px, horizontal gaps 12 px; label 18 px semibold.
- Selected: Caramel fill, white text. Unselected: white fill, Caramel text, `--tan-200` border.
- "Custom" opens a full-screen date range picker with 56 px day cells.

### 4.3 Hero Card — Total Sales
- Dark chocolate (`#5A3619`) background; label in Crumb, amount in Golden crust at 48 px bold, delta pill below.
- Delta pill: ▲ green / ▼ red text on white pill, with the comparison period spelled out ("vs yesterday").
- Hourly sparkline underneath in Croissant, with the current hour marked by a gold dot.
- Tap → opens Sales detail (hour-by-hour list).

### 4.4 KPI Tile
- White card, min height **120 px**, icon **48 px** in a Crumb-tinted circle (64 px), label 16 px, value 28 px bold, delta 14 px.
- Whole tile is the tap target (min 56 px in both dimensions).
- KPIs: **Orders**, **Avg. order value**, **Items sold**, **Peak hour**. Optional extras: **Refunds**, **Tips**.

### 4.5 Sales Chart (hour/day)
- Bar chart, today in Croissant, comparison period in Teal (so the two series differ by hue, not just lightness).
- Tap a bar → tooltip card (not hover) with exact value; bar hit-area at least 24 px wide, extended invisibly to 44 px.
- Y-axis labels 14 px; max 4 gridlines in `--tan-200`.
- Toggle "Compare to: Yesterday / Last week / Last month" — a 56 px segmented control.

### 4.6 Best Sellers List
- Rank, 48 px product icon/photo, name (18 px), units sold, small trend arrow, revenue right-aligned.
- Row height **72 px**, whole row tappable → product detail.
- Show top 5; **"See all products"** is a full-width 64 px secondary (teal) button.

### 4.7 Category Breakdown
- Donut chart (≥ 200 px) with total in the centre; categories use palette order: Croissant, Caramel, Golden crust, Teal, Sage.
- Legend rows are 56 px tall and double as filters (tap to isolate a category).

### 4.8 Low-Stock Alerts
- Card with Brick left border, ⚠ icon 32 px, and a **word** ("Low", "Out") on each badge.
- Item rows have a 56 px **Restock** button.

### 4.9 Bottom Navigation
- 4 destinations: **Home, Orders, Stock, More**. Height **72 px** plus safe-area inset.
- Icon 32 px above 14 px label; selected item uses Caramel icon/label with a Golden crust pill behind it. Each item's tap area is at least 25 % of the screen width.

### 4.10 Buttons

| Type | Height | Fill | Label | Use |
|------|--------|------|-------|-----|
| Primary | **64 px** | Caramel `#7C5633` | White, 18 px bold | Main action (e.g. "New sale", "Export") |
| Secondary | **56 px** | Teal `#2A6F7D` | White | Secondary actions |
| Tertiary / ghost | **56 px** | Transparent, Caramel border | Caramel | Cancel, filters |
| Danger | **56 px** | Brick `#B3402A` | White | Refund, delete |

- Full-width on mobile; minimum width 120 px elsewhere.
- Focus ring: 3 px Teal outline with 2 px offset. Pressed state darkens fill one step and scales to 0.98.

---

## 5. Data & Metrics

| Metric | Definition |
|--------|------------|
| Total sales | Sum of paid order totals (after discounts, before tips) in the selected period |
| Orders | Count of completed orders |
| Avg. order value | Total sales ÷ orders |
| Items sold | Sum of line-item quantities |
| Peak hour | Hour of day with highest sales in the period |
| Delta % | `(current − previous) ÷ previous`, previous period matches the selected comparison |
| Best sellers | Products ranked by units sold (tie-break: revenue) |
| Low stock | Products where `on_hand ≤ par_level × 0.25` |

### Sample payload (for the mock UI)

```json
{
  "period": "today",
  "currency": "USD",
  "total_sales": 2846.50,
  "previous_total_sales": 2532.40,
  "orders": 214,
  "items_sold": 612,
  "avg_order_value": 13.30,
  "peak_hour": "08:00",
  "hourly": [
    { "hour": 6,  "sales": 120.0, "compare": 98.0  },
    { "hour": 7,  "sales": 410.5, "compare": 360.0 },
    { "hour": 8,  "sales": 585.0, "compare": 512.0 },
    { "hour": 9,  "sales": 402.0, "compare": 420.0 }
  ],
  "best_sellers": [
    { "name": "Butter Croissant", "category": "Pastry", "units": 96, "revenue": 336.00, "trend": "up" },
    { "name": "Sourdough Loaf",   "category": "Bread",  "units": 71, "revenue": 355.00, "trend": "flat" },
    { "name": "Baguette",         "category": "Bread",  "units": 64, "revenue": 192.00, "trend": "down" }
  ],
  "categories": [
    { "name": "Bread",  "share": 0.34 },
    { "name": "Pastry", "share": 0.31 },
    { "name": "Cake",   "share": 0.18 },
    { "name": "Drinks", "share": 0.17 }
  ],
  "low_stock": [
    { "name": "Almond Croissant", "on_hand": 4, "par": 24 }
  ]
}
```

---

## 6. Interaction & States

- **Loading**: skeleton cards in `--tan-200`; logo splash on first open only.
- **Pull-to-refresh** on mobile; "Updated 2 min ago" caption under the hero card.
- **Empty** (no sales yet): friendly croissant illustration, "No sales yet today — the first sale is on its way!" with a primary **New sale** button.
- **Error / offline**: Brick banner at the top with a 56 px **Retry** button; last cached numbers remain visible and are marked "stale".
- **Gestures**: swipe left/right on the period area to move between Today/Week/Month. Every gesture also has a visible button.
- **Motion**: numbers count up in ≤ 600 ms; respect `prefers-reduced-motion`.

---

## 7. Accessibility

- All text ≥ 4.5 : 1 contrast (large text ≥ 3 : 1) as tabulated in §2.2.
- Touch targets ≥ 56 × 56 px (exceeds WCAG 2.5.5's 44 px).
- Every icon has an adjacent text label and an accessible name; charts expose a text summary ("Sales peaked at 8–9 AM at $585") and a data-table toggle.
- Dynamic type: layout holds up to 200 % text scale without overlap.
- Full keyboard navigation and visible focus ring on desktop.
- Support light mode only in v1 (brand cream background); dark mode is out of scope.

---

## 8. Technical Notes

- Single-page, responsive web app (HTML/CSS/JS or React); installable as a PWA with the logo as the app icon.
- Use CSS custom properties for every colour token in §2.2.
- Charts: lightweight SVG (e.g. Chart.js or Recharts); no chart may exceed container width.
- Performance budget: first meaningful paint < 2 s on 4G; logo served as `logo.avif` with `logo.png` fallback; icons as an inline SVG sprite.
- Numbers formatted with `Intl.NumberFormat` for the shop's locale and currency.

---

## 9. Acceptance Criteria

- [ ] Renders without horizontal scroll from 320 px to 1440 px wide.
- [ ] The logo appears in the header on a cream background at ≥ 56 px height, unaltered.
- [ ] Only palette colours from §2.2 are used; teal is the only non-warm accent.
- [ ] Every button, chip, tile, list row and nav item is at least 56 × 56 px; primary buttons 64 px tall.
- [ ] Every icon is ≥ 32 px and has a visible text label.
- [ ] Hero total, orders, average order value, items sold, hourly chart, best sellers, category split and low-stock alerts all display from the sample payload.
- [ ] Period chips switch the data and comparison labels without a page reload.
- [ ] Meets WCAG 2.1 AA contrast for all text.
