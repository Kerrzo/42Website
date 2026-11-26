# AEO baseline (before Phase 1)

Captured: 2026-11-25, from a production build of `main` at commit `f056172` and from the live site https://42interactive.com/.
Full route list (all 238 routes, including 210 blog posts): [`aeo-baseline-routes.csv`](aeo-baseline-routes.csv).

## Summary

| Check | Result before | Evidence |
|---|---|---|
| `robots.txt` | **404** | `curl https://42interactive.com/robots.txt` |
| `sitemap.xml` | **404** | `curl https://42interactive.com/sitemap.xml` |
| `llms.txt` | 404 | Not a priority (see plan) |
| Canonical tags | **0 of 237** pages | Route inventory |
| Open Graph / Twitter tags | **0 of 237** pages | Route inventory |
| JSON-LD structured data | **0 pages** | Route inventory |
| Default (generic) meta description | **22 pages** | Route inventory |
| Duplicate page titles | **9 pairs** (`/work/*` vs `/what-we-do/*`, `/about` vs `/who-we-are`) | Route inventory |
| Internal links without trailing slash | **236 pages** link to `/ai`, `/what-we-do`, etc. | GitHub Pages answers with a 301 to `/ai/`, so every click costs a redirect |
| Broken internal links | **10 old-site URLs** (35 links in older blog posts) | e.g. `/about-us`, `/our-digital-projects` |
| `noindex` on any page | None | `/creds` (Figma deck embed) was indexable |
| Server-delivered HTML | Yes. Static build, all text and links are in the HTML | No JavaScript rendering risk |
| HTTPS / www redirect | OK. `http://www.` → `https://42interactive.com/` (301) | `curl -I` |
| Analytics | GA4 (`G-GFEPCRC539`) loaded in `BaseLayout` | Source |
| Mobile performance, Search Console, crawler/CDN access | **Not checked.** Needs account access | See "Not verified" |

Blog (210 posts): all have a description from `summary:`; 20 are over 160 characters; **168 titles are over 60 characters** once " | 42 Interactive" is added (likely cut off in search results). No post has an author or updated date in its frontmatter.

Homepage H1 is "Building What Others Only Imagine". Services are not listed anywhere. The "Services" menu item opens the case-study list (`/what-we-do/`).

## Not verified (needs access)

- Google Search Console and Bing Webmaster data (indexed pages, coverage errors, impressions)
- Whether any CDN or firewall blocks search crawlers (GitHub Pages does not by default)
- Real-user mobile performance (Core Web Vitals)
- Backlinks and external profiles
- Which of the retired `/work/*` URLs have external links or search traffic

## Route inventory (non-blog pages)

| Route | Type | Title | Description | H1 | Has |
|---|---|---|---|---|---|
| `/` | page | 42 Interactive - Building What Others Only Imagine | (default) | Building What Others Only Imagine | - |
| `/404` | page | 404 - Page Not Found \| 42 Interactive | The page you're looking for doesn't exist. Let's get you back on trac… | Page Not Found | - |
| `/about/` | page | Who We Are - 42 Interactive | (default) | Who We Are | - |
| `/ai/` | page | AI Services \| 42 Interactive | AI consultancy, proof of concept and agentic AI development, built ar… | Practical AI, built around your busines… | - |
| `/blog/` | page | Blog \| 42 Interactive | Read our latest blog posts about technology, design, and innovation | Our Voice | - |
| `/contact-us/` | redirect | Redirecting to: https://42interactive.com/ | (none) | (none) | canonical |
| `/creds/` | page | Creds - 42 Interactive | (none) | (none) | - |
| `/podcasts/` | page | Podcasts \| 42 Interactive | Watch our latest podcasts and videos about technology, design, and in… | Our Story | - |
| `/what-we-do/` | page | What We Do - 42 Interactive | (default) | What We Do | - |
| `/what-we-do/a-better-way-to-manage-pain/` | page | Neurotechnology – A Better Way to Manage Pain \| 42 Interacti… | (default) | A Better Way to Manage Pain | - |
| `/what-we-do/a-brand-that-feels-like-a-friend/` | page | Amica Brand – A Brand That Feels Like a Friend \| 42 Interact… | (default) | A Brand That Feels Like a Friend | - |
| `/what-we-do/bringing-products-to-life/` | page | Latham – Bringing Products to Life \| 42 Interactive | (default) | Bringing Products to Life | - |
| `/what-we-do/building-restaurants-of-the-future/` | page | Craveable Brands – Building Restaurants of The Future \| 42 I… | (default) | Building Restaurants of The Future | - |
| `/what-we-do/connecting-people-to-workplace/` | page | Amica – Connecting People to workplace \| 42 Interactive | (default) | Connecting People to workplace | - |
| `/what-we-do/immortalising-creativity/` | page | White Rabbit Gallery – Immortalising Creativity \| 42 Interac… | (default) | Immortalising Creativity | - |
| `/what-we-do/putting-smiles-on-peoples-faces/` | page | Putting Smiles on Peoples Faces – VIVID Sydney 2019 \| 42 Int… | (default) | Putting Smiles on Peoples Faces | - |
| `/what-we-do/putting-the-intelligence-in-ai/` | page | AI – Putting the Intelligence in AI \| 42 Interactive | (default) | Putting the Intelligence in AI | - |
| `/what-we-do/the-magic-of-theatre-at-home/` | page | Box Office VR – The Magic of Theatre at home \| 42 Interactive | (default) | The Magic of Theatre at home | - |
| `/who-we-are/` | page | Who We Are - 42 Interactive | (default) | Who We Are | - |
| `/work/ai/` | page | AI – Putting the Intelligence in AI \| 42 Interactive | (default) | Putting the Intelligence in AI | - |
| `/work/amica/` | page | Amica – Connecting People to workplace \| 42 Interactive | (default) | Connecting People to workplace | - |
| `/work/amicabrand/` | page | Amica Brand – A Brand That Feels Like a Friend \| 42 Interact… | (default) | A Brand That Feels Like a Friend | - |
| `/work/bovr/` | page | Box Office VR – The Magic of Theatre at home \| 42 Interactive | (default) | The Magic of Theatre at home | - |
| `/work/craveablebrands/` | page | Craveable Brands – Building Restaurants of The Future \| 42 I… | (default) | Building Restaurants of The Future | - |
| `/work/latham/` | page | Latham – Bringing Products to Life \| 42 Interactive | (default) | Bringing Products to Life | - |
| `/work/neurotechnology/` | page | Neurotechnology – A Better Way to Manage Pain \| 42 Interacti… | (default) | A Better Way to Manage Pain | - |
| `/work/vivid/` | page | Bringing Art To Life – VIVID Sydney 2019 \| 42 Interactive | (default) | Bringing Art To Life | - |
| `/work/wrg/` | page | White Rabbit Gallery – Immortalising Creativity \| 42 Interac… | (default) | Immortalising Creativity | - |

Notes:
- `/what-we-do/*` and `/work/*` hold two versions of the same nine case studies. The `/work/*` versions are older (for example `/work/ai` still describes the retired "mArvIn" chatbot platform) and are not linked from anywhere.
- `/creds` has no `BaseLayout`, so no description or social tags.
