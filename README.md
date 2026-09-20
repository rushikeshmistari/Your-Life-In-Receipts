# Life, In Receipts 🧾

> **One dataset. Hundreds of moments. One interactive story.**

Life, In Receipts is a frontend-only interactive data-storytelling experience built for the **Your Life, In Receipts** challenge. It transforms 162,588 fictional digital-life records into a guided, evidence-led narrative rather than a plain chronological timeline.

Late-night songs become a **Night Owl Era**, repeated household categories become **Daily Rituals**, and recurring artists become **Your Soundtrack**. Visitors can open supporting receipts to investigate every conclusion.

## Run the project

1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.

Use Live Server, not a `file:///` URL. The browser needs a local server to load the CSV and JSON files with `fetch()`.

## Challenge alignment

| Challenge requirement | How this project meets it |
| --- | --- |
| Explore life receipts | Searchable Receipt Explorer with mixed, Music, Household, and Purchases views |
| Meaningful navigation | Landing page, demo sign-in, dashboard, filters, story controls, and chapter shortcuts |
| Discover relationships | Repeated timestamps, categories, and artists become evidence-backed patterns |
| Interactive storytelling | Guided Story Mode: Archive, Night Owl Era, Daily Rituals, and Soundtrack |
| More than a timeline | Recurring behaviour is presented as narrative chapters, not monthly cards |
| Visual journey | Wine-red glass interface, ambient canvas, floating receipts, chapter progress, and evidence chips |
| Responsive design | CSS grid breakpoints support mobile, tablet, and desktop |

## The story method

The supplied files are treated as a **fictional composite archive**. The project does not claim every receipt belongs to one real person or that unrelated source files prove a single exact event.

Instead it uses an evidence-led method:

1. Load each dataset.
2. Count repeated values such as listening hour, artist, household category, and purchase category.
3. Display the real count and example evidence in a story chapter.
4. Let visitors open supporting records themselves.
5. Label broader cross-dataset connections as an interpretation.

This creates meaning without inventing false facts.

## Features

### Animated landing page

- Introduces the idea that small moments form one living story.
- Loads real dataset totals.
- Uses a Memory Thread to explain how disconnected records can become a chapter.
- Includes lightweight canvas colour orbs and floating receipt chips.

### Frontend-only sign-in

- Email sign-in flow.
- Demo Google-style account chooser with sample identities.
- “Create your story” dialog for a custom display name.
- The name is stored only in browser `localStorage` and appears in the dashboard greeting.
- No real account, backend, password validation, or remote storage exists.

### Live insight cards

- Total songs played.
- Most active listening hour.
- Household transaction count.
- Purchase record count.

### Guided Story Mode

1. **The Archive** — source groups and total record count.
2. **Night Owl Era** — music plays between midnight and 5 AM, plus a real late-night example.
3. **Daily Rituals** — most frequent household and purchase categories, clearly described as category-level interpretation.
4. **Your Soundtrack** — most frequent artist and a representative track.

Each frame has evidence chips, previous/next navigation, chapter selection, and an **Open supporting receipts** action.

### Interactive life chapters

- Night Owl Era
- Daily Rituals
- Your Soundtrack

Cards can be clicked or opened with Enter/Space. They reveal the pattern explanation, evidence trail, and a shortcut to relevant records.

### Receipt Explorer

- Search tracks, artists, merchants, categories, and visible receipt text.
- Filter by **All**, **Music**, **Household**, and **Purchases**.
- The All filter intentionally mixes all record types.
- Renders a small sample and a maximum of 12 cards at once for fast interaction.
- Receipt cards open with mouse click, Enter, or Space.
- Detail dialogs explain the record’s role in a category or pattern without making false event-level links.

### Visual design and responsiveness

- Wine-red, rose, gold, and plum colour system.
- Transparent glassmorphism panels and readable contrast.
- Floating background elements and canvas lighting.
- Single-column layouts on narrow screens.
- Animations respect the operating-system **Reduce Motion** preference.

## Dataset

| File | Used for |
| --- | --- |
| `data/spotify_history.csv` | Listening timestamps, tracks, artists, active hour, Night Owl chapter, Soundtrack chapter |
| `data/Daily Household Transactions.csv` | Household count and repeated routine categories |
| `data/Augmented_IndiaTransactMultiFacet2024.json` | Purchase count, purchase categories, merchants, and purchase cards |

Other supplied CSV, TSV, and XML variants remain in `data/` for reference. The dashboard reads only the three files above to remain focused and efficient.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Papa Parse CDN for CSV parsing
- Canvas API for ambient backgrounds
- Browser `localStorage` for the local demo name only

This is deliberately a **vanilla HTML/CSS/JavaScript** project, as permitted by the frontend-only constraint. TypeScript strict mode and framework components are not applicable. The code uses focused functions, strict mode where supported, defensive loading, safe DOM rendering, and separated files.

## Project structure

```text
life-in-receipts/
├── index.html                    # Landing page
├── login.html                    # Frontend-only demo sign-in
├── dashboard.html                # Story dashboard and explorer
├── README.md                     # Documentation
├── css/
│   ├── style.css                 # Landing page styles
│   ├── login.css                 # Login, dialogs, and animations
│   ├── dashboard.css             # Dashboard and Story Mode styles
│   ├── components.css            # Shared component styles
│   └── responsive.css            # Additional responsive rules
├── js/
│   ├── data-loader.js            # CSV/JSON fetch and validation
│   ├── receipt-analysis.js       # Top-level record count calculation
│   ├── main.js                   # Landing page data and animation
│   ├── auth-ui.js                # Demo sign-in and story creation
│   ├── dashboard.js              # Story derivation, filters, dialogs, animation
│   ├── navbar.js                 # Navigation behaviour
│   ├── animations.js             # Shared animation behaviour
│   ├── cursor.js                 # Optional custom cursor behaviour
│   └── three-bg.js               # Optional visual background behaviour
└── data/                         # Supplied fictional records
```

## Functional test checklist

1. Start `index.html` with Live Server.
2. Confirm the landing page changes from loading text to **162,588** records.
3. Select **Open your archive**.
4. Sign in with email, select a demo account, or create a story name.
5. Confirm the chosen name appears in the dashboard greeting.
6. Select **Read your story** and open all four story frames.
7. Select **Open supporting receipts** in each frame.
8. Test All, Music, Household, and Purchases filters.
9. Search for an artist, track, merchant, or category.
10. Open a receipt and close its dialog by button, outside click, or Escape.

## Responsive test checklist

Use browser developer tools at 375 px, 768 px, and 1280 px widths. Cards should become a readable single-column flow on mobile.

## Keyboard and accessibility checklist

- Tab reaches the Skip to story link, controls, filters, chapter cards, and receipt cards.
- Focused controls use a visible outline.
- Enter/Space opens chapter and receipt cards.
- Escape closes an open receipt dialog.
- `aria-live` announces loading/filter result status.
- Dialogs use `role="dialog"`, `aria-modal`, labels, and close controls.
- Decorative canvases are hidden from assistive technology.
- Reduced-motion CSS/JavaScript is supported.

## Code quality and architecture

- Clear separation of data loading, analysis, page behaviour, and page-specific CSS.
- Reusable helpers for number formatting, data sampling, filtering, escaping, story rendering, and modal controls.
- `data-loader.js` checks HTTP responses, validates JSON array structure, verifies the CSV parser, and reports parse errors.
- Large datasets are sampled before receipt-card rendering.
- Dynamic dataset text is inserted safely using `textContent` or HTML escaping.
- No framework runtime, backend, or build process is required.

## Security and privacy

- Static frontend with no backend attack surface.
- Restrictive Content Security Policy meta tags.
- Only Google Fonts and Papa Parse CDN are allowed where needed.
- No API keys, tracking, analytics, passwords, or external database.
- Dynamic dataset values are escaped before entering generated receipt-card HTML.
- Form values are local display data only; they are never transmitted.
- The sign-in screen is explicitly a frontend-only demo.

## Performance strategy

- No framework runtime or large component library.
- Page-specific CSS files avoid loading dashboard styling on the landing page.
- Google Fonts use `display=swap` and preconnect hints.
- Explorer samples the large source datasets and limits rendering to 12 cards.
- Canvas dimensions update only when the window resizes, not every animation frame.
- Animations use `requestAnimationFrame` and stop continuous motion for reduced-motion visitors.
- No large images, video, or backend requests.

## Limitations and future improvements

The available source groups do not provide shared IDs proving a song, household action, and purchase occurred in one real-world moment. The project therefore avoids fabricating event-level cross-dataset links.

With shared timestamps, locations, people, or event IDs, a future version could add a true relationship graph, map chapters, time-window clustering, photo/message/note/event receipts, and user-created annotations.

## Frontend-only constraint

All analysis runs inside the visitor’s browser. No backend implementation is used or required.

---

Built for the **Your Life, In Receipts** frontend hackathon challenge.
