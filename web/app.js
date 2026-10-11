/* Terps Hoops Command — offline fan HQ. No invented box scores / rankings / injuries. */
(function () {
  "use strict";

  const LS_NOTES = "terps-hoops:notes:v1";
  const LS_CHECK = "terps-hoops:checklist:v1";
  const LS_DRAW = "terps-hoops:drawings:v1";
  const LS_POS = "terps-hoops:positions:v1";

  const EXAMPLE_SLATE = [
    { when: "EXAMPLE · Fri Nov 7", vs: "vs EXAMPLE Rival A", meta: "XFINITY Center · tip TBA" },
    { when: "EXAMPLE · Tue Nov 11", vs: "vs EXAMPLE Rival B", meta: "XFINITY Center · tip TBA" },
    { when: "EXAMPLE · Sat Nov 15", vs: "@ EXAMPLE Road Spot", meta: "Away · tip TBA" },
    { when: "EXAMPLE · Wed Dec 3", vs: "vs EXAMPLE Non-conf", meta: "XFINITY Center · tip TBA" },
    { when: "EXAMPLE · Sat Jan 10", vs: "vs EXAMPLE Big Ten", meta: "Conference · tip TBA" },
    { when: "EXAMPLE · Thu Jan 22", vs: "@ EXAMPLE Big Ten", meta: "Conference road · tip TBA" }
  ];

  const LINEUP = [
    { n: 1, role: "Point · EXAMPLE", x: 250, y: 300 },
    { n: 2, role: "Wing · EXAMPLE", x: 120, y: 250 },
    { n: 3, role: "Wing · EXAMPLE", x: 380, y: 250 },
    { n: 4, role: "Forward · EXAMPLE", x: 180, y: 160 },
    { n: 5, role: "Big · EXAMPLE", x: 250, y: 120 }
  ];

  const RIVALS = [
    {
      id: "duke",
      label: "Duke",
      title: "Maryland–Duke (ACC-era lore)",
      body: "For decades Maryland and Duke were ACC rivals with electric College Park and Cameron nights. The Terps left the ACC for the Big Ten in 2014, so the series is no longer a yearly conference fixture — but the history still lives in fan memory. This card is lore only: no invented 2026 scores."
    },
    {
      id: "ucla",
      label: "UCLA",
      title: "Maryland–UCLA (national stage)",
      body: "UCLA’s basketball tradition and Maryland’s 2002 title run sit on the same NCAA Mount Rushmore conversations fans love to argue. Any modern matchup is a national-TV treat, not a standing rivalry slate. Lore framing only — no fake box scores here."
    },
    {
      id: "virginia",
      label: "Virginia",
      title: "Maryland–Virginia (Commonwealth neighbors)",
      body: "Geographic neighbors with deep ACC history. Post-realignment, meetings are rarer, but the regional edge remains part of Terps lore. Presented as history/context — not a live series tracker."
    },
    {
      id: "b1g",
      label: "Big Ten foes",
      title: "Big Ten era (since 2014)",
      body: "Since joining the Big Ten in 2014, Maryland’s primary conference road map runs through the Midwest: long bus/plane trips, hostile student sections, and February gauntlets. Home nights at XFINITY remain the identity center. No standings or invented records on this desk."
    }
  ];

  const LORE = [
    {
      year: "2002",
      title: "National Champions",
      text: "Maryland won the NCAA Men’s Basketball national title in 2002, defeating Indiana in the final. Juan Dixon was named Final Four Most Outstanding Player. Coach Gary Williams led the program to the mountaintop.",
      careful: false
    },
    {
      year: "2002",
      title: "XFINITY Center opens",
      text: "The Terps’ home arena in College Park opened in 2002 as Comcast Center and was later renamed XFINITY Center. It remains the loud red-and-gold fortress for Maryland basketball.",
      careful: false
    },
    {
      year: "1986",
      title: "Len Bias — remembered carefully",
      text: "Len Bias was a Maryland All-American and the 1986 ACC Player of the Year, selected second overall by the Boston Celtics. He died of a cocaine overdose on June 19, 1986, two days after the draft. His story is told here with respect: talent, tragedy, and a lasting mark on college athletics and drug-awareness culture — not spectacle.",
      careful: true
    },
    {
      year: "2014",
      title: "Big Ten arrival",
      text: "Maryland joined the Big Ten Conference in 2014 after decades in the ACC. The move reshaped travel, recruiting footprints, and the annual slate while College Park stayed home.",
      careful: false
    },
    {
      year: "Identity",
      title: "Fear the Turtle",
      text: "The Terrapins nickname, Testudo the mascot, and Maryland red (#E21833) with gold and black form one of college sports’ most distinctive visual brands. Fans still chant Fear the Turtle.",
      careful: false
    },
    {
      year: "Gary Williams",
      title: "Hall of Fame coach",
      text: "Gary Williams coached Maryland to the 2002 title and is widely credited with restoring and elevating the program. He is a Naismith Memorial Basketball Hall of Fame inductee.",
      careful: false
    }
  ];

  const DEFAULT_CHECK = [
    { id: "tv", label: "Confirm TV / stream channel" },
    { id: "snacks", label: "Snacks & drinks ready" },
    { id: "couch", label: "Couch / wall-mode seating" },
    { id: "mute", label: "Phone on vibrate for tipoff" },
    { id: "chat", label: "Group chat open (optional)" },
    { id: "notes", label: "Fan notes jot pad handy" }
  ];

  /* ---------- utils ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => { t.hidden = true; }, 2200);
  }

  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  }
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  /* ---------- tabs / wall / help ---------- */
  function setTab(id) {
    $$(".tab").forEach((b) => {
      const on = b.dataset.tab === id;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".panel").forEach((p) => {
      const on = p.id === "panel-" + id;
      p.classList.toggle("on", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    if (id === "court") requestAnimationFrame(() => renderCourt());
  }

  $$(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.goto)));
  $("#btnWall").addEventListener("click", () => {
    document.body.classList.toggle("wall");
    toast(document.body.classList.contains("wall") ? "Wall mode on — tap Wall again to exit" : "Wall mode off");
  });
  $("#btnHelp").addEventListener("click", () => $("#helpDlg").showModal());

  /* ---------- particle / court-line confetti canvas ---------- */
  (function particles() {
    const c = $("#bg");
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, parts = [], t0 = performance.now();

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    function spawnBurst() {
      for (let i = 0; i < 60; i++) {
        parts.push({
          x: w * 0.5 + (Math.random() - 0.5) * 80,
          y: h * 0.22,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * -4 - 1,
          g: 0.06 + Math.random() * 0.04,
          life: 1,
          decay: 0.008 + Math.random() * 0.01,
          color: Math.random() > 0.45 ? "#E21833" : "#FFD200",
          r: 2 + Math.random() * 3
        });
      }
    }
    function tick(now) {
      const dt = Math.min(32, now - t0); t0 = now;
      ctx.clearRect(0, 0, w, h);
      // soft floating court dust
      for (let i = 0; i < 28; i++) {
        const x = (i * 97 + now * 0.01) % w;
        const y = (i * 53 + now * 0.006) % h;
        ctx.fillStyle = i % 2 ? "rgba(255,210,0,0.06)" : "rgba(226,24,51,0.05)";
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(tick);
    }
    window.addEventListener("resize", resize);
    resize();
    spawnBurst();
    setTimeout(spawnBurst, 900);
    requestAnimationFrame(tick);
  })();

  /* ---------- tipoff / b1g slates ---------- */
  function renderSlate(el, items) {
    el.innerHTML = items.map((g) => `
      <article class="slate-card">
        <div class="when">${g.when}</div>
        <div class="vs">${g.vs}</div>
        <div class="meta">${g.meta}</div>
      </article>`).join("");
  }
  renderSlate($("#tipoffSlate"), EXAMPLE_SLATE.slice(0, 4));
  renderSlate($("#b1gSlate"), EXAMPLE_SLATE);

  /* ---------- rivalries ---------- */
  const rivalTabs = $("#rivalTabs");
  const rivalBody = $("#rivalBody");
  function showRival(id) {
    const r = RIVALS.find((x) => x.id === id) || RIVALS[0];
    $$("button", rivalTabs).forEach((b) => b.classList.toggle("on", b.dataset.id === r.id));
    rivalBody.innerHTML = `<h4>${r.title}</h4><p>${r.body}</p><p class="note">Lore only · no fake 2026 scores</p>`;
  }
  rivalTabs.innerHTML = RIVALS.map((r, i) =>
    `<button type="button" data-id="${r.id}" class="${i === 0 ? "on" : ""}">${r.label}</button>`
  ).join("");
  rivalTabs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-id]");
    if (b) showRival(b.dataset.id);
  });
  showRival("duke");

  /* ---------- lore wall ---------- */
  $("#loreGrid").innerHTML = LORE.map((L) => `
    <article class="lore-card${L.careful ? " careful" : ""}">
      <div class="lore-year">${L.year}</div>
      <h3>${L.title}</h3>
      <p>${L.text}</p>
    </article>`).join("");

  /* ---------- fan notes + checklist ---------- */
  const notesEl = $("#fanNotes");
  notesEl.value = loadJSON(LS_NOTES, "") || (typeof loadJSON(LS_NOTES, "") === "string" ? loadJSON(LS_NOTES, "") : "");
  try {
    const n = localStorage.getItem(LS_NOTES);
    if (n !== null) {
      try { notesEl.value = JSON.parse(n); } catch (_) { notesEl.value = n; }
    }
  } catch (e) {}

  $("#btnSaveNotes").addEventListener("click", () => {
    try { localStorage.setItem(LS_NOTES, JSON.stringify(notesEl.value)); } catch (e) {}
    $("#notesStatus").textContent = "Saved locally";
    toast("Notes saved");
    setTimeout(() => { $("#notesStatus").textContent = ""; }, 2000);
  });
  $("#btnClearNotes").addEventListener("click", () => {
    notesEl.value = "";
    try { localStorage.removeItem(LS_NOTES); } catch (e) {}
    toast("Notes cleared");
  });

  function renderCheck() {
    const state = loadJSON(LS_CHECK, {});
    const ul = $("#watchList");
    ul.innerHTML = DEFAULT_CHECK.map((c) => {
      const done = !!state[c.id];
      return `<li class="${done ? "done" : ""}">
        <input type="checkbox" data-id="${c.id}" ${done ? "checked" : ""}>
        <span>${c.label}</span>
      </li>`;
    }).join("");
  }
  $("#watchList").addEventListener("change", (e) => {
    const inp = e.target;
    if (inp.matches("input[type=checkbox]")) {
      const state = loadJSON(LS_CHECK, {});
      state[inp.dataset.id] = inp.checked;
      saveJSON(LS_CHECK, state);
      renderCheck();
    }
  });
  $("#btnResetCheck").addEventListener("click", () => {
    saveJSON(LS_CHECK, {});
    renderCheck();
    toast("Checklist reset");
  });
  renderCheck();

  /* ---------- court board ---------- */
  let players = loadJSON(LS_POS, null);
  if (!Array.isArray(players) || players.length !== 5) {
    players = LINEUP.map((p) => ({ ...p }));
  }
  let drawings = loadJSON(LS_DRAW, []);
  if (!Array.isArray(drawings)) drawings = [];
  let tool = "move";
  let drag = null;
  let draft = null;

  const svg = $("#courtSvg");
  const playerLayer = $("#playerLayer");
  const drawLayer = $("#drawLayer");

  function persistCourt() {
    saveJSON(LS_POS, players);
    saveJSON(LS_DRAW, drawings);
  }

  function renderLineupList() {
    $("#lineupList").innerHTML = players
      .slice()
      .sort((a, b) => a.n - b.n)
      .map((p) => `<li><span class="dot-num">${p.n}</span><span>${p.role}</span></li>`)
      .join("");
  }

  function renderCourt() {
    playerLayer.innerHTML = players.map((p) => `
      <g class="player-dot" data-n="${p.n}" transform="translate(${p.x},${p.y})">
        <circle r="18" fill="#E21833" stroke="#FFD200" stroke-width="3"/>
        <text text-anchor="middle" dy="5" fill="#fff" font-size="14" font-weight="800" font-family="system-ui,sans-serif">${p.n}</text>
      </g>`).join("");

    drawLayer.innerHTML = drawings.map((d, i) => {
      if (d.type === "arrow") {
        return `<line data-i="${i}" x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"
          stroke="#FFD200" stroke-width="3" marker-end="url(#arrowHead)" opacity="0.9"/>`;
      }
      if (d.type === "dash") {
        return `<line data-i="${i}" x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"
          stroke="#FFD200" stroke-width="2.5" stroke-dasharray="8 6" marker-end="url(#arrowHead)" opacity="0.75"/>`;
      }
      return "";
    }).join("");
    if (draft) {
      drawLayer.innerHTML += `<line x1="${draft.x1}" y1="${draft.y1}" x2="${draft.x2}" y2="${draft.y2}"
        stroke="#ffe566" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#arrowHead)" opacity="0.85"/>`;
    }
    renderLineupList();
  }

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    const e = evt.touches ? evt.touches[0] : evt;
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  function setTool(t) {
    tool = t;
    $$(".court-tools .tool").forEach((b) => b.classList.toggle("on", b.dataset.tool === t));
    svg.classList.toggle("mode-move", t === "move");
  }
  $$(".court-tools .tool").forEach((b) => b.addEventListener("click", () => setTool(b.dataset.tool)));

  function onDown(evt) {
    evt.preventDefault();
    const p = svgPoint(evt);
    if (tool === "move") {
      const hit = players.find((pl) => Math.hypot(pl.x - p.x, pl.y - p.y) < 22);
      if (hit) drag = { n: hit.n, ox: p.x - hit.x, oy: p.y - hit.y };
    } else if (tool === "draw") {
      draft = { type: "arrow", x1: p.x, y1: p.y, x2: p.x, y2: p.y };
    } else if (tool === "erase") {
      if (drawings.length) {
        drawings.pop();
        persistCourt();
        renderCourt();
        toast("Erased last stroke");
      }
    }
  }
  function onMove(evt) {
    if (!drag && !draft) return;
    evt.preventDefault();
    const p = svgPoint(evt);
    if (drag) {
      const pl = players.find((x) => x.n === drag.n);
      if (pl) {
        pl.x = Math.max(30, Math.min(470, p.x - drag.ox));
        pl.y = Math.max(40, Math.min(450, p.y - drag.oy));
        renderCourt();
      }
    } else if (draft) {
      draft.x2 = p.x; draft.y2 = p.y;
      renderCourt();
    }
  }
  function onUp() {
    if (draft) {
      const len = Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1);
      if (len > 12) drawings.push({ ...draft });
      draft = null;
      persistCourt();
      renderCourt();
    }
    if (drag) {
      drag = null;
      persistCourt();
    }
  }
  svg.addEventListener("mousedown", onDown);
  svg.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  svg.addEventListener("touchstart", onDown, { passive: false });
  svg.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);

  $("#btnClearDraw").addEventListener("click", () => {
    drawings = [];
    persistCourt();
    renderCourt();
    toast("Drawings cleared");
  });
  $("#btnResetLineup").addEventListener("click", () => {
    players = LINEUP.map((p) => ({ ...p }));
    persistCourt();
    renderCourt();
    toast("EXAMPLE lineup reset");
  });

  function stampArrows(arr) {
    drawings = drawings.concat(arr);
    persistCourt();
    renderCourt();
  }
  $("#btnPnR").addEventListener("click", () => {
    stampArrows([
      { type: "dash", x1: 250, y1: 300, x2: 250, y2: 200 },
      { type: "arrow", x1: 180, y1: 160, x2: 250, y2: 175 },
      { type: "arrow", x1: 250, y1: 200, x2: 320, y2: 140 }
    ]);
    toast("Pick-and-roll stamp added");
  });
  $("#btnHorn").addEventListener("click", () => {
    stampArrows([
      { type: "dash", x1: 180, y1: 160, x2: 140, y2: 100 },
      { type: "dash", x1: 320, y1: 160, x2: 360, y2: 100 },
      { type: "arrow", x1: 250, y1: 300, x2: 200, y2: 220 }
    ]);
    toast("Horns entry stamped");
  });
  $("#btnFloppy").addEventListener("click", () => {
    stampArrows([
      { type: "dash", x1: 120, y1: 250, x2: 200, y2: 80 },
      { type: "arrow", x1: 380, y1: 250, x2: 300, y2: 90 }
    ]);
    toast("Floppy cut stamped");
  });

  setTool("move");
  renderCourt();

  /* ---------- expose for smoke / screenshots ---------- */
  window.TerpsHoops = {
    setTab,
    version: "1.0.0",
    port: 4288,
    screens: ["tipoff", "court", "b1g", "lore", "notes"]
  };
})();
