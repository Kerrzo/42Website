# 42 Interactive Website

Website for 42 Interactive based on the Figma design.

## Getting Started

### Prerequisites
- Node.js (for using the Node dev server)
- Or Python 3 (for using Python's `http.server`)

### Running Locally

#### Option 1: Using the start script (Windows)
```bash
cd scripts
start.bat
```
Then open `http://localhost:3000/about.html` in your browser.

#### Option 2: Using Node.js directly
```bash
npm start
```
Then open `http://localhost:3000/about.html` in your browser.

#### Option 3: Using Python
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```
Then open `http://localhost:3000/about.html` in your browser.

### Pages
- `index.html` – Homepage (What We Do)
- `about.html` – About / Who We Are
- `work/amica.html` – Amica case study page

## Project Structure (high level)

```text
42web/
├── index.html
├── about.html
├── work/
│   └── amica.html
├── css/
│   ├── styles.css      # Main site styles & grid system
│   └── amica.css       # Amica work-page styles
├── js/
│   ├── main.js         # Core interactions & animations
│   ├── header.js
│   ├── stars-background.js
│   └── … (supporting scripts)
├── images/
│   ├── crew/
│   ├── logos/
│   └── work/
├── data/
│   └── podcasts.json   # Source for dynamic podcasts/videos
├── scripts/
│   ├── server.js
│   └── start.bat
├── docs/
│   └── …               # All project markdown docs
└── package.json
```

## Grid System – Quick Reference

The site uses a 3‑column responsive grid:

```css
:root {
  --page-margin: 100px; /* desktop, reduced on tablet/mobile */
  --column-gap: 40px;
  --max-width: 1440px;
}
```

See `docs/GRID-TEMPLATE.md` for full details.

## Notes
- Design is based on the “42 Interactive Website” Figma file.
- Fonts loaded via Google Fonts: **Montserrat** and **Inter**.
- All images are served from the `images/` tree; requirements are documented in `docs/IMAGES-ASSETS.md`.



