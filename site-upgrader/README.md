# Site Upgrader

A CLI project that:

1. Takes a website URL.
2. Downloads a static copy of the page and its assets.
3. Applies safe, automated quality improvements.
4. Exports an improved version you can deploy or edit.

## Important Legal Note

Only use this on websites you own or have explicit permission to copy and modify.

## Features

- Downloads a website snapshot into `output/original`.
- Creates an improved version in `output/improved`.
- Auto-improvements include:
  - Missing `lang` and viewport metadata.
  - Better image defaults (`loading="lazy"`, `decoding="async"`, fallback alt text).
  - Deferred local scripts when safe.
  - CSS minification.
  - HTML minification.
  - Injected enhancement stylesheet for spacing, typography, and media responsiveness.

## Setup

```bash
cd site-upgrader
npm install
```

## Usage

```bash
npm start -- --url https://example.com
```

Choose visual mode:

```bash
npm start -- --url https://example.com --mode aggressive
```

Mode options:

- `balanced`: Safer visual polish.
- `aggressive`: Stronger redesign styling and component overrides.

## Web App

Run as a website application:

```bash
npm run web
```

Open:

- http://localhost:3000

From the UI, enter:

- Website URL
- Project name
- Crawl depth (1-5)
- Visual mode (balanced or aggressive)

The app calls `POST /api/upgrade` and returns paths for the generated output and report.

Optional flags:

```bash
npm start -- --url https://example.com --out ./output --project my-improved-site --depth 2
```

## Output

- Original downloaded source: `output/original`
- Improved export: `output/improved`
- Report file: `output/report.json`

## Example

```bash
npm start -- --url https://example.com --out ./output --project launch-v2
```

Then open:

- `output/improved/index.html`

## Limitations

- This is designed for static export workflows.
- Highly dynamic apps (heavy JS routing, authenticated pages) may need custom crawler logic.
- "Better" is rule-based by default; you can add custom transforms in `src/improve.js`.
