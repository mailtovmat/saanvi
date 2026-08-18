/* Shared shell + per-page renderers. No framework. */
(function () {
  const PAGES = [
    {id:"overview", href:"index.html", label:"Dashboard"},
    {id:"applications", href:"applications.html", label:"Applications"},
    {id:"progress", href:"progress.html", label:"Progress"},
    {id:"calendar", href:"calendar.html", label:"Calendar"},
    {id:"people", href:"people.html", label:"People"},
    {id:"docs", href:"docs.html", label:"Docs"},
    {id:"financial", href:"financial.html", label:"Financial Aid"}
  ];

  const MARK_COLOR = {Yes:"#0a0a0a", add:"#2f6feb", unsure:"#d4a017", review:"#8a8a8a"};
  const TIER_COLOR = {Reach:"#2f6feb", Match:"#2e7d57", Safety:"#d4a017"};
  const MARK_LABEL = {Yes:"Yes", add:"add", unsure:"unsure", review:"review"};
  const C = {blue:"#4472C4", red:"#FF6B6B", amber:"#FFD966", dark:"#C00000", teal:"#0D7377", tealLt:"#E0F2F1"};
  const PLAN_WEEKS = 30;
  const PLAN_BASE = parse("2026-08-10");
  const FREEZE = [5,6,7,8,9,10,11,12];
  const BREAK = [17,18,19];
  const T0 = parse("2026-08-01");
  const T1 = parse("2027-04-01");

  const state = {
    page: "overview",
    filter: "All",
    owner: "all",
    showDone: false,
    calYear: 2026,
    calMonth: 7
  };

  function todayStr() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: DATA.tz, year:"numeric", month:"2-digit", day:"2-digit"
    }).format(new Date());
  }
  function parse(s) {
    if (!s) return null;
    const [y,m,d] = s.split("-").map(Number);
    return new Date(y, m-1, d);
  }
  function iso(d) {
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  function pad(n) { return String(n).padStart(2,"0"); }
  function daysUntil(s) {
    if (!s) return null;
    return Math.round((parse(s) - parse(todayStr())) / 86400000);
  }
  function fmt(s) {
    if (!s) return "—";
    return parse(s).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
  }
  function mon(s) { return parse(s).toLocaleDateString("en-US", {month:"short"}); }
  function dateLabel(s) { return s ? `${mon(s)} ${parse(s).getDate()}` : "—"; }
  function relLabel(n) {
    if (n == null) return "";
    if (n < 0) return `${-n}d overdue`;
    if (n === 0) return "Today";
    if (n === 1) return "Tomorrow";
    return `in ${n} days`;
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }
  function weekdayLong(s) {
    return parse(s).toLocaleDateString("en-GB", {weekday:"long", timeZone:"UTC"});
  }
  function initials(name) {
    return name.replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.)\s*/, "")
      .replace(/\s+—.*$/, "")
      .split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0,2).toUpperCase();
  }
  function ownerName(o) {
    if (o === "parent") return "Father";
    if (o === "amogh" || o === "saanvi" || o === "student") return DATA.studentName;
    return o;
  }
  function markColor(m) { return MARK_COLOR[m] || "#8a8a8a"; }
  function tierColor(s) { return TIER_COLOR[s.tier] || markColor(s.mark); }
  function schoolCurrent(s) {
    if (s.parked) return {name:"UK track parked", due:null, note:"Decide by 24 Aug or it lapses"};
    if (s.mark === "add") return {name:"Resolve what “add” means (OQ-04)", due:"2026-08-31", note:"Not yet a real application"};
    if (s.mark === "unsure") return {name:"Keep or cut", due:"2026-08-31", note:"Do not research until the list is cut"};
    if (s.mark === "review") return {name:"Clarify OQ-05 before a school note is written", due:null, note:s.note};
    const next = DATA.tasks.filter(t => t.status !== "done" && (t.college === "General" || t.college === s.name))
      .sort((a,b) => (parse(a.due)||0) - (parse(b.due)||0))[0];
    if (next) return {name:next.t, due:next.due, note:next.why};
    return {name:"No open deliverable", due:null, note:""};
  }
  function schoolDeliverables(s) {
    if (s.country === "UK") {
      return [
        {name:"UK list decision", due:"2026-08-24", done:false, cat:"Form"},
        {name:"ESAT registration", due:"2026-09-14", done:false, cat:"Doc"},
        {name:"UCAS statement (3 questions)", due:"2026-10-08", done:false, cat:"Doc"},
        {name:"School UCAS reference", due:"2026-10-15", done:false, cat:"Person"},
        {name:"UCAS submit", due:s.deadline, done:false, cat:"Form"}
      ];
    }
    const items = [
      {name:"Common App account + add school", due:"2026-08-19", done:false, cat:"Form"},
      {name:"Supplemental essays", due:"2026-10-15", done:false, cat:"Doc"},
      {name:"Teacher recommendations", due:"2026-08-31", done:false, cat:"Person"},
      {name:"Counselor recommendation", due:"2026-08-31", done:false, cat:"Person"},
      {name:"Official transcript", due:null, done:false, cat:"Doc"},
      {name:"Test scores", due:"2026-10-15", done:false, cat:"Doc"},
      {name:"FAFSA", due:"2026-10-07", done:false, cat:"Doc"}
    ];
    if (s.aidCat === "full-need" || s.aidCat === "private" || s.aidCat === "merit") {
      items.push({name:"CSS Profile", due:"2026-10-14", done:false, cat:"Doc"});
    }
    return items;
  }
  function enrichSchools() {
    return DATA.schools.map(s => {
      const deliv = schoolDeliverables(s);
      const done = deliv.filter(d => d.done).length;
      const cur = schoolCurrent(s);
      return Object.assign({}, s, {
        _deliv: deliv,
        _done: done,
        _total: deliv.length,
        _pct: Math.round(done / Math.max(1, deliv.length) * 100),
        _current: cur
      });
    });
  }

  function badge(ds, done) {
    if (done) return {rel:"Done", cls:"badge badge-done"};
    if (!ds) return {rel:"No date", cls:"badge badge-ghost"};
    const d = daysUntil(ds);
    if (d < 0) return {rel:relLabel(d), cls:"badge badge-over"};
    if (d <= 14) return {rel:relLabel(d), cls:"badge badge-soon"};
    return {rel:relLabel(d), cls:"badge badge-ghost"};
  }
  function statusBadge(s) {
    if (s === "Parked") return "badge badge-mute";
    if (s === "Planning") return "badge badge-ghost";
    if (s === "Undecided" || s === "Unsure" || s === "Review") return "badge badge-ghost";
    if (s === "Submitted" || s === "Accepted") return "badge badge-ink";
    return "badge badge-ghost";
  }
  function finBadge(s) {
    if (s === "unblocked") return "badge badge-ink";
    if (s === "open question") return "badge badge-soon";
    return "badge badge-ghost";
  }
  function catClass(cat) {
    if (cat === "Person") return "cat cat-person";
    if (cat === "Form") return "cat cat-form";
    return "cat cat-doc";
  }

  function donut(segs, label, sub, size, stroke) {
    size = size || 140; stroke = stroke || 18;
    const r = (size - stroke) / 2, cx = size / 2, circ = 2 * Math.PI * r;
    const tot = Math.max(1, segs.reduce((a,s) => a + s.value, 0));
    let off = 0;
    const arcs = segs.filter(s => s.value > 0).map((s,i) => {
      const len = circ * s.value / tot;
      const el = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${stroke}" stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cx})"/>`;
      off += len;
      return el;
    }).join("");
    return `<div class="donut" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--n-100)" stroke-width="${stroke}"/>
        ${arcs}
      </svg>
      <div class="donut-label"><div class="donut-val">${esc(label)}</div>${sub?`<div class="caption">${esc(sub)}</div>`:""}</div>
    </div>`;
  }
  function legend(rows) {
    return `<div class="legend">${rows.map(r => `
      <div class="legend-row">
        <span class="sw" style="background:${r.color}"></span>
        <span style="font-size:13px;font-weight:600">${esc(r.label)}</span>
        <span class="label" style="font-variant-numeric:tabular-nums">${esc(r.value)}</span>
      </div>`).join("")}</div>`;
  }
  function bars(rows) {
    const max = Math.max(1, ...rows.map(r => r.value));
    return rows.map(r => `
      <div class="bar-row">
        <div class="bar-meta"><span>${esc(r.label)}</span><span>${r.value}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(r.value/max*100)}%;background:${r.color||"var(--ink)"}"></div></div>
      </div>`).join("");
  }

  function shell(inner) {
    const today = todayStr();
    const dd = parse(today).toLocaleDateString("en-GB", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
    return `<div class="page"><div class="wrap">
      <header class="top">
        <div class="brand">
          <div class="mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          </div>
          <div>
            <h1>College Application Tracker</h1>
            <div class="label" style="margin-top:2px">${esc(DATA.studentName)} · ${esc(DATA.classYear)} · ${esc(DATA.entry)}${DATA.sibling?` · <a href="${esc(DATA.sibling.href)}">${esc(DATA.sibling.name)}</a>`:""}</div>
          </div>
        </div>
        <div class="as-of label">${esc(dd)} · IST · all dates render in India time</div>
      </header>
      <nav class="tabs" aria-label="Sections">
        ${PAGES.map(p => `<a class="tabbtn" href="${p.href}" ${p.id===state.page?'aria-current="page"':""}>${p.label}</a>`).join("")}
      </nav>
      ${inner}
      <footer>
        <div>${esc(DATA.studentName)}'s College Tracker · redesigned 18 Aug 2026</div>
        <p>Every date marked TBD or verify is unconfirmed — a plausible wrong deadline is worse than a blank. Checkbox ticks on the old page did not save; this version is read-only against the vault. Do not post the URL.</p>
      </footer>
    </div></div>`;
  }

  function renderOverview(schools) {
    const tasks = DATA.tasks;
    const open = tasks.filter(t => t.status !== "done");
    const overdue = open.filter(t => t.overdueFrom || daysUntil(t.due) < 0);
    const soon = open.filter(t => !overdue.includes(t) && t.status !== "blocked" && daysUntil(t.due) >= 0 && daysUntil(t.due) <= 14);
    const yes = schools.filter(s => s.mark === "Yes");
    const yesUS = yes.filter(s => s.country === "US");
    const yesUK = yes.filter(s => s.country === "UK");
    const add = schools.filter(s => s.mark === "add");
    const unsure = schools.filter(s => s.mark === "unsure");
    const balance = schools.filter(s => s.mark === "Yes" || s.mark === "add");
    const tiers = {Reach:0, Match:0, Safety:0};
    balance.forEach(s => { if (tiers[s.tier] != null) tiers[s.tier]++; });
    const planDone = tasks.filter(t => t.status === "done").length;
    const planTot = tasks.length;
    const pct = Math.round(planDone / planTot * 100);

    const kpis = [
      {value: yes.length, label:"On the Yes list", hint:`${yesUS.length} US · ${yesUK.length} UK parked`},
      {value: 0, label:"Submitted", hint:`${yesUS.length} US still in planning`},
      {value: overdue.length, label:"Overdue tasks", hint:`${soon.length} due within 2 weeks`},
      {value: add.length + unsure.length, label:"Still undecided", hint:`${add.length} add · ${unsure.length} unsure · cut by 31 Aug`}
    ];

    const deadlineItems = open
      .map(t => ({due:t.due, title:t.t, college:t.college, done:false, overdue: daysUntil(t.due) < 0 || !!t.overdueFrom}))
      .sort((a,b) => parse(a.due) - parse(b.due))
      .slice(0, 8);

    return `<div class="stack">
      <div class="note">${DATA.notes && DATA.notes.overview ? DATA.notes.overview : ""}</div>
      <div class="kpis">${kpis.map(k => `
        <div class="kpi">
          <div class="val">${esc(k.value)}</div>
          <div class="caption" style="margin-top:8px">${esc(k.label)}</div>
          <div class="label" style="margin-top:4px">${esc(k.hint)}</div>
        </div>`).join("")}</div>
      <div class="charts">
        <div class="card">
          <div class="caption" style="margin-bottom:var(--s-4)">List composition</div>
          <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:center">
            ${donut([
              {value:yesUS.length, color:"var(--ink)"},
              {value:yesUK.length, color:"var(--n-400)"},
              {value:add.length, color:"var(--reach)"},
              {value:unsure.length, color:"var(--n-200)"}
            ], String(schools.filter(s=>s.mark!=="review").length), "Rows")}
            ${legend([
              {label:"Yes — US", value:yesUS.length, color:"var(--ink)"},
              {label:"Yes — UK parked", value:yesUK.length, color:"var(--n-400)"},
              {label:"add (OQ-04)", value:add.length, color:"var(--reach)"},
              {label:"unsure", value:unsure.length, color:"var(--n-200)"}
            ])}
          </div>
        </div>
        <div class="card">
          <div class="caption" style="margin-bottom:var(--s-4)">List Balance</div>
          ${bars([
            {label:"Reach", value:tiers.Reach, color:"var(--reach)"},
            {label:"Match", value:tiers.Match, color:"var(--match)"},
            {label:"Safety", value:tiers.Safety, color:"var(--safety)"}
          ])}
          <div class="label" style="margin-top:12px">Yes + add only · ${balance.length} schools · working classification, not official odds</div>
        </div>
        <div class="card">
          <div class="caption" style="margin-bottom:var(--s-4)">Tracked work</div>
          <div style="display:flex;justify-content:center">${donut([{value:planDone, color:"var(--ink)"},{value:planTot-planDone, color:"var(--n-200)"}], pct+"%", "Complete", 150, 18)}</div>
          <div class="label" style="text-align:center;margin-top:12px">${planDone} of ${planTot} vault tasks resolved · ${overdue.length} overdue</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">
          <h2>Deadlines</h2>
          <span class="label">Overdue &amp; upcoming, from the vault — not from a sample file</span>
        </div>
        ${deadlineItems.map(item => {
          const b = badge(item.due, false);
          return `<div class="row">
            <div class="accent" style="background:${item.overdue?"var(--ink)":"transparent"}"></div>
            <div class="daybox">
              <div class="n">${parse(item.due).getDate()}</div>
              <div class="caption" style="margin-top:2px">${mon(item.due)}</div>
            </div>
            <div class="grow">
              <div style="font-weight:600;font-size:15px">${esc(item.title)}</div>
              <div class="label">${esc(item.college === "General" ? "General" : item.college)}</div>
            </div>
            <span class="${b.cls}">${esc(b.rel)}</span>
          </div>`;
        }).join("")}
      </div>
      ${taskLists()}
    </div>`;
  }

  function taskLists() {
    const vis = t => state.owner === "all" || t.owner === state.owner;
    const open = DATA.tasks.filter(t => t.status !== "done" && vis(t));
    const over = open.filter(t => t.overdueFrom || daysUntil(t.due) < 0);
    const soon = open.filter(t => !over.includes(t) && t.status !== "blocked" && daysUntil(t.due) <= 14);
    const later = open.filter(t => !over.includes(t) && !soon.includes(t));
    const done = DATA.tasks.filter(t => t.status === "done" && vis(t));
    const owners = [["all","All"],["parent","Father"],["amogh","Amogh"]];
    function block(title, arr) {
      return `<div class="card">
        <div class="card-head"><h2>${title}</h2><span class="label">${arr.length}</span></div>
        ${arr.length ? arr.sort((a,b)=>parse(a.due)-parse(b.due)).map(taskRow).join("") :
          `<div class="label" style="padding:8px 0">Nothing here.</div>`}
      </div>`;
    }
    return `
      <div class="filters" style="align-items:center">
        <span class="caption">Owner</span>
        ${owners.map(([v,l]) => `<button class="chip" data-owner="${v}" aria-pressed="${state.owner===v}">${l}</button>`).join("")}
        <button class="chip" data-done="1" aria-pressed="${state.showDone}">${state.showDone?"Hide resolved":"Show resolved"}</button>
      </div>
      ${block("Overdue", over)}
      ${block("Next 14 days", soon)}
      ${block("Later & blocked", later)}
      ${state.showDone ? block("Resolved", done) : ""}`;
  }

  function taskRow(t) {
    const dd = daysUntil(t.due);
    const isOver = t.status !== "done" && (t.overdueFrom || dd < 0);
    const b = t.status === "done" ? {rel:"resolved", cls:"badge badge-done"}
      : t.status === "blocked" ? {rel:"blocked / parked", cls:"badge badge-ghost"}
      : isOver ? {rel:"overdue", cls:"badge badge-over"}
      : dd <= 7 ? {rel:"this week", cls:"badge badge-soon"}
      : {rel:"scheduled", cls:"badge badge-ghost"};
    const late = t.status === "done" ? "—"
      : isOver ? (t.overdueFrom ? Math.abs(daysUntil(t.overdueFrom))+"d late" : Math.abs(dd)+"d late")
      : "in "+dd+"d";
    return `<div class="row" style="align-items:flex-start">
      <div class="markbox ${t.status==="done"?"on":""}" aria-hidden="true"></div>
      <div class="grow">
        <div style="font-weight:600;font-size:14px${t.status==="done"?";text-decoration:line-through;color:var(--n-400)":""}">${esc(t.t)}${t.hard?' <span class="badge badge-over" style="margin-left:6px">hard cutoff</span>':""}</div>
        <div class="label" style="margin-top:4px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <span class="badge badge-ghost">${esc(ownerName(t.owner))}</span>
          <span class="${b.cls}">${b.rel}</span>
          <span class="mono" style="font-size:11px;color:var(--n-400)">${esc(t.id)}</span>
        </div>
        <div class="label" style="margin-top:4px;max-width:78ch">${esc(t.why||"")}</div>
      </div>
      <div style="text-align:right;white-space:nowrap">
        <div class="label">${fmt(t.due)}</div>
        <div style="font-size:12.5px;font-weight:650;font-variant-numeric:tabular-nums;color:${isOver?"var(--ink)":"var(--n-400)"}">${late}</div>
      </div>
    </div>`;
  }

  function renderApplications(schools) {
    const filters = ["All","Reach","Match","Safety","Yes","add","unsure","US","UK","Planning","Parked"];
    const list = schools.filter(s => {
      const f = state.filter;
      if (f === "All") return true;
      if (f === "Reach" || f === "Match" || f === "Safety") return s.tier === f;
      if (f === "Yes" || f === "add" || f === "unsure") return s.mark === f;
      if (f === "US" || f === "UK") return s.country === f;
      if (f === "Planning") return s.status === "Planning";
      if (f === "Parked") return s.status === "Parked";
      return true;
    });
    return `<div class="stack">
      <div class="note">${DATA.notes && DATA.notes.applications ? DATA.notes.applications : ""}</div>
      <div class="card">
        <div class="card-head">
          <h2>Applications</h2>
          <div class="filters">${filters.map(f =>
            `<button class="chip" data-filter="${f}" aria-pressed="${state.filter===f}">${f}</button>`
          ).join("")}</div>
        </div>
        <div class="listrow" style="border-top:0;padding-top:0;padding-bottom:8px">
          <div class="caption" style="flex:0 0 210px">College</div>
          <div class="caption grow">Current deliverable</div>
          <div class="caption" style="flex:0 0 150px">Progress</div>
          <div class="caption" style="flex:0 0 96px;text-align:right">Status</div>
        </div>
        ${list.map(s => {
          const cur = s._current;
          const dueBit = cur.due ? `Due ${dateLabel(cur.due)} · ${relLabel(daysUntil(cur.due))}` : (cur.note || "");
          return `<div class="listrow${s.parked?" dim":""}">
            <div style="flex:0 0 210px;min-width:170px">
              <div style="font-weight:700;font-size:15px"><span class="dot" style="background:${tierColor(s)}"></span>${esc(s.name)}</div>
              <div class="label">${esc(s.tier||s.mark)} · ${esc(s.sys)} · ${esc(s.loc)}</div>
            </div>
            <div class="grow" style="min-width:180px">
              <div style="font-weight:600;font-size:14px">${esc(cur.name)}</div>
              <div class="label">${esc(dueBit)}</div>
            </div>
            <div style="flex:0 0 150px;min-width:130px">
              <div class="bar-track" style="height:8px"><div class="bar-fill" style="width:${s._pct}%;background:${tierColor(s)}"></div></div>
              <div class="label" style="margin-top:4px">${s._done}/${s._total} complete</div>
            </div>
            <div style="flex:0 0 96px;text-align:right">
              <span class="${statusBadge(s.status)}">${esc(s.status)}</span>
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="card">
        <div class="card-head"><h2>School list detail</h2><span class="label">${list.length} shown</span></div>
        <div class="tbwrap"><table>
          <thead><tr>
            <th class="caption">School</th><th class="caption">Mark</th><th class="caption">Tier</th><th class="caption">System</th>
            <th class="caption">ChemE</th><th class="caption">Aero/Mech</th>
            <th class="caption">Test</th><th class="caption">Aid</th><th class="caption">Deadline</th>
          </tr></thead>
          <tbody>${list.map(s => `<tr${s.parked?' class="dim"':""}>
            <td><div style="font-weight:600">${esc(s.name)}</div><div class="label">${esc(s.loc)}${s.note?" · "+esc(s.note):""}</div></td>
            <td><span class="badge ${s.mark==="Yes"?"badge-ink":s.mark==="add"?"badge-soon":"badge-ghost"}">${esc(s.mark)}</span></td>
            <td><span class="dot" style="background:${tierColor(s)}"></span>${esc(s.tier||"—")}</td>
            <td>${esc(s.sys)}</td>
            <td class="num">${s.ce ?? "—"}</td>
            <td class="num">${s.am ?? "—"}</td>
            <td>${s.tp==="Required"?'<span class="badge badge-over">Required</span>':esc(s.tp)}</td>
            <td class="label">${esc(s.aid)}</td>
            <td class="label">${esc(s.deadlineLabel)}</td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>
    </div>`;
  }

  function planGantt() {
    const WK = PLAN_WEEKS;
    const wkDate = i => new Date(PLAN_BASE.getTime() + i * 7 * 86400000);
    const monthCells = [];
    for (let i = 0; i < WK; i++) {
      const d = wkDate(i), prev = i > 0 ? wkDate(i-1) : null;
      const show = !prev || prev.getMonth() !== d.getMonth();
      const lbl = show ? d.toLocaleDateString("en-US",{month:"short"}) + (d.getMonth()===0?" '27":"") : "";
      monthCells.push(`<div style="font-size:10px;font-weight:700;color:var(--n-500);white-space:nowrap;text-transform:uppercase;letter-spacing:.04em;border-left:${show?"1px solid var(--n-200)":"none"};padding-left:3px;height:14px">${lbl}</div>`);
    }
    const weekCells = [];
    for (let i = 0; i < WK; i++) {
      weekCells.push(`<div style="font-size:9px;font-weight:600;color:var(--n-400);text-align:center;font-variant-numeric:tabular-nums">${wkDate(i).getDate()}</div>`);
    }
    const rows = DATA.plan.map(r => {
      const cells = [];
      for (let w = 0; w < WK; w++) {
        let col = null, content = "";
        if (r.type === "section") col = C.tealLt;
        else if (r.type === "period") {
          if ((r.red||[]).includes(w)) col = C.red;
          else if ((r.amber||[]).includes(w)) col = C.amber;
        } else {
          if ((r.dark||[]).includes(w)) { col = C.dark; if (w === Math.min(...r.dark)) content = "★"; }
          else if ((r.blue||[]).includes(w)) col = C.blue;
          else if (FREEZE.includes(w)) col = C.red;
          else if ((r.type === "milestone" ? [17] : BREAK).includes(w)) col = C.amber;
        }
        cells.push(`<div class="plan-cell${r.type==="section"?" section":""}" style="background:${col||"#fff"}">${content}</div>`);
      }
      let lab;
      if (r.type === "section") lab = `<div class="plan-lab" style="font-weight:800;color:${C.teal};text-transform:uppercase;letter-spacing:.04em">${esc(r.label)}</div>`;
      else if (r.type === "period") lab = `<div class="plan-lab"><div><div style="font-weight:600">${esc(r.label)}</div><div class="label" style="font-size:10px">${esc(r.sub||"")}</div></div></div>`;
      else lab = `<div class="plan-lab">${r.type==="milestone"?'<span style="color:#C00000;font-weight:800">★</span>':""}<div style="min-width:0"><div style="font-weight:${r.type==="milestone"?700:600};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.label)}</div><div class="label" style="font-size:10px">${esc(r.status || ("Target "+dateLabel(r.target)))}</div></div></div>`;
      return `<div class="plan-row">${lab}<div class="plan-cells" style="grid-template-columns:repeat(${WK},1fr)">${cells.join("")}</div></div>`;
    }).join("");
    const today = parse(todayStr());
    const frac = (today - PLAN_BASE) / (86400000 * 7) / WK;
    const left = `calc(210px + (100% - 210px) * ${Math.max(0, Math.min(1, frac))})`;
    return `<div class="tl"><div class="plan">
      <div class="plan-row" style="border:0;align-items:end;margin-bottom:2px">
        <div class="plan-lab"></div>
        <div class="plan-cells" style="background:transparent;gap:0;grid-template-columns:repeat(${WK},1fr)">${monthCells.join("")}</div>
      </div>
      <div class="plan-row" style="border:0;margin-bottom:6px">
        <div class="plan-lab"></div>
        <div class="plan-cells" style="background:transparent;gap:1px;grid-template-columns:repeat(${WK},1fr)">${weekCells.join("")}</div>
      </div>
      ${rows}
      <div class="gantt-today" style="left:${left}"><div class="today-tag">Today</div></div>
    </div></div>`;
  }

  function renderProgress(schools) {
    const yes = schools.filter(s => s.mark === "Yes");
    const immediate = DATA.tasks
      .filter(t => t.status !== "done")
      .sort((a,b) => parse(a.due) - parse(b.due))
      .slice(0, 8);
    return `<div class="stack">
      <div class="card">
        <div class="card-head">
          <h2>Application Plan</h2>
          <span class="label">Class of 2027 · targets 2 weeks ahead of official deadlines</span>
        </div>
        ${planGantt()}
        <div class="legend-inline">
          <span class="label"><span style="width:14px;height:12px;border-radius:2px;background:#4472C4;display:inline-block"></span> Scheduled work</span>
          <span class="label"><span style="width:14px;height:12px;border-radius:2px;background:#FF6B6B;display:inline-block"></span> Exam freeze</span>
          <span class="label"><span style="width:14px;height:12px;border-radius:2px;background:#FFD966;display:inline-block"></span> School break</span>
          <span class="label"><span style="width:14px;height:12px;border-radius:2px;background:#C00000;display:inline-block"></span> ★ Submit target</span>
          <span class="label"><span style="width:2px;height:14px;background:var(--ink);display:inline-block"></span> Today</span>
        </div>
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--s-4)">Immediate Deliverables</h2>
        ${immediate.map(t => {
          const b = badge(t.due, false);
          return `<div class="row">
            <span class="${catClass(t.cat)}">${esc(t.cat)}</span>
            <div class="grow">
              <div style="font-weight:600;font-size:14px">${esc(t.t)}</div>
              <div class="label">${esc(ownerName(t.owner))} · ${esc(t.college)}</div>
            </div>
            <span class="${b.cls}">${esc(b.rel)}</span>
          </div>`;
        }).join("")}
      </div>
      <div class="grid-cards">${yes.map(s => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <h3><span class="dot" style="background:${tierColor(s)}"></span>${esc(s.name)}</h3>
              <div class="label">${esc(s.tier||"")} · ${esc(s.status)} · ${esc(s.sys)}</div>
            </div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:26px;line-height:1">${s._pct}%</div>
          </div>
          <div class="bar-track" style="height:8px;margin:12px 0 16px"><div class="bar-fill" style="width:${s._pct}%;background:${s.parked?"var(--n-400)":tierColor(s)}"></div></div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${s._deliv.map(d => `
              <div class="ms">
                <span class="markbox ${d.done?"on":""}"></span>
                <span style="font-size:13px" class="${d.done?"strike":""}">${esc(d.name)}</span>
                <span class="label" style="margin-left:auto">${d.due?dateLabel(d.due):"—"}</span>
              </div>`).join("")}
          </div>
        </div>`).join("")}</div>
    </div>`;
  }

  function pctSpan(s) {
    return ((parse(s) - T0) / (T1 - T0) * 100);
  }

  function renderLaneTimeline() {
    const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
    const cuts = DATA.events.filter(e => e.hard).sort((a,b) => parse(a.d) - parse(b.d));
    const rail = cuts.map(e => {
      const x = pctSpan(e.d);
      const parked = e.track === "uk";
      return `<div class="cutStem" data-x="${x}"></div>
        <div class="cutL${parked?" parked":""}" data-x="${x}" title="${esc(e.l)}">${esc(e.short||e.l)}</div>
        <div class="cut${parked?" parked":""}" style="left:${x}%"></div>`;
    }).join("");
    const lanes = DATA.lanes.map(L => {
      const bs = DATA.bands.filter(b => b.lane === L.k).map(b => {
        const l = pctSpan(b.s), w = Math.max(pctSpan(b.e) - l, 1.2);
        if (b.freeze) return `<div class="freeze" style="left:${l}%;width:${w}%"></div>
          <div class="band freeze" style="left:${l}%;width:${w}%">${esc(b.l)}</div>`;
        return `<div class="band" style="left:${l}%;width:${w}%;background:${L.c}">${esc(b.l)}</div>`;
      }).join("");
      const ms = DATA.events.filter(e => e.track === L.k && e.hard).map(e =>
        `<div class="mk" style="left:${pctSpan(e.d)}%" title="${esc(e.l)}"></div>`).join("");
      return `<div class="lane${L.parked?" parkedLane":""}">
        <div class="label"><span class="sw-sm" style="background:${L.c}"></span>${esc(L.n)}</div>
        <div class="track">${bs}${ms}</div>
      </div>`;
    }).join("");
    return `<div class="card">
      <div class="card-head"><h2>Aug 2026 → Mar 2027</h2><span class="label">Family plan lanes · hard cutoffs on the rail</span></div>
      <div class="note" style="margin-bottom:16px"><strong>All dates render in IST.</strong> UCAS runs on UK time (BST→GMT on 25 Oct 2026). College Board runs on US Eastern. A deadline read in the wrong zone is a lost application.</div>
      <div class="tl"><div class="tlinner">
        <div class="tlhead"><div></div><div class="months">${months.map(m=>`<div>${m}</div>`).join("")}</div></div>
        <div class="rail"><div class="railName">Hard cutoffs</div><div class="railTrack" id="rail">${rail}</div></div>
        ${lanes}
      </div></div>
      <div class="legend-inline">
        ${DATA.lanes.map(L => `<span class="label"><span class="sw-sm" style="background:${L.c}"></span>${esc(L.n)}</span>`).join("")}
        <span class="label"><span class="sw-sm" style="background:#c00000"></span>Hard cutoff</span>
      </div>
    </div>`;
  }

  function packRail() {
    const rail = document.getElementById("rail");
    if (!rail) return;
    const W = rail.clientWidth, GAP = 8, ROW = 17;
    if (!W) return;
    const right = [-1e9,-1e9,-1e9];
    const labels = [...rail.querySelectorAll(".cutL")];
    const stems = [...rail.querySelectorAll(".cutStem")];
    labels.forEach((el,i) => {
      const x = parseFloat(el.dataset.x)/100*W, w = el.offsetWidth;
      let t = 0;
      while (t < 2 && x - w/2 < right[t] + GAP) t++;
      right[t] = x + w/2;
      el.style.left = x + "px"; el.style.top = (t*ROW) + "px";
      stems[i].style.left = x + "px"; stems[i].style.top = (t*ROW + 13) + "px"; stems[i].style.bottom = "0";
    });
  }

  function eventsByDate() {
    const map = {};
    function push(ds, ev) { (map[ds] = map[ds] || []).push(ev); }
    DATA.tasks.forEach(t => {
      if (!t.due) return;
      push(t.due, {title:t.t, done:t.status==="done", overdue:t.status!=="done" && daysUntil(t.due)<0, track:t.college==="UK"?"uk":"us"});
    });
    DATA.events.forEach(e => {
      push(e.d, {title:e.short||e.l, done:false, overdue:daysUntil(e.d)<0, track:e.track, hard:e.hard});
    });
    return map;
  }

  function monthCalendar() {
    const y = state.calYear, m = state.calMonth;
    const startDay = new Date(y,m,1).getDay();
    const dim = new Date(y,m+1,0).getDate();
    const evs = eventsByDate();
    const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const cells = [];
    for (let i=0;i<startDay;i++) cells.push(`<div></div>`);
    for (let d=1; d<=dim; d++) {
      const ds = `${y}-${pad(m+1)}-${pad(d)}`;
      const list = evs[ds] || [];
      const isToday = ds === todayStr();
      const pills = list.slice(0,2).map(e => {
        let st;
        if (e.done) st = "background:var(--n-100);color:var(--n-400);text-decoration:line-through";
        else if (e.track==="uk") st = "background:var(--n-400);color:#fff";
        else if (e.hard || e.overdue) st = "background:var(--ink);color:#fff";
        else st = "background:#fff;color:var(--ink);border:1px solid var(--n-300)";
        return `<div class="pill-ev" style="${st}">${esc(e.title)}</div>`;
      });
      if (list.length > 2) pills.push(`<div class="label" style="font-size:10px;padding-left:3px">+${list.length-2}</div>`);
      cells.push(`<div class="cal-cell${isToday?" today":""}"><div class="cal-num">${d}</div>${pills.join("")}</div>`);
    }
    return `<div>
      <div class="cal-head">${wd.map(d=>`<div class="cal-wd">${d}</div>`).join("")}</div>
      <div class="cal-grid">${cells.join("")}</div>
    </div>`;
  }

  function renderCalendar() {
    const monthLabel = new Date(state.calYear, state.calMonth, 1).toLocaleDateString("en-US",{month:"long", year:"numeric"});
    const agenda = DATA.tasks.slice().sort((a,b) => parse(a.due)-parse(b.due)).map(t => {
      const b = badge(t.due, t.status==="done");
      return {t, b};
    });
    const dated = DATA.events.slice().sort((a,b)=>parse(a.d)-parse(b.d));
    return `<div class="stack">
      ${renderLaneTimeline()}
      <div style="display:flex;flex-wrap:wrap;gap:var(--s-4);align-items:start">
        <div class="card" style="flex:2 1 340px">
          <div class="card-head">
            <h2>${esc(monthLabel)}</h2>
            <div style="display:flex;gap:8px">
              <button class="navbtn" data-cal="-1" aria-label="Previous month">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button class="navbtn" data-cal="1" aria-label="Next month">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          ${monthCalendar()}
        </div>
        <div class="card" style="flex:1 1 260px">
          <h2 style="margin-bottom:4px">Agenda</h2>
          <span class="label">Vault tasks, chronological</span>
          <div style="margin-top:12px">${agenda.map(({t,b}) => `
            <div class="row">
              <div class="daybox" style="width:40px">
                <div class="n" style="font-size:16px${t.status==="done"?";color:var(--n-400)":""}">${parse(t.due).getDate()}</div>
                <div class="caption">${mon(t.due)}</div>
              </div>
              <div class="grow">
                <div style="font-weight:600;font-size:14px${t.status==="done"?";text-decoration:line-through;color:var(--n-400)":""}">${esc(t.t)}</div>
                <div class="label">${esc(ownerName(t.owner))}</div>
              </div>
              <span class="${b.cls}">${esc(b.rel)}</span>
            </div>`).join("")}</div>
        </div>
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--s-4)">Every dated item</h2>
        <div class="tbwrap"><table>
          <thead><tr>
            <th class="caption">Date (IST)</th><th class="caption">Days</th><th class="caption">Item</th>
            <th class="caption">Track</th><th class="caption">Authoritative time</th><th class="caption">Hard?</th>
          </tr></thead>
          <tbody>${dated.map(e => {
            const dd = daysUntil(e.d);
            const lane = (DATA.lanes.find(l => l.k===e.track)||{}).n || e.track;
            return `<tr${e.track==="uk"?' class="dim"':""}>
              <td class="num">${fmt(e.d)}</td>
              <td class="num">${dd<0?"past":"in "+dd+"d"}</td>
              <td>${esc(e.l)}${e.note?`<div class="label">${esc(e.note)}</div>`:""}</td>
              <td>${esc(lane)}</td>
              <td class="label">${esc(e.tz)}</td>
              <td>${e.hard?'<span class="badge badge-over">hard</span>':'<span class="badge badge-ghost">target</span>'}</td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
      </div>
    </div>`;
  }

  function renderPeople() {
    return `<div class="stack">
      <div class="note"><strong>Submitted is not received.</strong> The only column that counts is the last one. A recommender who agreed in August and never clicked the link is the commonest way an application goes silently incomplete — and nobody is notified. FERPA must be waived in Common App before invites will even enable.</div>
      <div class="card">
        <div class="card-head">
          <h2>People</h2>
          <span class="label">Ask is overdue since 15 Aug · names still TBD</span>
        </div>
        ${DATA.people.map(p => {
          const pct = p.req ? Math.round(p.sub/p.req*100) : 0;
          const b = p.nextDue ? badge(p.nextDue, false) : {rel:"No date", cls:"badge badge-ghost"};
          if (p.kind === "Optional" && !p.nextDue) { b.rel = "Decide per school"; b.cls = "badge badge-ghost"; }
          return `<div class="listrow">
            <div class="avatar">${esc(initials(p.name))}</div>
            <div style="flex:1 1 180px;min-width:0">
              <div style="font-weight:700;font-size:15px">${esc(p.name)}</div>
              <div class="label">${esc(p.role)} · ${esc(p.kind)}</div>
            </div>
            <div style="flex:1 1 200px;min-width:160px">
              <div class="bar-track" style="height:8px"><div class="bar-fill" style="width:${pct}%;background:var(--ink)"></div></div>
              <div class="label" style="margin-top:4px">${p.asked?"Asked":"Not asked"} · ${p.received?"portal shows received":"portal empty"}</div>
            </div>
            <span class="${b.cls}">${esc(b.rel)}</span>
          </div>`;
        }).join("")}
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--s-4)">Recommender checklist</h2>
        <div class="tbwrap"><table>
          <thead><tr>
            <th class="caption">Person</th><th class="caption">Role</th><th class="caption">Asked</th>
            <th class="caption">Agreed</th><th class="caption">Packet sent</th>
            <th class="caption">Invited</th><th class="caption">Portal shows received</th>
          </tr></thead>
          <tbody>${DATA.people.map(p => `<tr>
            <td style="font-weight:600">${esc(p.name)}</td>
            <td>${esc(p.role)}</td>
            <td>${p.asked?'<span class="badge badge-ink">yes</span>':(p.kind==="Optional"?'<span class="label">—</span>':'<span class="badge badge-over">overdue</span>')}</td>
            <td class="label">${p.agreed?"yes":"—"}</td>
            <td class="label">${p.packet?"yes":"—"}</td>
            <td class="label">${p.invited?"yes":"—"}</td>
            <td class="label">${p.received?"yes":"—"}</td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>
    </div>`;
  }

  function renderDocs() {
    const done = DATA.docs.filter(d => d.done).length;
    return `<div class="stack">
      <div class="card">
        <div class="card-head">
          <h2>Materials Needed</h2>
          <span class="label">From the family plan spreadsheet — gather before the first deadline</span>
        </div>
        <div class="tbwrap"><table>
          <thead><tr>
            <th class="caption">Item</th><th class="caption">From Whom</th>
            <th class="caption">Status</th><th class="caption">Due</th>
          </tr></thead>
          <tbody>${DATA.materials.map(m => {
            const b = badge(m.due, m.status==="Ready" || m.status==="Received");
            const ss = (m.status==="Ready"||m.status==="Received") ? "badge badge-ink"
              : m.status==="Not started" ? "badge badge-ghost" : "badge badge-soon";
            return `<tr>
              <td><div style="font-weight:600">${esc(m.item)}</div><div class="label">${esc(m.note)}</div></td>
              <td class="nowrap">${esc(m.from)}</td>
              <td><span class="${ss}">${esc(m.status)}</span></td>
              <td class="nowrap"><div style="font-weight:600">${m.due?dateLabel(m.due):"Before 1st deadline"}</div><span class="${b.cls}">${m.due?esc(b.rel):""}</span></td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head">
          <h2>Documents</h2>
          <span class="label">${done} of ${DATA.docs.length} ready</span>
        </div>
        ${DATA.docs.map(d => {
          const b = badge(d.due, d.done);
          return `<div class="listrow">
            <span class="markbox ${d.done?"on":""}"></span>
            <div class="grow" style="flex:1 1 220px">
              <div style="font-weight:600;font-size:15px" class="${d.done?"strike":""}">${esc(d.name)}</div>
              <div class="label">${esc(d.note)}</div>
            </div>
            <span class="cat cat-doc">${esc(d.kind)}</span>
            <span class="${b.cls}">${esc(b.rel)}</span>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function renderFinancial(schools) {
    if (DATA.PUBLIC) {
      return `<div class="note"><strong>Money tab hidden.</strong> Set PUBLIC to false in js/data.js to restore it. The SAT score and aid timeline are not on this copy.</div>`;
    }
    const sat = DATA.SAT_TOTAL;
    const satLabel = (sat == null || DATA.PUBLIC) ? (DATA.PUBLIC ? "on file" : "—") : String(sat);
    const satHint = DATA.PUBLIC ? "Private — see the vault" : (sat == null ? "Not recorded" : "Split still outstanding · MIT mid-50 1520–1580");
    const oos = schools.filter(s => s.aidCat === "oos").length;
    const fafsa = daysUntil("2026-10-01");
    const cats = [
      {label:"Full-need private", value:schools.filter(s=>s.aidCat==="full-need").length, color:"var(--ink)", hint:"Likely cheapest if the family has need"},
      {label:"OOS public", value:oos, color:"var(--reach)", hint:"Full freight, little need-based aid"},
      {label:"Merit-leaning private", value:schools.filter(s=>s.aidCat==="merit").length, color:"var(--match)", hint:"RPI, Northeastern, Rose-Hulman"},
      {label:"UK international", value:schools.filter(s=>s.aidCat==="uk").length, color:"var(--safety)", hint:"No UK student finance"}
    ];
    const kpis = [
      {value: fafsa, unit:"d", label:"Until FAFSA opens", hint:"1 Oct 2026 · 2025 tax year"},
      {value: "0/2", label:"FSA IDs created", hint:"Unblocked — SSN confirmed"},
      {value: "0/3", label:"Net price calculators", hint:"MIT · one OOS public · one mid private"},
      {value: satLabel, label:"SAT on record", hint: satHint}
    ];
    return `<div class="stack">
      <div class="note">${DATA.notes && DATA.notes.financial ? DATA.notes.financial : ""}</div>
      <div class="kpis">${kpis.map(k => `
        <div class="kpi">
          <div class="val">${esc(k.value)}${k.unit?`<span class="unit">${esc(k.unit)}</span>`:""}</div>
          <div class="caption" style="margin-top:8px">${esc(k.label)}</div>
          <div class="label" style="margin-top:4px">${esc(k.hint)}</div>
        </div>`).join("")}</div>
      <div class="card">
        <div class="card-head">
          <h2>List by aid structure</h2>
          <span class="label">Counts, not invented sticker prices</span>
        </div>
        ${bars(cats)}
        <div class="label" style="margin-top:16px">${cats.map(c => c.label+": "+c.hint).join(" · ")}</div>
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--s-4)">Financial aid timeline</h2>
        <div class="tbwrap"><table>
          <thead><tr>
            <th class="caption">Item</th><th class="caption">Opens / due</th>
            <th class="caption">Owner</th><th class="caption">Status</th><th class="caption">Note</th>
          </tr></thead>
          <tbody>${DATA.aid.map(a => `<tr>
            <td style="font-weight:600">${esc(a.i)}</td>
            <td>${esc(a.d)}</td>
            <td><span class="badge badge-ghost">${esc(ownerName(a.o))}</span></td>
            <td><span class="${finBadge(a.s)}">${esc(a.s)}</span></td>
            <td class="label">${esc(a.n)}</td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Open money questions</h2></div>
        ${DATA.oqs.filter(q => ["OQ-02","OQ-03","OQ-09","OQ-10"].includes(q.id)).map(q => `
          <div class="row"><div class="mono" style="font-size:12px;width:64px;flex-shrink:0">${q.id}</div><div>${esc(q.t)}</div></div>
        `).join("")}
      </div>
    </div>`;
  }

  function render() {
    const root = document.getElementById("app");
    if (!root) return;
    const schools = enrichSchools();
    let inner = "";
    if (state.page === "overview") inner = renderOverview(schools);
    else if (state.page === "applications") inner = renderApplications(schools);
    else if (state.page === "progress") inner = renderProgress(schools);
    else if (state.page === "calendar") inner = renderCalendar();
    else if (state.page === "people") inner = renderPeople();
    else if (state.page === "docs") inner = renderDocs();
    else if (state.page === "financial") inner = renderFinancial(schools);
    root.innerHTML = shell(inner);
    bind();
    if (state.page === "calendar") requestAnimationFrame(packRail);
  }

  function bind() {
    document.querySelectorAll("[data-filter]").forEach(el => {
      el.addEventListener("click", () => { state.filter = el.getAttribute("data-filter"); render(); });
    });
    document.querySelectorAll("[data-owner]").forEach(el => {
      el.addEventListener("click", () => { state.owner = el.getAttribute("data-owner"); render(); });
    });
    document.querySelectorAll("[data-done]").forEach(el => {
      el.addEventListener("click", () => { state.showDone = !state.showDone; render(); });
    });
    document.querySelectorAll("[data-cal]").forEach(el => {
      el.addEventListener("click", () => {
        let m = state.calMonth + Number(el.getAttribute("data-cal"));
        let y = state.calYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        state.calMonth = m; state.calYear = y;
        render();
      });
    });
    addEventListener("resize", () => { if (state.page === "calendar") packRail(); });
  }

  function boot() {
    const root = document.getElementById("app");
    state.page = (root && root.dataset.page) || "overview";
    const t = parse(todayStr());
    if (t) { state.calYear = t.getFullYear(); state.calMonth = t.getMonth(); }
    if (DATA.PUBLIC) {
      DATA.tasks.forEach(t => { if (t.why) t.why = t.why.replace(/1510/g, "the score on file"); });
    }
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
