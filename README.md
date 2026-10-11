# Terps Hoops Command 🏀

**Maryland Men’s Basketball command center for Boyd** (University of Maryland alum) — Tipoff HQ, interactive Court Board, Big Ten Desk, Lore Wall, and Fan Notes. Maryland red (`#E21833`) / gold / black chrome, XFINITY Center vibe, Big Ten framing.

Offline single-file HTML. **Never invents** box scores, rankings, or injury reports. Schedule and lineup cards are clearly labelled **EXAMPLE**.

* **Open:** double-click `dist/terps-hoops.html`, or `./run.sh` → http://127.0.0.1:4288/
* **Best screenshot:** `screenshots/00-best-home.png`

## Screens

1. **Tipoff HQ** — season hero, animated court lines + particle confetti, XFINITY Center cards
2. **Court Board** — interactive half-court SVG, EXAMPLE lineup dots 1–5, pick-and-roll drawings (localStorage)
3. **Big Ten Desk** — EXAMPLE conference slate + rivalry lore (Duke / UCLA / Virginia / Big Ten era)
4. **Lore Wall** — verified program history only (2002 title, XFINITY Center, Len Bias carefully, Big Ten 2014, Gary Williams, Fear the Turtle)
5. **Fan Notes** — localStorage notepad, watch-party checklist, links to umterps.com

Wall mode (🖥) for TV/display. Mobile-friendly tabs.

## Run

```
./run.sh            # build + serve :4288
./run.sh --test     # smoke test + serve
./run.sh --shots    # screenshots + serve
```

## Sources / citations

Style inspiration (read-only, not modified):

* `/workspace/tokenmax/ravens-gameday/` — scaffolding pattern
* `/workspace/tokenmax/terps-football/` — Maryland red/gold night-wall chrome
* `/workspace/tokenmax/terps-preview/` — Terps visual reference
* `/workspace/tokenmax/hornets-tactics/` — tactics-board interaction ideas

Public program facts used on Lore Wall (well-known, non-contested):

* 2002 NCAA Men’s Basketball national champions; Juan Dixon Final Four MOP; coach Gary Williams
* XFINITY Center (opened 2002 as Comcast Center), College Park, MD
* Maryland joined the Big Ten in 2014
* Len Bias: 1986 ACC Player of the Year; drafted #2 by Boston; died June 19, 1986 — presented respectfully as history
* Official athletics: [umterps.com](https://umterps.com/sports/mens-basketball)

No live ESPN/box feeds in this build. EXAMPLE slate is layout-only.

## Gaps

* Live schedule, roster, box scores, rankings, injuries: **not loaded**
* Rivalry cards are lore/context — not series trackers
* Court Board lineup is EXAMPLE numbers only (no real jersey claims)
* Contested or unclear historical claims were skipped

Port **4288** · binds 127.0.0.1 only · no CDN / analytics · not affiliated with UMD or the Big Ten.


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/terps-hoops` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
