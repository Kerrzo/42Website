# Image & Asset Documentation

This file consolidates the image/asset requirements that were previously stored in
`images/README.md`, `images/work/README.md` and `images/logos/README.md`.

---

## Global Image Assets

The Figma design includes a large number of images (logos, social icons, gallery photos,
podcast thumbnails, blog artwork, technology section images, etc.).

### How to Get Images from Figma

**Option 1 – Export from Figma (recommended)**

1. Open the Figma design:  
   `https://www.figma.com/design/yIX2cPHDvSl4R5M4iK9HkO/42-Interactive-Website`
2. Select each image/asset in the design.
3. Right‑click → **Export** → choose format:
   - PNG for photos
   - SVG for logos/icons
4. Save to the `images/` folder (see structure below).

**Option 2 – Figma API**

Use the Figma API or the provided helper script (`scripts/download-figma-assets.js`) to
download assets programmatically.

### Recommended Naming Conventions

- Logos: `logo-[name].svg`
- Icons: `icon-[name].svg`
- Photos: `[section]-[description]-[number].jpg`
- Use lowercase with hyphens.

### Example HTML usage

```html
<img src="images/logo-42i-landscape.svg" alt="42 Interactive Logo">
```

---

## Work Portfolio Images (`images/work/`)

Images used on the homepage “What We Do” section and case-study tiles.

Required images (from the original `images/work/README.md`):

1. **work-1.jpg** – Building Restaurants of The Future  
   - Figma: `image 36` (image36) – red‑tinted restaurant interior.
2. **work-2.jpg** – A Brand That Feels Like a Friend  
   - Figma: `Screenshot 2024-05-23` – mobile app interface with purple overlay.
3. **work-3.jpg** – Connecting People to workplace  
   - Figma: `Rectangle 3` with `happy_young_asian_woman_celebrating` – woman with phone + app.
4. **work-4.jpg** – Putting the Intelligence in AI  
   - Figma: `ComfyUI_00311_` – AI / tech imagery.
5. **work-5.jpg** – The Magic of Theatre at home  
   - Figma: `Google-VR-mockup 1` – VR headset mockup.
6. **work-6.jpg** – A Better Way to Manage Pain  
   - Figma: `international-towers` – building / architecture with blue tint.
7. **work-7.jpg** – Immortalising Creativity  
   - Figma: `02.19.2025_16.12.28 1` – creative / art installation.
8. **work-8.jpg** – Bringing Art To Life  
   - Figma: `image 56` – art / gallery imagery.
9. **work-9.jpg** – Bringing Products to Life  
   - Figma: `IMG_4776 1` – product photography.

**Specs**

- Format: JPG or PNG  
- Size: ~400×400px (circular mask applied via CSS)  
- Aspect ratio: square or landscape  
- Quality: high‑resolution web assets

**Workflow**

1. Export from Figma node `6726:10284`.
2. Name according to the list above.
3. Place in `images/work/`.
4. Homepage work grid will automatically pick them up.

---

## Client Logos (`images/logos/`)

Logos displayed in the homepage client grid.

### Required Logos

**Row 1**

1. `logo-international-towers.png` – International Towers Sydney  
2. `logo-catholic-healthcare.png` – Catholic Healthcare  
3. `logo-loanoptions.png` – LoanOptions.ai  
4. `logo-cushman-wakefield.svg` – Cushman &amp; Wakefield  
5. `logo-craveable-brands.svg` – Craveable Brands  
6. `logo-jn-projects.png` – JN Projects

**Row 2**

7. `logo-gordon-podiatry.png` – Gordon Podiatry  
8. `logo-starts-with-a.png` – Starts With A  
9. `logo-commbank.png` – CommBank  
10. `logo-pom-pom-paddock.png` – Pom Pom Paddock (PPP_LOGO-1-1 1)  
11. `logo-good-design.png` – Good Design Australia  
12. `logo-innovations-accelerated.png` – Innovations Accelerated

**Row 3**

13. `logo-julie-anders.svg` – Julie Anders Holistic Counselling  
14. `logo-waterfield.png` – Waterfield

**Specs**

- Format: PNG (with transparency) or SVG.  
- Max height: ~70px (CSS scales as needed).  
- Colors: original assets can be full‑color; CSS inverts to white for display.  
- Background: transparent.

**Usage**

1. Export from Figma with the names above.
2. Place in `images/logos/`.
3. Logos are automatically rendered and color‑inverted by the existing CSS.

---

## Other Global Image Requirements

From the original `images/README.md`:

- **42 Interactive logo (header)** – SVG (`logo-42i-landscape.svg`), used in the main nav.  
- **42 logo (footer)** – SVG (`logo-42-footer.svg`), used in the footer.  
- **Social icons** – LinkedIn, Twitter/X, Instagram SVGs.  
- **Gallery / team photos** – `gallery-01.jpg` … `gallery-18.jpg` for crew / office imagery.  
- **Podcast, blog and technology section images** – see Figma for final list; follow the
  naming conventions above and place them under `images/`.



