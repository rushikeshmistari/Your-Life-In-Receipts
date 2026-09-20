# Life, In Receipts

A frontend-only interactive data-story experience built with HTML, CSS, and JavaScript. It turns a large set of supplied fictional receipts into patterns a visitor can read, test, and explore.

## Run the project

Open the project folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.

Do not open the HTML files by double-clicking them. The dashboard loads CSV and JSON data through `fetch`, which needs a local server.

## Main pages

- `index.html` — animated introduction and dataset overview
- `login.html` — demo sign-in and account-selection screen
- `dashboard.html` — live insights, Guided Story Mode, interactive chapters, filters, search, receipt details, and the receipt explorer

## Experience features

- **Guided Story Mode** turns data into four readable frames: archive overview, night listening, everyday routines, and recurring music.
- **Evidence-led chapters** use counts, favorite categories, listening hours, artists, and examples drawn from the supplied records.
- **Receipt Explorer** offers search plus All, Music, Household, and Purchases filters. Selecting a card opens its details and explains why that record belongs to its category.
- **Responsive glass interface** works from mobile to desktop, supports keyboard focus, includes a skip link, live loading status, and respects reduced-motion preferences.

## Data interpretation

The supplied files are treated as a fictional composite archive. The site only makes direct numeric claims within the relevant dataset. Broader connections are presented as an **interpretation** of repeated behaviors, so the interface encourages discovery without pretending unrelated source files prove a real person’s exact life events.

## Project structure

- `js/data-loader.js` — loads the CSV and JSON files
- `js/receipt-analysis.js` — produces top-level counts
- `js/dashboard.js` — derives patterns, renders story interactions, filters, dialogs, and animated background
- `css/dashboard.css` — dashboard layout, glass design, responsive rules, focus states, and motion settings

## Dataset files

Keep all supplied files inside the `data/` folder. The website uses:

- `spotify_history.csv`
- `Daily Household Transactions.csv`
- `Augmented_IndiaTransactMultiFacet2024.json`

## Important note

The sign-in flow is a frontend-only demonstration. It does not create or store real accounts.
