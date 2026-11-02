# The Bakery Shop — Sales Dashboard Spec

A mobile-first sales dashboard for the owner and shift staff of **The Bakery Shop**. It answers three questions in under five seconds, one-handed, on a phone behind the counter:

1. **How much have we sold today?**
2. **What is selling (and what is running out)?**
3. **How does today compare with yesterday / last week?**

> Spec version **1.1** — see [Revision history](#10-revision-history). This file must stay in sync with the dashboard (see `practice.md`).

---

## 1. Design Principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **Mobile first** | Designed at 375 px wide. Tablet and desktop only add columns; nothing is hidden on mobile. |
| 2 | **Big touch targets** | Chips, buttons, tabs and nav items are **64–84 px** tall (primary actions **80 px**); nothing tappable is smaller than **56 px**. Spacing between targets is at least 12 px. |
| 3 | **Big, friendly icons** | Icons are **32–40 px** inline and **40–64 px** on tiles, always paired with a text label. Never icon-only. |
| 4 | **Brand-led, green-forward** | The logo's warm browns appear in the logo, text and product colours; **green is the main interface colour** (buttons, selected states, hero card, headings). |
| 5 | **Glanceable** | One hero number, a short list of tiles, then detail. No tables wider than the screen. |

---

## 2. Brand Assets

### 2.1 Logo

- Files: `assets/logo.png` (raster, white backdrop) and `assets/logo.avif` (original).
- The logo is a circular badge: espresso + caramel ring, croissant illustration, "The Bakery Shop" script wordmark, "Fresh & Delicious" and "Est. 2022" arcs.
- **Placement**
  - Header: logo at **96 px height**, left-aligned, on the cream background. At this size the "Fresh & Delicious" and "Est. 2022" arcs stay legible. Because the file has a white backdrop, it is blended into the cream page (CSS `mix-blend-mode: multiply`). Do not place it on a dark or green fill (the brown lettering loses contrast).
  - Loading / splash screen: logo centered at **160 px**, on cream.
  - Favicon / app icon: crop to the circular badge; keep ≥ 10 % clear space around it.
- **Don'ts**: don't recolor, stretch, rotate, add shadows, or shrink below **72 px** height.

### 2.2 Colour Palette

Browns and orange are sampled from the logo. **Green** is the main interface accent (it sits roughly opposite the logo's orange hue and reads as "fresh"). Green and brown together carry the bakery feel.

| Role | Token | Hex | Source / use |
|------|-------|-----|--------------|
| Espresso | `--brown-900` | `#3B2412` | Body text, chart text |
| Dark chocolate | `--brown-800` | `#5A3619` | Logo ring/wordmark (reference; secondary text) |
| Caramel | `--brown-600` | `#7C5633` | Logo wordmark; secondary text, shares |
| Croissant | `--orange-500` | `#BA713C` | Logo croissant — "Bread" category, rank numbers |
| Golden crust | `--gold-400` | `#E8B66B` | **Hero amount and sparkline** on the green card |
| Crumb | `--tan-200` | `#DAC6B1` | Borders, dividers |
| Cream (page) | `--cream-50` | `#FBF5EC` | **Page background** |
| White (cards) | `--white` | `#FFFFFF` | Card surfaces |
| **Deep green** | `--green-800` | `#2D5A2A` | **Hero card**, headings, primary button, toasts, nav labels |
| **Green** | `--green-600` | `#3F7D3A` | **Chips, segmented control, secondary buttons, nav active pill**, "Today" series, growth (▲) |
| Green tint | `--green-100` / `--green-50` / `--green-tint` | `#E4F0DE` / `#F1F7EE` / `#D2E6CA` | Icon circles, selected rows, text on the green card |
| Brick (negative) | `--red-600` | `#B3402A` | Decline (▼), "Low/Out" stock, notification badge |

**Chart-only colours** (validated for colour-blind separation with the palette checker):

| Use | Hex |
|-----|-----|
| Series "Today" / "Cake" | `#3F7D3A` (green) |
| Series "Compare" / "Pastry" | `#7E5C99` (plum) |
| "Bread" | `#BA713C` (orange) |
| "Drinks" | `#1F7FB5` (blue) |

> **Why plum, not orange, next to green:** orange and green are indistinguishable for many red-green colour-blind viewers (ΔE ≈ 1–3, failing the check). Orange is therefore only used where it never touches green (the donut order is Bread → Pastry → Cake → Drinks), and the two-series chart uses green + plum.

**Contrast (WCAG 2.1)** — measured ratios:

| Pair | Ratio | Use |
|------|-------|-----|
| Espresso on Cream | 13.4 : 1 | Body text |
| Espresso on White | 14.5 : 1 | Card text |
| Deep green on White | 8.1 : 1 | Headings, outlined button labels |
| Deep green on Cream | 7.4 : 1 | Headings on the page |
| Deep green on Green tint | 6.8 : 1 | Icon circles, selected rows |
| White on Deep green | 8.1 : 1 | Primary button, toast |
| White on Green | 5.0 : 1 | Selected chip, secondary button, nav pill |
| Green tint on Deep green | 6.1 : 1 | Labels on the hero card |
| Golden crust on Deep green | 4.3 : 1 | ⚠ Large/bold text only (the 48 px hero amount) |

Colour is never the only signal: growth/decline always shows an arrow and a +/− sign; stock status always shows a word.

### 2.3 Typography

- Whole UI: system rounded sans (`ui-rounded, "SF Pro Rounded", system-ui, …`) — friendly, loads instantly, tabular numerals for all currency/quantities.
- Sizes (mobile): hero number **48 px**, section title **24 px**, card value **28 px**, buttons/chips **20 px**, body **18 px**, caption **14 px** (minimum).

### 2.4 Shape & Elevation

- Card radius **20 px**, button radius **18 px**, chip radius **999 px**.
- Cards: white, 1 px `--tan-200` border, soft shadow `0 2px 8px rgba(59,36,18,.08)`.
- Page padding **16 px** on mobile, **24 px** tablet, **32 px** desktop.

---

## 3. Layout (Mobile, 375 px)

```
┌─────────────────────────────────────┐
│ [ LOGO 96px ]    Mon, 2 Nov  [ 🔔 ] │  ← Header (sticky), cream
├─────────────────────────────────────┤
│ [  Today  ][  Week  ][  Month  ]    │  ← Period chips (68px tall, green)
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ TODAY'S SALES                 │  │  ← Hero card (deep green bg,
│  │ $ 2,846.50          ▲ 12.4 %  │  │     golden amount, white pill)
│  │ vs yesterday $2,532.00        │  │
│  │ ▁▂▃▅▆▇▆▅▇█  (sparkline)       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌────────────┐  ┌────────────┐     │
│  │ (🧾) Orders│  │ (🛒) Avg   │     │  ← KPI tiles, 2-up grid,
│  │    214     │  │   $13.30   │     │     icons in green-tint circles
│  │  ▲ 9.2 %   │  │  ▲ 3.0 %   │     │
│  └────────────┘  └────────────┘     │
│  ┌────────────┐  ┌────────────┐     │
│  │ (🥐) Items │  │ (⏰) Peak  │     │
│  │    612     │  │ 8–9 AM     │     │
│  └────────────┘  └────────────┘     │
│                                     │
│  Sales by hour                      │
│  [ Yesterday ][ Last week ]         │  ← Compare toggle (64px)
│  ■ Today  ■ Yesterday               │
│  ▂▃▇█▆▄▃▃▄▅▃▂   (bar chart)         │
│  [ Show as table ]                  │
│                                     │
│  Best sellers                       │
│  ┌───────────────────────────────┐  │
│  │ 1 🥐 Butter Croissant  96 ▲   │  │  ← Row height 80px, whole row
│  │ 2 🍞 Sourdough Loaf    71     │  │     is tappable
│  │ 3 🥖 Baguette          64 ▼   │  │
│  │ [ See all products  → ]       │  │  ← 72px green button
│  └───────────────────────────────┘  │
│                                     │
│  Sales by category (donut + rows)   │
│                                     │
│  ⚠ Running low (3)                  │
│  🥐 Almond Croissant · 4 left       │
│  [ Restock ]                        │
├─────────────────────────────────────┤
│ [🏠 Home][🧾 Orders][📦 Stock][⋯ More]│  ← Bottom nav, 84px tall
└─────────────────────────────────────┘
```

### Responsive behaviour

| Breakpoint | Layout |
|-----------|--------|
| **< 600 px** (phone) | Single column. KPI tiles 2-up. Bottom navigation bar. |
| **600–1023 px** (tablet) | Hero card spans full width; KPI tiles 4-up; best sellers + category donut side-by-side. Bottom nav stays. |
| **≥ 1024 px** (desktop) | Left side-rail navigation (112 px) replaces the bottom bar; hero card and 2×2 KPI tiles sit side-by-side; max content width 1200 px. |

No horizontal scrolling at any width. Charts resize to the container; long product names wrap onto a second line.

---

## 4. Components

### 4.1 Header
- Cream background, logo **96 px** (left), date in deep green, notification button **64 × 64 px** (right) with a green outline and a red count badge.
- Sticky; a 1 px `--tan-200` bottom border appears on scroll.

### 4.2 Period Selector (chips)
- Options: **Today · Week · Month** (a Custom date range is planned, not built).
- Chip height **68 px**, equal widths, gaps 12 px; label 20 px extra-bold; max row width 520 px on large screens.
- Selected: green fill, white text. Unselected: white fill, green outline, deep-green text.

### 4.3 Hero Card — Total Sales
- **Deep green** (`#2D5A2A`) background; label in green tint, amount in Golden crust at 48 px bold, delta pill below.
- Delta pill: ▲ green / ▼ red text on a white pill, with the comparison period spelled out ("vs yesterday").
- Sparkline underneath in Golden crust with a dot on the highest point.
- Footer caption states that the data is sample data and when it was updated.

### 4.4 KPI Tile
- White card, min height **120 px**, icon **40 px** in a **64 px** green-tint circle, label 16 px, value 28 px bold, delta 14 px.
- KPIs: **Orders**, **Avg. order**, **Items sold**, **Peak hour** (Today) / **Best day** (Week, Month).

### 4.5 Sales Chart (hour/day)
- Bar chart, **"Today" series in green**, comparison series in **plum** (differ by hue and lightness; orange is avoided next to green for colour-blind safety). For 30-day data the comparison is drawn as a line over the bars.
- Tap or hover a bar → tooltip card with exact values and % change; arrow keys move between bars. Hit area is the full column.
- Y-axis labels and X-axis labels 14 px; 4 gridlines in `--tan-200`; the peak bar carries a value label.
- Compare toggle: a **64 px** segmented control. Options: Today → *Yesterday / Last week*; Week → *Previous week / 4 weeks ago*; Month → *Previous 30 days / Last year*.
- "Show as table" (72 px outlined button) swaps the chart for an accessible table.

### 4.6 Best Sellers List
- Rank, **60 px** product icon, name (18 px, wraps), category + revenue, units sold, trend arrow with %.
- Row height **80 px**, whole row tappable (product detail is planned).
- Top 5 shown; **"See all products"** is a full-width **72 px** green secondary button.

### 4.7 Category Breakdown
- Donut chart (≈ 240 px) with the total in the centre. Fixed colours: Bread = orange, Pastry = plum, Cake = green, Drinks = blue.
- Legend rows are **64 px** tall, show amount and share, and double as filters (tap to isolate a category; the centre shows that category's amount).

### 4.8 Low-Stock Alerts
- Card with a brick-red left border, ⚠ icon, and a **word** ("Low", "Out") on each badge.
- Each item has a **68 px** green **Restock** button (not connected yet).

### 4.9 Bottom Navigation
- 4 destinations: **Home, Orders, Stock, More**. Height **84 px** plus safe-area inset.
- Icon 36 px above a 15 px bold deep-green label. The selected item shows its icon on a **green pill** with a white glyph.
- On desktop (≥ 1024 px) the same items form a side rail.

### 4.10 Buttons

| Type | Height | Fill | Label | Use |
|------|--------|------|-------|-----|
| Primary | **80 px** | Deep green `#2D5A2A` | White, 20 px extra-bold | Main action (e.g. "New sale", "Export") |
| Secondary | **72 px** | Green `#3F7D3A` | White | "See all products", "Restock" (68 px inline) |
| Ghost | **72 px** | Transparent, green outline | Deep green | "Show as table" |
| Chip / segmented | **68 / 64 px** | Green when selected | White / deep green | Period and compare selectors |
| Danger (planned) | **72 px** | Brick `#B3402A` | White | Refund, delete |

- Full-width on mobile; minimum width 140 px for inline buttons.
- Focus ring: 3 px espresso outline with 3 px offset. Pressed state darkens the fill and scales to 0.98.

---

## 5. Data & Metrics

| Metric | Definition |
|--------|------------|
| Total sales | Sum of paid order totals (after discounts, before tips) in the selected period |
| Orders | Count of completed orders |
| Avg. order value | Total sales ÷ orders |
| Items sold | Sum of line-item quantities |
| Peak hour / best day | Hour (Today) or day (Week, Month) with the highest sales in the period |
| Delta % | `(current − previous) ÷ previous`, previous period matches the selected comparison |
| Best sellers | Products ranked by units sold (tie-break: revenue) |
| Low stock | Products where `on_hand ≤ par_level × 0.25` |

Periods: **Today** (hours 6 AM–6 PM), **Week** (last 7 days), **Month** (last 30 days).

### Sample payload (for the mock UI)

```json
{
  "period": "today",
  "currency": "USD",
  "total_sales": 2846.50,
  "previous_total_sales": 2532.00,
  "orders": 214,
  "items_sold": 612,
  "avg_order_value": 13.30,
  "peak_hour": "8–9 AM",
  "hourly": [
    { "hour": 6,  "sales": 110.0, "compare": 98.0  },
    { "hour": 7,  "sales": 390.5, "compare": 360.0 },
    { "hour": 8,  "sales": 585.0, "compare": 490.0 },
    { "hour": 9,  "sales": 402.0, "compare": 350.0 }
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

- **Not built yet** (shows a "Coming in the next version" message): Orders and More tabs, product detail, "See all products", Restock, custom date range.
- **Loading**: skeleton cards in `--tan-200`; logo splash on first open only *(planned)*.
- **Pull-to-refresh** on mobile; "updated at" caption under the hero card *(caption built, refresh planned)*.
- **Empty** (no sales yet): friendly croissant illustration, "No sales yet today — the first sale is on its way!" with a primary **New sale** button *(planned)*.
- **Error / offline**: Brick banner at the top with a **Retry** button; last cached numbers remain visible and are marked "stale" *(planned)*.
- **Motion**: the hero number counts up in ≤ 600 ms; respects `prefers-reduced-motion`.

---

## 7. Accessibility

- All text ≥ 4.5 : 1 contrast (large text ≥ 3 : 1) as tabulated in §2.2.
- Touch targets: main controls 64–84 px, nothing under 56 px (exceeds WCAG 2.5.5's 44 px).
- Every icon has an adjacent text label and an accessible name; charts expose a text summary ("Highest sales: 8–9 AM, $585") and a table toggle.
- Chart colours are checked for colour-blind separation; values are also shown via tooltips, labels and the table, so colour is never the only signal.
- Layout holds up to 200 % text scale without overlap.
- Full keyboard navigation and a visible focus ring on desktop; arrow keys move between chart bars.
- Light mode only in v1 (brand cream background); dark mode is out of scope.

---

## 8. Technical Notes

- Static, responsive web app: `index.html`, `style.css`, `app.js` (plain HTML/CSS/JS, no build step), hosted on GitHub Pages from `main`.
- CSS custom properties for every colour token in §2.2.
- Charts are hand-built SVG; no chart may exceed container width.
- All numbers are generated sample data in `app.js`; connecting real sales data is a later step.
- Performance budget: first meaningful paint < 2 s on 4G; icons as an inline SVG sprite.
- Numbers formatted with `Intl` / `toLocaleString` (US dollars for now).

---

## 9. Acceptance Criteria

- [ ] Renders without horizontal scroll from 320 px to 1440 px wide.
- [ ] The logo appears in the header on a cream background at 96 px height, unaltered.
- [ ] Green is the dominant interface colour (chips, buttons, hero card, headings); browns come from the logo and text.
- [ ] Every button, chip, tile, list row and nav item is at least 56 px in both directions; chips ≥ 68 px, buttons ≥ 72 px, nav ≥ 84 px.
- [ ] Every icon is ≥ 32 px and has a visible text label.
- [ ] Hero total, orders, average order value, items sold, hourly chart, best sellers, category split and low-stock alerts all display from the sample data.
- [ ] Period chips switch the data and comparison labels without a page reload.
- [ ] Meets WCAG 2.1 AA contrast for all text (large-text exception noted in §2.2).
- [ ] Chart palette passes the colour-blind separation check.

---

## 10. Revision history

| Version | Change |
|---------|--------|
| 1.0 | First spec: brown/orange logo palette with a complementary teal; 56 px targets; 56 px logo. |
| 1.1 | Logo enlarged to 96 px; buttons enlarged (chips 68, segmented 64, buttons 72, primary 80, nav 84); green replaces teal as the main accent (hero card, chips, buttons, nav); chart series changed to green + plum (orange/green fail colour-blind check); desktop side rail added; sample-data and "not built yet" notes added. |
