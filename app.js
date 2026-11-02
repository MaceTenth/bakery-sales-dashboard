'use strict';

/* The Bakery Shop — sales dashboard, v1.
   All numbers are generated sample data (see buildData); no backend yet. */

const $ = (sel, root = document) => root.querySelector(sel);
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const money0 = n => '$' + Math.round(n).toLocaleString('en-US');
const sum = a => a.reduce((s, v) => s + v, 0);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = { today: '#BA713C', compare: '#0F8BA6', gold: '#A8851E', plum: '#7E5C99' };
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ---------------- Sample data ---------------- */

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const scaled = (arr, factor, seed, noise = 0.06) => {
  const r = rng(seed);
  return arr.map(v => +(v * factor * (1 + (r() - 0.5) * 2 * noise)).toFixed(2));
};
const hourLabel = h => (h === 12 ? '12p' : h < 12 ? h + 'a' : (h - 12) + 'p');
const hourRange = h => {
  const n = x => ((x + 11) % 12) + 1, ap = x => (x < 12 || x === 24 ? 'AM' : 'PM');
  return ap(h) === ap(h + 1) ? `${n(h)}–${n(h + 1)} ${ap(h)}` : `${n(h)} ${ap(h)}–${n(h + 1)} ${ap(h + 1)}`;
};

function buildData() {
  const now = new Date();

  // Today by hour, 6am–6pm. Totals add up to $2,846.50 vs $2,532 yesterday (+12.4 %).
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const todayH = [110, 390.5, 585, 402, 210, 160, 240, 290, 170, 130, 90, 45, 24];
  const yestH = [98, 360, 490, 350, 190, 150, 215, 252, 160, 120, 85, 40, 22];

  // Last 7 days; the last value is today.
  const weekCur = [2412, 2260, 2655, 2745, 3390, 3820, 2846.5];
  const weekDates = weekCur.map((_, i) => { const d = new Date(now); d.setDate(d.getDate() - (6 - i)); return d; });

  // Last 30 days: weekday pattern (busier Fri–Sun), last value is today.
  const pat = { 0: 1.25, 1: 0.9, 2: 0.85, 3: 0.9, 4: 0.95, 5: 1.1, 6: 1.4 };
  const r = rng(7);
  const monthDates = Array.from({ length: 30 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - (29 - i)); return d; });
  const monthCur = monthDates.map((d, i) => i === 29 ? 2846.5 : +(2250 * pat[d.getDay()] * (1 + (r() - 0.5) * 0.18)).toFixed(2));

  const dayName = d => DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()];

  return {
    today: {
      hero: "Today's sales", unit: 'hour', chartTitle: 'Sales by hour', avg: 13.3, peakLabel: 'Peak hour',
      labels: hours.map(hourLabel), tips: hours.map(hourRange), cur: todayH,
      cmps: [
        { name: 'Yesterday', short: 'yesterday', data: yestH, avgF: 0.97 },
        { name: 'Last week', short: 'last Monday', data: scaled(todayH, 0.96, 11), avgF: 0.99 }
      ],
      peak: i => hourRange(hours[i])
    },
    week: {
      hero: 'Last 7 days', unit: 'day', chartTitle: 'Sales by day', avg: 13.05, peakLabel: 'Best day',
      labels: weekDates.map(d => DOW[d.getDay()]), tips: weekDates.map(dayName), cur: weekCur,
      cmps: [
        { name: 'Previous week', short: 'the previous 7 days', data: scaled(weekCur, 0.94, 21), avgF: 0.98 },
        { name: '4 weeks ago', short: '4 weeks ago', data: scaled(weekCur, 0.88, 22), avgF: 0.96 }
      ],
      peak: i => DOW[weekDates[i].getDay()]
    },
    month: {
      hero: 'Last 30 days', unit: 'day', chartTitle: 'Sales by day', avg: 12.9, peakLabel: 'Best day',
      labels: monthDates.map(d => String(d.getDate())), tips: monthDates.map(dayName), cur: monthCur,
      cmps: [
        { name: 'Previous 30 days', short: 'the previous 30 days', data: scaled(monthCur, 0.96, 31), avgF: 0.98 },
        { name: 'Last year', short: 'the same days last year', data: scaled(monthCur, 0.82, 32), avgF: 0.93 }
      ],
      peak: i => dayName(monthDates[i])
    }
  };
}

const PRODUCTS = [
  { name: 'Butter Croissant', cat: 'Pastry', icon: '🥐', units: 96, price: 3.5, trend: 9 },
  { name: 'Sourdough Loaf', cat: 'Bread', icon: '🍞', units: 71, price: 5.0, trend: 0 },
  { name: 'Baguette', cat: 'Bread', icon: '🥖', units: 64, price: 3.0, trend: -6 },
  { name: 'Cinnamon Roll', cat: 'Pastry', icon: '🥯', units: 52, price: 4.0, trend: 4 },
  { name: 'Blueberry Muffin', cat: 'Pastry', icon: '🧁', units: 47, price: 3.75, trend: -3 },
  { name: 'Chocolate Cake Slice', cat: 'Cake', icon: '🍰', units: 33, price: 5.5, trend: 12 },
  { name: 'Flat White', cat: 'Drinks', icon: '☕', units: 31, price: 4.2, trend: 2 }
];
const CATEGORIES = [
  { name: 'Bread', share: 0.34, color: COLORS.today },
  { name: 'Pastry', share: 0.31, color: COLORS.compare },
  { name: 'Cake', share: 0.18, color: COLORS.gold },
  { name: 'Drinks', share: 0.17, color: COLORS.plum }
];
const LOW_STOCK = [
  { name: 'Almond Croissant', icon: '🥐', left: 4, par: 24 },
  { name: 'Rye Loaf', icon: '🍞', left: 0, par: 12 },
  { name: 'Cheese Danish', icon: '🥮', left: 5, par: 20 }
];

const DATA = buildData();
const TODAY_TOTAL = sum(DATA.today.cur);
const state = { period: 'today', cmp: 0, cat: null, hover: -1, table: false };

const P = () => DATA[state.period];
const C = () => P().cmps[state.cmp];

/* ---------------- Helpers ---------------- */

const pct = (cur, prev) => prev ? ((cur - prev) / prev) * 100 : 0;
const dir = v => (Math.abs(v) < 0.05 ? 'flat' : v > 0 ? 'pos' : 'neg');
const arrow = d => ({ pos: 'i-up', neg: 'i-down', flat: 'i-flat' }[d]);
const signed = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + '%';
const icon = (id, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const deltaHtml = v => `<span class="${dir(v)}" style="display:inline-flex;align-items:center;gap:2px">${icon(arrow(dir(v)))}${signed(v)}</span>`;

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

let countToken = 0;
function countUp(el, to) {
  const token = ++countToken;
  if (reduceMotion) { el.textContent = money(to); return; }
  const start = performance.now(), dur = 600;
  const tick = now => {
    if (token !== countToken) return;
    const t = Math.min(1, (now - start) / dur);
    el.textContent = money(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------- Derived numbers for the current selection ---------------- */

function stats() {
  const p = P(), c = C();
  const total = sum(p.cur), prev = sum(c.data);
  const orders = Math.round(total / p.avg), prevOrders = Math.round(prev / (p.avg * c.avgF));
  const items = Math.round(orders * 2.86), prevItems = Math.round(prevOrders * 2.86);
  const aov = total / orders, prevAov = prev / prevOrders;
  const peakIdx = p.cur.indexOf(Math.max(...p.cur));
  return { total, prev, orders, prevOrders, items, prevItems, aov, prevAov, peakIdx };
}

/* ---------------- Hero + KPIs ---------------- */

function renderHero(s) {
  const p = P(), c = C();
  $('#hero-title').textContent = p.hero;
  countUp($('#hero-amount'), s.total);
  const d = pct(s.total, s.prev);
  $('#hero-delta').className = 'pill ' + dir(d);
  $('#hero-delta').innerHTML = icon(arrow(dir(d))) + signed(d);
  $('#hero-delta').setAttribute('aria-label', (d >= 0 ? 'Up ' : 'Down ') + Math.abs(d).toFixed(1) + ' percent');
  $('#hero-sub').textContent = `vs ${c.short} ${money(s.prev)}`;

  // sparkline
  const max = Math.max(...p.cur), n = p.cur.length;
  const pts = p.cur.map((v, i) => [2 + (i / (n - 1)) * 296, 58 - (v / max) * 50]);
  const line = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('');
  const [px, py] = pts[s.peakIdx];
  $('#spark').setAttribute('aria-label', `Sales trend, highest at ${p.peak(s.peakIdx)}`);
  $('#spark').innerHTML =
    `<path d="${line}L298,62L2,62Z" fill="#BA713C" opacity=".35"/>` +
    `<path d="${line}" fill="none" stroke="#E8B66B" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle cx="${px}" cy="${py}" r="5" fill="#E8B66B" stroke="#5A3619" stroke-width="2"/>`;
}

function renderKpis(s) {
  const p = P();
  const tiles = [
    { ico: 'i-orders', label: 'Orders', value: s.orders.toLocaleString('en-US'), d: pct(s.orders, s.prevOrders) },
    { ico: 'i-basket', label: 'Avg. order', value: money(s.aov), d: pct(s.aov, s.prevAov) },
    { ico: 'i-croissant', label: 'Items sold', value: s.items.toLocaleString('en-US'), d: pct(s.items, s.prevItems) },
    { ico: 'i-clock', label: p.peakLabel, value: p.peak(s.peakIdx), note: money0(p.cur[s.peakIdx]) + ' sold' }
  ];
  $('#kpis').innerHTML = tiles.map(t => `
    <div class="kpi">
      <div class="kpi-icon">${icon(t.ico)}</div>
      <p class="kpi-label">${t.label}</p>
      <p class="kpi-value">${t.value}</p>
      ${t.note ? `<p class="kpi-note">${t.note}</p>` : `<p class="kpi-delta ${dir(t.d)}">${icon(arrow(dir(t.d)))}${signed(t.d)}</p>`}
    </div>`).join('');
}

/* ---------------- Chart ---------------- */

function niceTop(max) {
  const raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].find(m => m * mag >= raw) * mag;
  return { step, top: step * 4 };
}
function barPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

const geo = { ml: 62, mr: 8, mt: 28, mb: 30, W: 0, H: 0, n: 0 };

function renderChart() {
  const p = P(), c = C(), box = $('#chart');
  const W = Math.max(260, Math.floor(box.clientWidth || 320)), H = W < 500 ? 270 : 330;
  const { ml, mr, mt, mb } = geo, n = p.cur.length;
  const plotW = W - ml - mr, plotH = H - mt - mb;
  const { step, top } = niceTop(Math.max(...p.cur, ...c.data));
  const y = v => mt + plotH - (v / top) * plotH;
  const gW = plotW / n;
  Object.assign(geo, { W, H, n, gW, plotW });

  let g = '';
  for (let v = 0; v <= top + 0.1; v += step) {
    g += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="#DAC6B1" stroke-width="1" ${v ? 'stroke-dasharray="2 4"' : ''}/>`;
    g += `<text x="${ml - 8}" y="${y(v) + 5}" text-anchor="end" font-size="14">${money0(v)}</text>`;
  }

  const paired = n <= 14;
  const every = Math.max(1, Math.ceil(34 / gW));
  let bars = '', line = '', xl = '';
  p.cur.forEach((v, i) => {
    const cx = ml + i * gW + gW / 2;
    if (paired) {
      const bw = Math.max(4, Math.min(18, (gW - 8) / 2)), x0 = cx - bw - 1;
      if (v > 0) bars += `<path d="${barPath(x0, y(v), bw, y(0) - y(v), 4)}" fill="${COLORS.today}"/>`;
      const cv = c.data[i];
      if (cv > 0) bars += `<path d="${barPath(x0 + bw + 2, y(cv), bw, y(0) - y(cv), 4)}" fill="${COLORS.compare}"/>`;
    } else {
      const bw = Math.max(4, gW - 3);
      bars += `<path d="${barPath(cx - bw / 2, y(v), bw, y(0) - y(v), 3)}" fill="${COLORS.today}"/>`;
    }
    if (i % every === 0 || i === n - 1 && n <= 14) {
      xl += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="14">${p.labels[i]}</text>`;
    }
  });
  if (!paired) {
    const d = c.data.map((v, i) => (i ? 'L' : 'M') + (ml + i * gW + gW / 2).toFixed(1) + ',' + y(v).toFixed(1)).join('');
    line = `<path d="${d}" fill="none" stroke="${COLORS.compare}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  // one direct label: the peak bar
  const pk = p.cur.indexOf(Math.max(...p.cur));
  const pkx = Math.min(W - mr - 20, Math.max(ml + 20, ml + pk * gW + gW / 2));
  const peak = `<text x="${pkx}" y="${y(p.cur[pk]) - 8}" text-anchor="middle" font-size="14" font-weight="800">${money0(p.cur[pk])}</text>`;

  box.innerHTML =
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${p.chartTitle}: ${p.cur.length} bars, today versus ${c.name.toLowerCase()}">
       ${g}<rect id="hv" x="0" y="${mt}" width="${gW}" height="${plotH}" rx="6" fill="#DAC6B1" opacity=".45" visibility="hidden"/>
       ${bars}${line}${peak}${xl}
       <rect id="hit" x="${ml}" y="0" width="${plotW}" height="${H}" fill="transparent"/>
     </svg>
     <div class="tooltip" id="tip" hidden></div>`;

  state.hover = -1;
  bindChart();
  $('#chart-summary').textContent =
    `${p.chartTitle}. Highest sales: ${p.peak(pk)}, ${money(p.cur[pk])}. Total ${money(sum(p.cur))} versus ${money(sum(c.data))} ${c.short}.`;
}

function showTip(i) {
  const p = P(), c = C(), { ml, gW, mt, W } = geo;
  i = Math.max(0, Math.min(p.cur.length - 1, i));
  state.hover = i;
  const hv = $('#hv'); hv.setAttribute('x', ml + i * gW); hv.setAttribute('visibility', 'visible');
  const d = pct(p.cur[i], c.data[i]);
  const tip = $('#tip');
  tip.innerHTML =
    `<strong>${p.tips[i]}</strong>
     <div class="t-row"><span><i class="sw" style="background:${COLORS.today}"></i>Today</span><b>${money(p.cur[i])}</b></div>
     <div class="t-row"><span><i class="sw" style="background:${COLORS.compare}"></i>${c.name}</span><b>${money(c.data[i])}</b></div>
     <div class="t-diff ${dir(d)}">${signed(d)} vs ${c.name.toLowerCase()}</div>`;
  tip.hidden = false;
  const cx = ml + i * gW + gW / 2, tw = tip.offsetWidth;
  let left = cx + 12; if (left + tw > W) left = cx - tw - 12;
  tip.style.left = Math.max(0, left) + 'px';
  tip.style.top = (mt + 4) + 'px';
}
function hideTip() {
  state.hover = -1;
  const hv = $('#hv'), tip = $('#tip');
  if (hv) hv.setAttribute('visibility', 'hidden');
  if (tip) tip.hidden = true;
}
function bindChart() {
  const hit = $('#hit');
  const idx = e => {
    const r = hit.getBoundingClientRect();
    return Math.floor(((e.clientX - r.left) / r.width) * geo.n);
  };
  hit.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') showTip(idx(e)); });
  hit.addEventListener('pointerdown', e => showTip(idx(e)));
  hit.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideTip(); });
}

function renderTable() {
  const p = P(), c = C();
  const rows = p.cur.map((v, i) => {
    const d = pct(v, c.data[i]);
    return `<tr><td>${p.tips[i]}</td><td>${money(v)}</td><td>${money(c.data[i])}</td><td class="${dir(d)}">${signed(d)}</td></tr>`;
  }).join('');
  $('#table-wrap').innerHTML =
    `<table><caption class="sr-only">${p.chartTitle}</caption>
     <thead><tr><th scope="col">${p.unit === 'hour' ? 'Hour' : 'Day'}</th><th scope="col">Today</th><th scope="col">${c.name}</th><th scope="col">Change</th></tr></thead>
     <tbody>${rows}</tbody></table>`;
}

function renderChartCard() {
  const p = P(), c = C();
  $('#chart-title').textContent = p.chartTitle;
  $('#cmp-seg').innerHTML = p.cmps.map((o, i) =>
    `<button type="button" data-cmp="${i}" aria-pressed="${i === state.cmp}">${o.name}</button>`).join('');
  $('#chart-legend').innerHTML =
    `<li><i class="sw" style="background:${COLORS.today}"></i>${state.period === 'today' ? 'Today' : p.hero}</li>
     <li><i class="sw" style="background:${COLORS.compare}"></i>${c.name}</li>`;
  renderChart();
  renderTable();
}

/* ---------------- Best sellers, categories, stock ---------------- */

function renderSellers(s) {
  const ratio = s.total / TODAY_TOTAL;
  const top = PRODUCTS.map(p => ({ ...p, u: Math.round(p.units * ratio) }))
    .sort((a, b) => b.u - a.u).slice(0, 5);
  $('#sellers-list').innerHTML = top.map((p, i) => {
    const d = p.trend, k = dir(d);
    return `<li><button class="row" type="button" data-soon aria-label="${p.name}, ${p.u} sold">
      <span class="rank">${i + 1}</span>
      <span class="prod-ico" aria-hidden="true">${p.icon}</span>
      <span class="row-main"><span class="row-name" style="display:block">${p.name}</span><span class="row-sub">${p.cat} · ${money0(p.u * p.price)}</span></span>
      <span class="row-end"><span class="row-units" style="display:block">${p.u} sold</span>
        <span class="trend ${k}">${icon(arrow(k))}${k === 'flat' ? '0%' : signed(d).replace('.0', '')}</span></span>
    </button></li>`;
  }).join('');
}

function renderCategories(s) {
  const R = 70, CIRC = 2 * Math.PI * R;
  let acc = 0, arcs = '';
  CATEGORIES.forEach((c, i) => {
    const len = c.share * CIRC;
    const faded = state.cat !== null && state.cat !== i;
    arcs += `<circle class="seg-arc" cx="100" cy="100" r="${R}" fill="none" stroke="${c.color}" stroke-width="30"
      stroke-dasharray="${(len - 2).toFixed(2)} ${(CIRC - len + 2).toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}"
      transform="rotate(-90 100 100)" opacity="${faded ? 0.25 : 1}"/>`;
    acc += len;
  });
  const sel = state.cat === null ? null : CATEGORIES[state.cat];
  const centerVal = sel ? s.total * sel.share : s.total;
  $('#donut').innerHTML = arcs +
    `<text x="100" y="92" font-size="14">${sel ? sel.name : 'Total'}</text>
     <text x="100" y="118" font-size="26" font-weight="800">${money0(centerVal)}</text>`;
  $('#cat-list').innerHTML = CATEGORIES.map((c, i) =>
    `<li><button class="cat-row" type="button" data-cat="${i}" aria-pressed="${state.cat === i}">
       <i class="sw" style="background:${c.color}"></i>
       <span class="name">${c.name}</span>
       <span class="amt">${money0(s.total * c.share)}</span>
       <span class="share">${Math.round(c.share * 100)}%</span>
     </button></li>`).join('');
}

function renderStock() {
  $('#stock-count').textContent = `(${LOW_STOCK.length})`;
  $('#stock-list').innerHTML = LOW_STOCK.map(p => `
    <li><div class="stock-row">
      <span class="prod-ico" aria-hidden="true">${p.icon}</span>
      <span class="row-main"><span class="row-name" style="display:block">${p.name}<span class="stock-badge">${p.left === 0 ? 'Out' : 'Low'}</span></span>
        <span class="row-sub">${p.left} left of ${p.par}</span></span>
      <button class="btn btn-secondary" type="button" data-soon>Restock</button>
    </div></li>`).join('');
}

/* ---------------- Main render + events ---------------- */

function render() {
  const s = stats();
  document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.period === state.period)));
  renderHero(s);
  renderKpis(s);
  renderChartCard();
  renderSellers(s);
  renderCategories(s);
}

$('#chips').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  state.period = b.dataset.period; state.cmp = 0; state.cat = null;
  render();
});
$('#cmp-seg').addEventListener('click', e => {
  const b = e.target.closest('[data-cmp]'); if (!b) return;
  state.cmp = +b.dataset.cmp;
  render();
});
$('#cat-list').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  const i = +b.dataset.cat;
  state.cat = state.cat === i ? null : i;
  renderCategories(stats());
});
$('#toggle-table').addEventListener('click', e => {
  state.table = !state.table;
  $('#table-wrap').hidden = !state.table;
  $('#chart').hidden = state.table;
  e.currentTarget.textContent = state.table ? 'Show chart' : 'Show as table';
  if (!state.table) renderChart();
});
$('#chart').addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { showTip(state.hover + 1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { showTip(state.hover < 0 ? 0 : state.hover - 1); e.preventDefault(); }
  else if (e.key === 'Escape') hideTip();
});
document.addEventListener('pointerdown', e => { if (!e.target.closest('#chart')) hideTip(); });

// Features that are not built yet say so instead of doing nothing.
document.addEventListener('click', e => {
  if (e.target.closest('[data-soon]')) toast('Coming in the next version');
  if (e.target.closest('#bell')) toast('You have 3 sample notifications');
});

// Header border on scroll, nav highlight
const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => topbar.classList.toggle('is-scrolled', scrollY > 4), { passive: true });
document.querySelectorAll('a.nav-item').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('is-active'); n.removeAttribute('aria-current'); });
  a.classList.add('is-active'); a.setAttribute('aria-current', 'page');
}));

// Redraw the chart when its width changes (rotate, resize)
let lastW = 0;
new ResizeObserver(() => {
  const w = $('#chart').clientWidth;
  if (w && w !== lastW && !state.table) { lastW = w; renderChart(); }
}).observe($('#chart'));

$('#today-date').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
$('#updated').textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
renderStock();
render();
