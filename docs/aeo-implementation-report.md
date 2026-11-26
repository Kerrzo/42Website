# AEO implementation report

Plan: [`aeo-plan.md`](aeo-plan.md). Baseline: [`aeo-baseline.md`](aeo-baseline.md).

## Phase 1: Technical foundation

Status: **built and tested locally. Not committed, not deployed.**

### What changed

| Item | Change | Files |
|---|---|---|
| robots.txt | New. Allows all pages and names OAI-SearchBot, Googlebot, Bingbot, PerplexityBot and ClaudeBot. GPTBot is not named, so it follows the `*` rule (allowed). Points to the sitemap. | `public/robots.txt` |
| Sitemap | New endpoint, no new dependency. 225 URLs: 14 site pages, `/blog/`, 210 posts (with `lastmod` from `publishedAt`). Skips `/404/`, `/creds/`, and all redirect routes. | `src/pages/sitemap.xml.ts` |
| Canonical | Every page now has an absolute canonical with trailing slash. Pages with `noindex` have none. | `src/layouts/BaseLayout.astro` |
| Open Graph / Twitter | `og:title/description/url/image/type/site_name/locale`, `twitter:card` (large image). Blog posts use their own hero image, `og:type=article` and `article:published_time`. Other pages use a new default image (1200×630). | `BaseLayout.astro`, `src/pages/blog/[slug].astro`, `public/images/og-default.jpg` |
| noindex | `/creds` and `/404` | `src/pages/creds.astro`, `src/pages/404.astro` |
| Retired duplicates | 9 `/work/*` pages and `/about` removed from source and redirected to the current pages | `astro.config.mjs`, deleted `src/pages/work/*.astro`, `src/pages/about.astro` |
| Old-site URLs | 10 URLs that were 404s but still linked from older blog posts now redirect to the nearest current page | `astro.config.mjs` |
| Trailing slashes | Navigation, homepage, case-study, blog and 404 links now end in `/` (48 lines) | `Header.astro`, `OtherWork.astro`, `index.astro`, `what-we-do/index.astro`, `who-we-are.astro`, `blog/*`, `404.astro`, `ai.astro` |

### Test results (local production build)

| Check | Before | After |
|---|---|---|
| Build | 237 pages | 227 pages + 21 redirect pages, no errors |
| Pages with canonical | 0 | 225 of 227 (the other 2, `/404` and `/creds`, are noindex) |
| Pages with Open Graph | 0 | 226 of 227 (`/creds` is a standalone page, noindex) |
| `og:image` files that exist | n/a | all 222 locally hosted images exist; 4 older blog posts use images still hosted on Webflow (they work, but could be moved into the repo) |
| Duplicate page titles | 9 pairs | 0 |
| Broken internal links (built HTML) | 10 targets | **0** |
| Pages linking to a slashless URL (extra redirect hop) | 236 | 0 in site code; 13 targets remain inside old blog post text |
| Default meta description | 22 pages | 12 (the rest are Phase 2) |
| `robots.txt` / `sitemap.xml` | 404 / 404 | present in `dist/` |

### Decisions I made that you should confirm

1. **The 10 old-site URL redirects.** These were my choice of "nearest page". The least certain: `/find-digital-jobs` → `/who-we-are/`, `/projects/good-design-award-digital-design-agency` → `/what-we-do/`, `/services/propviz-property-visualisation` → `/what-we-do/`.
2. **GPTBot** is allowed (not named in robots.txt). Block it by adding a `User-agent: GPTBot` / `Disallow: /` group.
3. **Retired `/work/*` content.** The older versions had different text. `/work/ai` described the retired mArvIn chatbot; `/work/neurotechnology` had a longer "Innovation in medical technology" section. They are still in git history if you want any of it back.
4. **Default share image.** Sydney photo, navy overlay, logo and the line "Creative technology and interaction design / Sydney, Australia". Check the wording.

### Known limits

- GitHub Pages cannot send real HTTP 301s. Astro's redirects are HTML pages with a meta refresh, a canonical to the target and `noindex`. Search engines treat these as redirects, but they are not as strong as a server 301.
- `robots.txt` and the sitemap only help once deployed. After deploy, submit `https://42interactive.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools (needs your login).
- No visual change was made to any page.

### Rollback

Nothing is committed yet, so the whole phase can be discarded by restoring the files listed above. Once committed, `git revert <phase-1-commit>` and push undoes it in one step.

## Blog archive (done with Phase 2)

70 off-topic posts moved to `data/blog-archive/`. 140 stay live. Full list, reasons and restore steps: [`blog-archive.md`](blog-archive.md).

- Archived: personal, charity, children and playground, Covid-era, aged care, smart-home, generic SEO / social media / ads / e-commerce platform posts, and thin stubs.
- Old URLs return a real 404 with a friendly message (see below). The sitemap has 155 URLs.
- **Kept by your decision:** 18 quality assurance posts and 24 older developer tutorial and tools posts stay live, as they show our software development work (listed in `blog-archive.md`).
- None of the 3 featured blog posts were archived.

## Phase 2: Homepage and metadata

Status: **built and tested locally. Not committed, not deployed. Copy needs your approval.**

| Item | Change |
|---|---|
| Homepage H1 | Now reads "Creative Technology and Interaction Design" (small uppercase line) above "Building What Others Only Imagine" (unchanged size and style), both inside the one H1 |
| Positioning line | New visible text under the heading: "42 Interactive is a Sydney-based creative technology company. We design and develop digital experiences, custom software and AI solutions for businesses." |
| Homepage title | "Creative Technology & Interaction Design Sydney \| 42 Interactive" |
| Homepage description | The text from the brief (same sentence as the positioning line) |
| Descriptions | New unique description for `/what-we-do/`, `/who-we-are/` and the 9 case studies. Pages using the generic default: 22 → **0**. Each one only repeats what the page already says (no numbers or new claims). |
| Styles | `.home-hero-kicker` and `.home-hero-intro` in `public/css/styles.css`, with tablet and phone sizes and a soft text shadow over the video |

Checked: build passes (157 pages), 0 broken links, no duplicate titles, no horizontal scroll at 375px. The phone screenshot tool returned images too small to judge, so **check the homepage hero on a real phone**.

### Not done in Phase 2 (and why)

- **Descriptive lines on case study headings** (for example "Craveable Brands: digital ordering platform for ..."). They need verified facts first. The Craveable and International Towers numbers must be checked before they appear in new text (Phase 4).
- **Blog `author` and `updatedAt` fields.** I do not know who wrote each old post and will not guess. Add `author:` to a post's frontmatter and I will show it and use it in Phase 3 structured data.
- **Blog titles.** 168 of the original 210 titles are over 60 characters with the site suffix, so search results may cut them. Not changed.
- **Four blog posts** still use cover images hosted on Webflow.

## Phase 3: Structured data

Status: **built and tested locally. Not committed, not deployed.**

Source of the data: `src/data/schema.ts` (one file, easy to edit). `BaseLayout` gets a new `jsonLd` option and prints each block as `<script type="application/ld+json">`.

| Page | Data added |
|---|---|
| `/` and `/who-we-are/` | **Organization** (name, legal name "42 Interactive Pty Ltd" as in the footer, logo, slogan, description, Sydney NSW AU, LinkedIn / Instagram / YouTube), **WebSite**, and two **Person** nodes: Dhani Sutanto (Chief Creative Officer) and Paul Kerr (Chief Technology Officer), linked as employees |
| `/ai/` | Three **Service** nodes, built from the visible service cards so the text always matches the page |
| Each blog post (140) | **BlogPosting**: headline, summary, image, publish date, author, publisher. Author is 42 Interactive unless the post has `author:` in its frontmatter. Four posts with a Dhani Sutanto byline now have `author: "Dhani Sutanto"`. |

Not added on purpose: street address (only "Sydney, NSW, AU"), `founder` (not needed), ratings or reviews, FAQ markup (no visible FAQ yet), BreadcrumbList (no visible breadcrumbs yet), `areaServed` and prices (not approved).

### Tests

- Build passes: 157 pages. 0 broken internal links.
- All 143 pages with structured data parse as valid JSON and use the schema.org context.
- 0 problems: every BlogPosting has headline (110 characters or fewer), description, image, ISO date, author and publisher; every Service has name, description, provider and URL; every `@id` reference resolves.
- Not yet run: Google Rich Results Test and the Schema.org validator. Both need the live URL. Run them after deploy on `/`, `/ai/` and one blog post.

### Open points

- **Leadership names and titles:** now visible. `/who-we-are/` has an "Our Leadership" block (Dhani Sutanto, Chief Creative Officer; Paul Kerr, Chief Technology Officer), placed after "Our History". This matches the Person data.
- Older posts say "Creative Director / Technologist" under Dhani's name, and one says "Co-Founder and CCO". These differ from "Chief Creative Officer". Not changed.

## Blog publication dates

118 posts carried 5 or 6 November 2023, the day the blog moved to this site. All 118 now have their **original publish date**.

- **Source:** the date shown on the old 42interactive.com page, read from the earliest copy in the Internet Archive (Wayback Machine). Older WordPress-era pages store the date in the page code; Webflow-era pages print it above the title.
- **Checks:** no date is later than the archived copy it came from; all dates fall between 2018 and 2023.
- **Result:** posts by year: 2018 (2), 2019 (6), 2020 (17), 2021 (31), 2022 (27), 2023 (40), 2024 (14), 2026 (3). No post has the migration date left.
- **Where it shows:** the post page, the blog list order, the sitemap `lastmod`, and `datePublished` in the structured data.
- **Left alone:** 22 posts that already had their own dates (2024 posts, December 2023 posts and the new AI posts).
- **Full list:** [`blog-dates-corrected.csv`](blog-dates-corrected.csv) (old date, new date, source for every post).
- **Caveat:** on the Webflow-era pages the date was a field someone typed in, so a post that was edited later could show its edit date. I could not tell these apart. No "updated" date is shown, by your decision.

## Removed: raw blog copies in `public/data/blog/`

`public/data/blog/` held 207 old `.mdx` copies of blog posts (from the first upload, December 2025). They were served on the live site as `/data/blog/<name>.mdx`, including posts that are now archived. They were out of date and nothing used them.

- **Removed** with `git rm` (history keeps them). After deploy those URLs return 404.
- **Kept:** `public/data/config.json` (the podcasts script loads it) and `public/data/config.ts`.
- Real sources are `data/blog/` (140 live posts) and `data/blog-archive/` (70 archived).
- Checked after removal: build passes (157 pages), 0 broken links, 0 structured data problems, `dist/data/config.json` still present.

## Leadership LinkedIn links

Done. `/who-we-are/` shows a "LinkedIn" link under each name (opens in a new tab, `rel="noopener noreferrer"`), and both profiles are in the Person data as `sameAs`.

## 404 page for retired articles

An archived or missing `/blog/<name>/` URL now shows a message, not a silent redirect:

- Title "Article No Longer Available", text "This article doesn't exist anymore. Visit our blog to read the latest articles.", a "Visit the Blog" button, and a "Latest articles" section with the three newest posts (built at build time, so they stay current).
- Any other missing URL still shows the normal "Page Not Found" page with the quick links.
- GitHub Pages sends a true 404 status for these pages. The page is `noindex`.
- The 70 redirect rules for archived posts were removed from `astro.config.mjs`. No live post links to an archived one (link check: 0 broken).
- The message is added by a small script in `404.astro` that reads the URL, so it appears after the page loads.

## Phase 4: Services, industries, AI page and case studies

Status: **built and tested locally. Not committed, not deployed. Copy and numbers need your review.**

### What was added

| Item | Change |
|---|---|
| Navigation | Services, AI, **Work**, About. "Services" now opens `/services/`; "Work" opens the case-study list (`/what-we-do/`, whose heading is now "Our Work"). Case studies highlight "Work". Mobile menu keeps the case-study sub-list under Work. |
| `/services/` | New. Four services (Creative Technology, Interaction Design, Software Development, AI) with a short definition, a checklist and links to the case studies behind each. Industries block and a "Let's Talk" call to action. |
| `/industries/` | New hub with two industries. |
| `/industries/commercial-real-estate/` | New. Problems we solve, what we build, what it connects to, results, case studies, related services, four related articles. |
| `/industries/quick-service-restaurants/` | New. Same structure, based on Craveable Brands. |
| `/ai/` | New light section: "AI in Plain English" (AI agent, RAG, workflow automation, system integration) and a visible FAQ of 7 questions, including "Where does the AI agent run? In the cloud." FAQPage markup is built from the same list. |
| Case studies (9) | A slim summary strip under each hero: client, industry (linked to the industry page where one exists) and what we built. The creative headings stay. |
| Structured data | Service nodes for `/services/` (4), FAQPage on `/ai/`, BreadcrumbList on `/services/` and the three industry pages. |
| Breadcrumbs | Visible on the new pages only. Not added to case studies (their hero layouts differ). |
| Old URLs | `/services/digital-marketing-services` and `/digital-transformation-agency` and `/our-digital-agency-services` now go to `/services/`; `/services/propviz-property-visualisation` goes to the commercial real estate page. |

New files: `src/pages/services/index.astro`, `src/pages/industries/*.astro`, `src/components/IndustryPage.astro`, `Breadcrumbs.astro`, `CaseFacts.astro`, `public/css/service-pages.css`. The FAQ styles are in `enterprise-ai.css`; the strip styles are in `styles.css`.

### Numbers used (as published on the site, to be corrected by you)

| Number | Where it comes from | Note |
|---|---|---|
| ~580 restaurants, 1M+ customers per week | Craveable case study page | Published as "~580 restaurants" and "over 1 million customers per week" |
| 50% increase in online conversions (3% to 4.5%) | Craveable case study page | 3% to 4.5% is a 50% relative increase, so the wording is consistent |
| 6 minutes less delivery time | Craveable case study page | |
| 26,338 access permits (to date) | Provided by you, 26 Nov 2026 | Replaces 16,448 on the case study, the Commercial Real Estate page and the Industries hub |
| 3 hours saved per permit | Provided by you: about 1 hour for each of 3 people | |
| 79,014 working hours saved | Calculated: 26,338 x 3 | |
| ~40 working years saved | Calculated: 79,014 / 1,976 (38-hour week x 52 weeks) | At a 40-hour week it would be about 38. Replaces "8.16 working years" and "8+ years" on the case study |

Confirmed by you (26 Nov 2026): 90% of pain clinic patients reduced chronic pain after three visits; White Rabbit Gallery holds over 3,000 works by 700 artists. Craveable figures confirmed too: ~580 restaurants, 1M+ customers a week, 50% conversion rise from 3% to 4.5%, 6 minutes less delivery time, three brands. All Phase 4 numbers are now confirmed.

### Wording I chose (please check)

- Industry labels: "Healthcare" (pain clinic), "Arts and culture" (White Rabbit Gallery), "Commercial real estate", "Quick service restaurants".
- "Four ideas sit behind most useful business AI." and the four plain-English definitions are general explanations, not claims about 42 Interactive.
- FAQ answer on cost gives no prices and no timelines. It says we usually start with a consultation or prototype.
- The cloud answer says only "In the cloud." No provider, region or compliance claim.

### Left out on purpose

- Separate pages per service (thin content), a systems integration page, and pages for other industries. Add them when there is real material.
- Timelines and prices.
- "Award-winning" and "largest microservice architecture in APAC" (superlatives and quotes on the existing pages). Not repeated on new pages.

### Checks

Build passes (161 pages). 0 broken internal links. 147 pages carry valid structured data, 0 problems. All 7 FAQ questions and answers match their markup word for word. No horizontal scroll at 375px on `/services/`, the industry pages and `/ai/`.
Pre-existing, not changed: the Craveable case study page is 8px wider than a 375px phone (from its own header styles; the same with the new strip hidden).

## Services page redesign (3D scroll stage)

`/services/` now has the four services as text steps on the left and one sticky Three.js stage on the right. The same 640 glowing particles regroup into a different formation for each service as you scroll: a wave field (Creative Technology), rings that drift apart and align (Interaction Design), a lattice of modules (Software Development) and a neural sphere (AI). Between services the particles fly in and out of the stage; links and travelling signals fade in once a formation settles, in the style of the AI page. The step in view is bright, the others dim. On tablets and phones the stage sits dimmed behind the text.

- Script: `src/scripts/service-objects.js` (bundled by Astro; only loaded on `/services/`, about 120 KB gzipped).
- New dependency: `three@0.170.0` (in `package.json`).
- Renders only while the section is on screen. With reduced motion it does not animate on its own; it still follows the scroll.
- The project photos tried earlier were removed (files deleted).
- Update: formations are now a burst sphere (Creative Technology), a field of toggles (Interaction Design), the module lattice (Software Development) and the neural sphere (AI). Transitions zoom through the current formation past the camera, then the next arrives from the distance. The stage is full screen; the camera view is offset so formations sit on the right. Scrolling into Industries disperses the sphere completely and fades in a moving grainy gradient (eclipse disc with a glowing rim) behind the Industries list. The outlined 01–04 numbers were removed.
- Update 2: the hero is now inside the stage area, so the gradient runs from the top of the page and the first formation zooms in from the distance as you leave the hero. The gradient is a soft flowing field in the site palette whose colours follow the scroll (violet, lilac and rose, blues, indigo, then lilac and rose behind Industries). No eclipse disc. Particles are crisp discs with no soft glows. In Industries the particles clear out quickly and only the flowing gradient remains.
- Update 3: services alternate sides (text left for 01 and 03, right for 02 and 04; the object moves opposite). Particles are now eight crisp shapes (circle, ring, square, square outline, triangle, triangle outline, plus, x) drawn in a custom shader, sized to be readable (about 9 px). Formations are at 80% of their earlier size. The hero background is a calm drifting field of these shapes that gathers into the first formation as you scroll. Grain is a static CSS layer (`.svc-stage::after`).
- Update 4: Interaction Design toggles are simple lines whose two ends are one shape per line (no separate white dots). Software Development is now an octree after the "Pollen Octree Overprint" artwork: a cube split into cells of mixed sizes; solid cells printed as a dot screen of shape particles on three faces, wire cells as outlines, some empty; couriers on lanes between cells; every 5 s a band glitches sideways with streak lines and a slight misregistration of the outlines.
- Update 5: the Services text sits in the same 1140 px content width as the other pages, layered over the stage; the objects are a dimmer, lower-contrast background (particles at half strength in a soft lilac). The four jump links under the hero were removed; the hero ends with a separator line and the gaps between services are shorter. Solid shaded 3D objects (dark body, soft light, lilac rim) are drawn before the particles, so dots in front stay visible:
  - Creative Technology: a small core at the centre of the burst; the comets leave from its surface.
  - Interaction Design: three stacked grid planes like a pillow, with a ball bouncing straight up and down on them; each landing presses the layers in and sends rings outward. Spare particles trace a ring around the ball while it arrives, then fade.
  - Software Development: a nested-cube sculpture with finer cells: outlines, soft white cubes, dark blue cubes, dot-screen cells and empty space. One cube at a time glides into a free cell of the same size. No glitch and no couriers.
  - AI: a small dark ball inside the node sphere.

## Phase 5: Release check (27 Nov 2026)

| Check | Result |
|---|---|
| Production build | Passes, 161 pages (same as after Phase 4). |
| Broken internal links | 0. |
| Structured data | 147 pages, 0 problems (Organization, WebSite, 4 Person, 7 Service, FAQPage, 140 BlogPosting, 4 BreadcrumbList). |
| Titles and descriptions | 0 duplicate titles. The only page without a description is `/creds/` (noindex, no H1, as intended). |
| noindex | Only `/404`, `/creds/` and the redirect pages for old URLs. |
| Page check, 375 px and 1440 px | 14 key routes: home, services, industries (3), AI, who we are, work, 2 case studies, blog, a blog post, an archived post, creds. Each has one H1 and the Let's Talk button; no console errors on `/services/`. |

Fixed during the check:

- Old blog posts linked to 13 legacy URLs (for example `/about-us`, `/contact-us`, `/digital-transformation-agency`) that went through a redirect. 59 links in 49 posts now point straight to the final pages; the link check now shows 0 links into redirect pages and 0 links missing a trailing slash. The redirects stay in place for outside links.
- Sideways scroll on the Craveable and Amica case studies (their flock images and permit circle reached past the edge). The main content on those two pages now clips horizontal overflow (`overflow-x: clip`, in `craveablebrands.css` and `amica.css`); the pages no longer scroll sideways at 375 px or 1440 px.

Still to do:

- After the push: check sitemap, robots, canonicals and structured data on the live site, then submit the sitemap in Google Search Console and Bing Webmaster Tools (needs your login).

Rollback: revert the release commit and push again; GitHub Pages redeploys the previous version.

## Image and video compression (27 Nov 2026)

- Homepage intro video: 30.6 MB H.264 replaced by `hero.webm` (AV1, 3.0 MB) with `hero.mp4` (H.264, 4.5 MB) as the fallback. Light denoise before encoding, no audio or timecode track. A static grain layer (`.home-hero-section::before`) sits over the video to hide compression blocks. Homepage images below the hero load lazily.
- Site images: photos referenced by the site were converted to WebP (quality 88; anything wider than 2000 px scaled to 2000 px). A conversion was kept only if it saved at least 10%.
  - First pass, opaque photos: 645 images, 195 MB to 48 MB.
  - Second pass, transparent images over 100 KB (transparency kept): 56 images, 15.5 MB to 2.4 MB; plus the four AI page trust illustrations (2.5 MB to 0.3 MB) and the AI advisory background.
  - Left as they are: small transparent images (logos, icons), images that would not shrink by 10%, SVGs, and 17 images nothing references.
  - `public/images` 74 MB to 16 MB, `public/blog/images` 172 MB to 95 MB, built site 126 MB.
- Link previews: blog hero images (frontmatter `image:`), `og-default.jpg` and the logo keep their original PNG/JPG, because not every social network shows WebP previews. Each blog hero has a `.webp` copy that the pages display (`src/data/images.ts`, `displayImage()`).
- References were rewritten in 175 + 21 source files (pages, components, blog and archived posts, CSS, JS). Originals with no reference left were deleted.
- Checks: build passes (161 pages), 0 broken links or images, 0 missing image paths in CSS/JS/source, every og:image file exists, structured data 0 problems. Spot checks of 14 pages in the browser show no broken images or backgrounds; the AI trust illustrations keep their transparency.
- New blog images: save photos as WebP. Keep the hero image (frontmatter `image:`) as JPG for link previews and add a `.webp` copy with the same name for display.
