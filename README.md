# 42 Interactive Website

Website for 42 Interactive based on Figma design.

## Getting Started

### Prerequisites
- Node.js (for using http-server)
- Or Python 3 (for using Python's http.server)

### Running Locally

#### Option 1: Using the start script (Windows)
```bash
cd scripts
start.bat
```
Then open http://localhost:3000/about.html in your browser.

### Option 2: Using Node.js directly
```bash
npm start
```
Then open http://localhost:3000/about.html in your browser.

#### Option 3: Using Python
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```
Then open http://localhost:3000/about.html in your browser.

### Pages
- `index.html` - Homepage (placeholder)
- `about.html` - About/Who We Are page (main implementation)

## Project Structure
```
42web/
├── index.html              # Homepage
├── about.html              # About/Who We Are page
├── css/
│   └── styles.css          # Main stylesheet with 3-column grid system
├── js/
│   └── main.js             # Interactive features & carousel
├── scripts/
│   ├── server.js           # Node.js development server
│   └── start.bat           # Windows start script
├── images/
│   ├── crew/               # Team member photos (15 images)
│   ├── *.png               # Podcast and section images
│   └── *.svg               # Logos and social icons
├── package.json            # Node.js dependencies
├── GRID-TEMPLATE.md        # Grid system documentation
└── README.md               # This file
```

## Grid System

The website uses a **3-column responsive grid system**:

### Desktop (> 768px)
- **3 equal columns** with 40px gap
- **100px left/right margins**
- **1440px maximum width**

### Mobile (≤ 768px)
- **Collapses to 1 column**
- **40px margins** (20px on very small screens)

### CSS Variables
```css
--page-margin: 100px;   /* Responsive: 100px → 60px → 40px → 20px */
--column-gap: 40px;     /* Responsive: 40px → 30px → 20px */
--max-width: 1440px;    /* Maximum page width */
```

See **GRID-TEMPLATE.md** for detailed documentation and usage examples.

## Features
- ✅ 3-column responsive grid layout
- ✅ Auto-scrolling crew carousel (2 rows, 60s duration)
- ✅ Smooth animations and transitions
- ✅ Mobile-first responsive design
- ✅ Golden ratio typography system
- ✅ Interactive hover effects

## Notes
- Design based on Figma mockup for "Who We Are" page
- Fonts loaded from Google Fonts (Montserrat and Inter)
- All images optimized and organized in `/images` folder

