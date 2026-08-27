const GATE = "512fcae998e2963b81925c6ad41a7bdc63384130b22eb7983e25b3e1963708c8";
const STORE = "citi-plus-cash-v4";
const UNLOCK = "citi-plus-shop-unlock";

const IN_CATS = [
  { id: "counter", name: "Counter sales", sale: true },
  { id: "cosmetics-in", name: "Cosmetics sales", sale: true },
  { id: "wholesale", name: "Wholesale", sale: true },
  { id: "credit", name: "Credit collections" },
  { id: "panel", name: "Panel / insurance" },
  { id: "returns-in", name: "Supplier returns" },
  { id: "other-in", name: "Other income" },
];
const OUT_CATS = [
  { id: "rent", name: "Rent" },
  { id: "salaries", name: "Salaries" },
  { id: "electricity", name: "Electricity" },
  { id: "utilities", name: "Water / gas" },
  { id: "phone", name: "Phone / internet" },
  { id: "delivery", name: "Delivery" },
  { id: "packaging", name: "Packaging" },
  { id: "tax", name: "Tax / license" },
  { id: "maintenance", name: "Shop maintenance" },
  { id: "marketing", name: "Marketing" },
  { id: "draw", name: "Owner draw" },
  { id: "other-out", name: "Other expense" },
];
const BUY_CATS = [
  { id: "stock", name: "Medicine stock" },
  { id: "cosmetics-out", name: "Cosmetics stock" },
  { id: "devices", name: "Devices / sundries" },
];
const TENDER = { cash: "Cash", jazzcash: "JazzCash / Easypaisa", bank: "Bank transfer", card: "Card" };

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/ledger", label: "Ledger" },
  { to: "/spend", label: "Spend" },
  { to: "/purchases", label: "Purchases" },
];

const icoHome = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>`;
const icoBook = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22.5z"/><path d="M5 4.5v18"/></svg>`;
const icoPie = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3v9h9a9 9 0 0 0-9-9z"/></svg>`;
const icoBox = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 8.5 12 4l9 4.5-9 4.5z"/><path d="M3 8.5v7L12 20l9-4.5v-7"/><path d="M12 13v7"/></svg>`;

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function parseDay(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function pkr(n) {
  return "Rs " + Math.round(n).toLocaleString("en-PK");
}
function catName(id) {
  return [...IN_CATS, ...OUT_CATS, ...BUY_CATS].find((c) => c.id === id)?.name || id;
}
function isSale(e) {
  return e.kind === "in" && IN_CATS.find((c) => c.id === e.categoryId)?.sale;
}
function prettyDate(s) {
  return parseDay(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function seed() {
  const rows = [];
  const now = today();
  const start = new Date(now);
  start.setDate(start.getDate() - 89);
  let i = 0;
  for (let t = new Date(start); t <= now; t.setDate(t.getDate() + 1)) {
    const day = iso(t);
    const wd = t.getDay();
    if (wd !== 0) {
      const tickets = 2 + (i % 3);
      for (let k = 0; k < tickets; k++) {
        const saleCats = ["counter", "counter", "cosmetics-in", "wholesale"];
        rows.push({
          id: uid(),
          date: day,
          kind: "in",
          amount: 850 + ((i * 37 + k * 190) % 4200),
          categoryId: saleCats[(i + k) % saleCats.length],
          tender: ["cash", "cash", "jazzcash", "card"][(i + k) % 4],
          note: "",
        });
      }
      if (i % 6 === 0) {
        rows.push({
          id: uid(), date: day, kind: "in", amount: 3200 + (i % 5) * 400,
          categoryId: "credit", tender: "cash", note: "Old bill",
        });
      }
    }
    if (i % 7 === 2) {
      rows.push({
        id: uid(), date: day, kind: "buy", amount: 18000 + (i % 8) * 3500,
        categoryId: "stock", tender: "bank", note: "Distributor",
      });
    }
    if (i % 14 === 5) {
      rows.push({
        id: uid(), date: day, kind: "buy", amount: 6500 + (i % 4) * 800,
        categoryId: "cosmetics-out", tender: "cash", note: "Beauty rack",
      });
    }
    if (i % 20 === 3) {
      rows.push({
        id: uid(), date: day, kind: "buy", amount: 4200,
        categoryId: "devices", tender: "card", note: "BP monitor / sundries",
      });
    }
    if (t.getDate() === 1) {
      rows.push({ id: uid(), date: day, kind: "out", amount: 45000, categoryId: "rent", tender: "bank", note: "Shop rent" });
      rows.push({ id: uid(), date: day, kind: "out", amount: 38000, categoryId: "salaries", tender: "bank", note: "Staff" });
    }
    if (i % 10 === 1) rows.push({ id: uid(), date: day, kind: "out", amount: 4200 + (i % 3) * 300, categoryId: "electricity", tender: "jazzcash", note: "WAPDA" });
    if (i % 9 === 4) rows.push({ id: uid(), date: day, kind: "out", amount: 900 + (i % 5) * 80, categoryId: "delivery", tender: "cash", note: "" });
    if (i % 15 === 0) rows.push({ id: uid(), date: day, kind: "out", amount: 25000, categoryId: "draw", tender: "cash", note: "Owner" });
    i += 1;
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function migrate(raw) {
  if (!raw?.entries?.length) return null;
  const entries = raw.entries.map((e) => {
    if (e.kind === "buy") return e;
    if (BUY_CATS.some((c) => c.id === e.categoryId)) return { ...e, kind: "buy" };
    return e;
  });
  return { ...raw, entries };
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || localStorage.getItem("citi-plus-cash-v3"));
    const migrated = migrate(raw);
    if (migrated?.entries?.length) return migrated;
  } catch {}
  return {
    float: 75000,
    entries: seed(),
    period: "thisMonth",
    from: iso(new Date(today().getFullYear(), today().getMonth(), 1)),
    to: iso(today()),
  };
}
function save() {
  localStorage.setItem(STORE, JSON.stringify({
    float: state.float,
    entries: state.entries,
    period: state.period,
    from: state.from,
    to: state.to,
  }));
}

const state = Object.assign({ float: 75000, entries: [], period: "thisMonth", from: "", to: "" }, load());
let calMonth = parseDay(state.from || iso(today()));
let rangePick = { from: state.from, to: state.to };

async function sha(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim()));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function periodBounds(key) {
  const n = today();
  if (key === "today") return { from: n, to: n, label: "Today" };
  if (key === "thisMonth") return { from: new Date(n.getFullYear(), n.getMonth(), 1), to: new Date(n.getFullYear(), n.getMonth() + 1, 0), label: "This month" };
  if (key === "lastMonth") {
    const d = new Date(n.getFullYear(), n.getMonth() - 1, 1);
    return { from: d, to: new Date(n.getFullYear(), n.getMonth(), 0), label: "Last month" };
  }
  if (key === "last90") {
    const f = new Date(n); f.setDate(f.getDate() - 89);
    return { from: f, to: n, label: "Last 90 days" };
  }
  if (key === "year") return { from: new Date(n.getFullYear(), 0, 1), to: n, label: "This year" };
  if (key === "custom") return { from: parseDay(state.from), to: parseDay(state.to), label: "Custom dates" };
  return { from: new Date(2000, 0, 1), to: n, label: "All time" };
}

function inRange(date, from, to) {
  const t = parseDay(date);
  return t >= from && t <= to;
}
function ranged(key = state.period) {
  const { from, to } = periodBounds(key);
  return state.entries.filter((e) => inRange(e.date, from, to));
}
function ofKind(rows, kind) {
  return rows.filter((e) => e.kind === kind);
}
function sum(rows) {
  return rows.reduce((s, e) => s + e.amount, 0);
}
function sales(rows) {
  const list = rows.filter(isSale);
  return { total: sum(list), count: list.length, avg: list.length ? sum(list) / list.length : 0 };
}
function breakdown(rows, cats) {
  const peak = Math.max(1, ...cats.map((c) => sum(rows.filter((e) => e.categoryId === c.id))));
  return cats
    .map((c) => {
      const list = rows.filter((e) => e.categoryId === c.id).sort((a, b) => (a.date < b.date ? 1 : -1));
      const total = sum(list);
      return { ...c, total, count: list.length, avg: list.length ? total / list.length : 0, share: peak ? total / peak : 0, rows: list };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

function route() {
  const hash = location.hash.replace(/^#/, "");
  if (hash) return hash || "/";
  const path = location.pathname.replace(/\/$/, "") || "/";
  return path === "/index.html" ? "/" : path;
}

function renderNav() {
  const path = route();
  document.getElementById("side-nav").innerHTML = NAV.map(
    (n) => `<a href="#${n.to}" class="${path === n.to ? "active" : ""}">${n.label}</a>`
  ).join("");
  document.getElementById("tabs").innerHTML = [
    `<a href="#/" class="${path === "/" ? "active" : ""}">${icoHome}Home</a>`,
    `<a href="#/ledger" class="${path === "/ledger" ? "active" : ""}">${icoBook}Ledger</a>`,
    `<a href="#/record" class="record ${path === "/record" ? "active" : ""}"><span class="plus">+</span>Add</a>`,
    `<a href="#/spend" class="${path === "/spend" ? "active" : ""}">${icoPie}Spend</a>`,
    `<a href="#/purchases" class="${path === "/purchases" ? "active" : ""}">${icoBox}Buy</a>`,
  ].join("");
  const titles = { "/": "Dashboard", "/ledger": "Ledger", "/spend": "Spend", "/purchases": "Purchases", "/record": "Record" };
  document.getElementById("page-title").textContent = titles[path] || "Citi Plus";
  document.getElementById("period-row").classList.toggle("hidden", path === "/record");
  const { label } = periodBounds(state.period);
  document.getElementById("period-btn").textContent = state.period === "custom"
    ? `${state.from} → ${state.to}`
    : label;
}

function pageDashboard() {
  const day = ranged("today");
  const month = ranged("thisMonth");
  const all = state.entries;
  const dayIn = sum(ofKind(day, "in"));
  const dayOut = sum(ofKind(day, "out"));
  const daySale = sales(day);
  const mIn = sum(ofKind(month, "in"));
  const mOut = sum(ofKind(month, "out"));
  const mBuy = sum(ofKind(month, "buy"));
  const mSale = sales(month);
  const mBuyRows = ofKind(month, "buy");
  const cash = state.float + sum(ofKind(all, "in")) - sum(ofKind(all, "out")) - sum(ofKind(all, "buy"));
  const inShare = Math.round((mIn / Math.max(1, mIn + mOut + mBuy)) * 100);
  const outShare = Math.round((mOut / Math.max(1, mIn + mOut + mBuy)) * 100);
  return `
    <div class="stack">
      <section class="hero">
        <p class="label">Cash on hand</p>
        <p class="figure tabular">${pkr(cash)}</p>
        <p class="meta">Float ${pkr(state.float)} · Month sales ${pkr(mSale.total)}</p>
      </section>
      <div class="lg2">
        <section class="panel">
          <div class="panel-h"><h2>Today</h2><span>Counter so far</span></div>
          <div class="grid2">
            <div class="cell"><p class="k">Cash in</p><p class="v in tabular">${pkr(dayIn)}</p></div>
            <div class="cell"><p class="k">Cash out</p><p class="v out tabular">${pkr(dayOut)}</p></div>
            <div class="cell"><p class="k">Average sale today</p><p class="v tabular">${pkr(daySale.avg)}</p></div>
            <div class="cell"><p class="k">Sale tickets</p><p class="v tabular">${daySale.count}</p></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-h"><h2>This month</h2><span>${today().getDate()} days in</span></div>
          <div class="grid2">
            <div class="cell"><p class="k">Cash in</p><p class="v in tabular">${pkr(mIn)}</p></div>
            <div class="cell"><p class="k">Cash out</p><p class="v out tabular">${pkr(mOut)}</p></div>
          </div>
          <div class="bar" style="margin-top:12px"><i class="a" style="width:${inShare}%"></i><i class="b" style="width:${outShare}%"></i><i class="c" style="width:${Math.max(0, 100 - inShare - outShare)}%"></i></div>
          <div class="facts">
            <div class="fact"><span>Average sale</span><b class="tabular">${pkr(mSale.avg)}</b></div>
            <div class="fact"><span>Sale tickets</span><b class="tabular">${mSale.count}</b></div>
            <div class="fact"><span>Avg expense bill</span><b class="tabular">${pkr(ofKind(month, "out").length ? mOut / ofKind(month, "out").length : 0)}</b></div>
          </div>
        </section>
      </div>
      <section class="panel">
        <div class="panel-h"><h2>Purchases</h2><span>Stock only — not cash out</span></div>
        <div class="grid2">
          <div class="cell"><p class="k">Total purchases</p><p class="v buy tabular">${pkr(mBuy)}</p></div>
          <div class="cell"><p class="k">Average purchase</p><p class="v tabular">${pkr(mBuyRows.length ? mBuy / mBuyRows.length : 0)}</p></div>
        </div>
        <div class="facts">
          ${breakdown(mBuyRows, BUY_CATS).map((c) => `
            <div class="fact"><span>${c.name}</span><b class="buy tabular">${pkr(c.total)}</b></div>
          `).join("") || `<div class="fact"><span>No stock buys this month</span><b>—</b></div>`}
        </div>
      </section>
    </div>`;
}

function pageLedger() {
  const rows = ranged().slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const groups = {};
  for (const e of rows) (groups[e.date] ||= []).push(e);
  const kindChip = { in: "In", out: "Out", buy: "Buy" };
  const tone = { in: "in", out: "out", buy: "buy" };
  return `
    <section class="panel">
      <div class="panel-h"><h2>Movements</h2><span>${rows.length} in view</span></div>
      ${Object.keys(groups).map((d) => `
        <p class="ledger-day">${parseDay(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
        ${groups[d].map((e) => `
          <div class="ledger-item">
            <div><span class="chip">${kindChip[e.kind]}</span><b>${catName(e.categoryId)}</b>
              <div class="cat-meta">${TENDER[e.tender] || e.tender}${e.note ? " · " + e.note : ""}</div>
            </div>
            <b class="${tone[e.kind]} tabular">${e.kind === "in" ? "+" : "−"}${pkr(e.amount)}</b>
          </div>`).join("")}
      `).join("") || `<p class="cat-row">No entries in this range.</p>`}
    </section>`;
}

function billsHtml(list) {
  return `<div class="bill-list">${list.map((e) => `
    <div class="bill">
      <div>
        <div class="when">${prettyDate(e.date)} · ${TENDER[e.tender] || e.tender}</div>
        ${e.note ? `<div class="note">${e.note}</div>` : ""}
      </div>
      <b class="tabular">${pkr(e.amount)}</b>
    </div>`).join("")}</div>`;
}

function detailPage(title, hint, rows, cats, meterClass) {
  const total = sum(rows);
  const items = breakdown(rows, cats);
  return `
    <div class="stack">
      <section class="hero">
        <p class="label">${title}</p>
        <p class="figure tabular">${pkr(total)}</p>
        <p class="meta">${hint} · ${rows.length} entries</p>
      </section>
      <section class="panel">
        <div class="panel-h"><h2>By category</h2><span>Amount, bills, average, each bill</span></div>
        ${items.map((c) => `
          <div class="cat-row">
            <div class="cat-top"><b>${c.name}</b><b class="tabular">${pkr(c.total)}</b></div>
            <div class="cat-meter ${meterClass}"><i style="width:${Math.round(c.share * 100)}%"></i></div>
            <p class="cat-meta">${c.count} bill${c.count === 1 ? "" : "s"} · avg ${pkr(c.avg)} · ${total ? Math.round((c.total / total) * 100) : 0}% of this list</p>
            ${billsHtml(c.rows)}
          </div>`).join("") || `<p class="cat-row">Nothing recorded in this range.</p>`}
      </section>
    </div>`;
}

function pageSpend() {
  const rows = ofKind(ranged(), "out");
  return detailPage("Operating spend", periodBounds(state.period).label + " · purchases excluded", rows, OUT_CATS, "");
}
function pagePurchases() {
  const rows = ofKind(ranged(), "buy");
  return detailPage("Stock purchases", periodBounds(state.period).label, rows, BUY_CATS, "buy");
}

function pageRecord() {
  return `
    <section class="panel">
      <form class="form" id="rec-form">
        <div class="seg" id="kind-seg">
          <button type="button" data-kind="in" class="on">Cash in</button>
          <button type="button" data-kind="out">Cash out</button>
          <button type="button" data-kind="buy">Purchase</button>
        </div>
        <p id="live" class="figure" style="margin:0;font-family:var(--serif);font-size:32px"></p>
        <div>
          <label for="amt">Amount (Rs)</label>
          <input class="field" id="amt" type="number" min="1" inputmode="numeric" required />
        </div>
        <div>
          <label for="dt">Date</label>
          <input class="field" id="dt" type="date" value="${iso(today())}" required />
        </div>
        <div>
          <label for="cat">Category</label>
          <select class="field" id="cat"></select>
        </div>
        <div>
          <label for="ten">Tender</label>
          <select class="field" id="ten">${Object.entries(TENDER).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
        </div>
        <div>
          <label for="note">Note</label>
          <input class="field" id="note" placeholder="Optional" />
        </div>
        <p id="saved" class="ok hidden"></p>
        <button class="btn btn-in" id="save-btn" type="submit">Save entry</button>
      </form>
    </section>`;
}

function fillCats(kind) {
  const cats = kind === "in" ? IN_CATS : kind === "buy" ? BUY_CATS : OUT_CATS;
  document.getElementById("cat").innerHTML = cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
}

function paint() {
  renderNav();
  const path = route();
  const main = document.getElementById("main");
  if (path === "/ledger") main.innerHTML = pageLedger();
  else if (path === "/spend") main.innerHTML = pageSpend();
  else if (path === "/purchases") main.innerHTML = pagePurchases();
  else if (path === "/record") {
    main.innerHTML = pageRecord();
    bindRecord();
  } else main.innerHTML = pageDashboard();
}

function bindRecord() {
  let kind = "in";
  fillCats(kind);
  const amt = document.getElementById("amt");
  const live = document.getElementById("live");
  const btn = document.getElementById("save-btn");
  const update = () => {
    const n = Number(amt.value) || 0;
    live.textContent = n ? (kind === "in" ? "+" : "−") + pkr(n) : "";
    live.className = kind === "in" ? "in" : kind === "buy" ? "buy" : "out";
    btn.className = "btn " + (kind === "in" ? "btn-in" : kind === "buy" ? "btn-buy" : "btn-out");
  };
  document.getElementById("kind-seg").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    kind = b.dataset.kind;
    [...e.currentTarget.children].forEach((x) => x.classList.toggle("on", x === b));
    fillCats(kind);
    update();
  };
  amt.oninput = update;
  document.getElementById("rec-form").onsubmit = (e) => {
    e.preventDefault();
    const amount = Number(amt.value);
    if (!amount) return;
    state.entries.unshift({
      id: uid(),
      date: document.getElementById("dt").value,
      kind,
      amount,
      categoryId: document.getElementById("cat").value,
      tender: document.getElementById("ten").value,
      note: document.getElementById("note").value.trim(),
    });
    save();
    const box = document.getElementById("saved");
    box.textContent = `Saved ${kind === "in" ? "+" : "−"}${pkr(amount)}. Stay here and add another.`;
    box.classList.remove("hidden");
    amt.value = "";
    document.getElementById("note").value = "";
    update();
  };
}

function renderCal() {
  const y = calMonth.getFullYear();
  const m = calMonth.getMonth();
  document.getElementById("cal-label").textContent = calMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const from = rangePick.from ? parseDay(rangePick.from) : null;
  const to = rangePick.to ? parseDay(rangePick.to) : from;
  let html = "";
  for (let i = 0; i < start; i++) html += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d);
    const id = iso(dt);
    const edge = id === rangePick.from || id === rangePick.to;
    const mid = from && to && dt > from && dt < to;
    html += `<button type="button" data-day="${id}" class="${edge ? "edge" : mid ? "in-range" : ""}">${d}</button>`;
  }
  document.getElementById("cal-grid").innerHTML = html;
  document.getElementById("cal-hint").textContent = rangePick.from && rangePick.to
    ? `${rangePick.from} → ${rangePick.to}`
    : "Tap a start day, then an end day";
}

function applyCustom() {
  if (!rangePick.from) return;
  state.period = "custom";
  state.from = rangePick.from;
  state.to = rangePick.to || rangePick.from;
  save();
  paint();
}

function closeCal() {
  document.getElementById("cal-pop").classList.add("hidden");
  document.getElementById("dates-btn").setAttribute("aria-expanded", "false");
}
function openCal() {
  document.getElementById("period-sheet").classList.add("hidden");
  document.getElementById("cal-pop").classList.remove("hidden");
  document.getElementById("dates-btn").setAttribute("aria-expanded", "true");
  renderCal();
}

function openApp() {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  paint();
}

document.getElementById("gate-form").onsubmit = async (e) => {
  e.preventDefault();
  const hash = await sha(document.getElementById("pw").value);
  if (hash !== GATE) {
    document.getElementById("gate-err").textContent = "Wrong password.";
    document.getElementById("gate-err").classList.remove("hidden");
    document.getElementById("pw").value = "";
    return;
  }
  localStorage.setItem(UNLOCK, GATE);
  openApp();
};

function lock() {
  localStorage.removeItem(UNLOCK);
  location.reload();
}
document.getElementById("lock-btn").onclick = lock;
document.getElementById("lock-btn-m").onclick = lock;

document.getElementById("period-btn").onclick = (e) => {
  e.stopPropagation();
  closeCal();
  document.getElementById("period-sheet").classList.toggle("hidden");
};
document.getElementById("period-sheet").onclick = (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.period = b.dataset.period;
  save();
  document.getElementById("period-sheet").classList.add("hidden");
  paint();
};
document.getElementById("dates-btn").onclick = (e) => {
  e.stopPropagation();
  const pop = document.getElementById("cal-pop");
  if (pop.classList.contains("hidden")) openCal();
  else closeCal();
};
document.getElementById("cal-prev").onclick = (e) => {
  e.stopPropagation();
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
  renderCal();
};
document.getElementById("cal-next").onclick = (e) => {
  e.stopPropagation();
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
  renderCal();
};
document.getElementById("cal-grid").onclick = (e) => {
  e.stopPropagation();
  const b = e.target.closest("button[data-day]");
  if (!b) return;
  const day = b.dataset.day;
  if (!rangePick.from || (rangePick.from && rangePick.to)) {
    rangePick = { from: day, to: "" };
  } else if (day < rangePick.from) {
    rangePick = { from: day, to: rangePick.from };
  } else {
    rangePick.to = day;
  }
  renderCal();
};
document.getElementById("cal-done").onclick = (e) => {
  e.stopPropagation();
  applyCustom();
  closeCal();
};
document.getElementById("cal-clear").onclick = (e) => {
  e.stopPropagation();
  rangePick = { from: "", to: "" };
  state.period = "thisMonth";
  save();
  renderCal();
  paint();
};
document.getElementById("cal-pop").onclick = (e) => e.stopPropagation();
document.addEventListener("click", () => {
  closeCal();
  document.getElementById("period-sheet").classList.add("hidden");
});
window.addEventListener("hashchange", paint);

if (localStorage.getItem(UNLOCK) === GATE) openApp();
else document.getElementById("pw").focus();
