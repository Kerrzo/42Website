# 42interactive.com — AEO development plan (phased)

Source brief: `42interactive-aeo-implementation.md` (Nov 2026).
Status: **plan only, nothing executed.** Each phase ends at a review gate. Nothing goes live without your OK.

---

## What the repo and live site show today (quick discovery)

Stack: Astro 4, static output, MDX blog (210 posts in `data/blog/`), GitHub Pages via `.github/workflows/deploy.yml`. One shared `<head>` in `src/layouts/BaseLayout.astro`. No SEO integration installed.

| Area | Finding | Impact |
|---|---|---|
| robots.txt | **404 on live site** | Crawlers get no rules and no sitemap pointer |
| sitemap.xml | **404 on live site** | AI and search crawlers must discover 230+ URLs by links only |
| Canonical tags | None on any page | Duplicate URLs compete with each other |
| Open Graph / social tags | None | Poor link previews on LinkedIn, Slack, ChatGPT |
| JSON-LD | None | No Organization, Service or Article data for engines |
| Meta descriptions | **22 pages** fall back to the generic "Building What Others Only Imagine" | Weak, duplicated snippets |
| Duplicate pages | `/work/*` (9 pages) are copies of `/what-we-do/*`; `/about` copies `/who-we-are`. None are linked | Duplicate content, split signals |
| `/creds` | Indexable, not linked | Sales deck page, probably should be `noindex` |
| Homepage H1 | "Building What Others Only Imagine" | Brand line, says nothing about what we do or where |
| Navigation | "Services" lists case studies, not services | Engines and people can't find a services list |
| Trailing slash | `/ai` → 301 → `/ai/`; internal links omit the slash | Extra redirect hop on every internal link |
| Blog posts | No author or updated date in frontmatter | No E-E-A-T or Article author signal |
| Analytics | GA4 (`G-GFEPCRC539`) in config | Can measure AI referrals without new tools |

Good already: static HTML (all content is in the server HTML, no JS rendering problem), HTTPS, www → apex redirect, unique titles on most case studies, the new `/ai` page.

---

## Phase 1 — Technical foundation (P0)

Low risk, no visual change, biggest gain. About 1–2 days.

1. **robots.txt** (`public/robots.txt`): allow all public pages; allow `OAI-SearchBot`, `Googlebot`, `Bingbot`, `PerplexityBot`, `ClaudeBot`; point to the sitemap. `GPTBot` (training) left as-is until you decide (gate item).
2. **Sitemap**: add `@astrojs/sitemap` (one small official dependency) or a hand-written `sitemap.xml.ts` endpoint. Exclude `/work/*`, `/about`, `/creds`, `/404`.
3. **Canonical URL** in `BaseLayout`: built from `Astro.site` + path, with trailing slash to match GitHub Pages.
4. **Fix internal links** to use trailing slashes (`/ai/`, `/what-we-do/`, `/who-we-are/`) so there is no redirect hop.
5. **Retire duplicates**: turn `/work/*` and `/about` into redirects to the `/what-we-do/*` and `/who-we-are` pages (Astro `redirects` config, same as `/contact-us`).
6. **`/creds`**: add a `noindex` option to `BaseLayout` and use it there.
7. **Open Graph + Twitter tags** in `BaseLayout`: title, description, URL, image (new `ogImage` prop, default brand image; blog posts use their hero image).
8. **Baseline report** `docs/aeo-baseline.md`: route inventory (title, description, H1, canonical, status), the table above, screenshots.

Gate 1: you review robots policy (GPTBot yes/no), the redirect list and the baseline. Then deploy.

---

## Phase 2 — Homepage and metadata (P0)

Copy changes, layout kept. About 1–2 days plus your copy review.

1. **Homepage**:
   - Make the H1 descriptive: "Creative Technology and Interaction Design".
   - Keep "Building What Others Only Imagine" as the visual brand line (styled the same, demoted to a tagline).
   - Add one visible positioning line: "42 Interactive is a Sydney-based creative technology company. We design and develop digital experiences, custom software and AI solutions for businesses."
2. **Homepage title / description**: "Creative Technology & Interaction Design Sydney | 42 Interactive" plus the description from the brief.
3. **Write unique descriptions for the 22 pages** that use the default (case studies, `/what-we-do`, `/who-we-are`). Each one says client, industry and what we built.
4. **Case study headings**: keep the creative H1 lines visually, but add a descriptive line, for example "Craveable Brands: digital ordering platform for 580 restaurants" (only with verified facts, see Phase 4).
5. **Blog frontmatter**: add `author` (default Dhani or Paul) and optional `updatedAt`; show them on the post page.

Gate 2: you approve homepage copy and the 22 descriptions.

---

## Phase 3 — Structured data (P0/P1)

Invisible to visitors, high value for AI engines. About 1 day.

1. **Organization** (homepage and `/who-we-are`): name, logo, URL, Sydney address (to confirm), founders, `sameAs` (LinkedIn, YouTube, Instagram — to confirm), stable `@id` `https://42interactive.com/#organization`.
2. **WebSite** on the homepage.
3. **Service** on `/ai/` (three services: AI Consultancy, Proof of Concept & Prototyping, Agentic AI Development), linked to the Organization `@id`.
4. **BlogPosting + Person** on every blog post (headline, dates, author, image).
5. **BreadcrumbList** only where breadcrumbs are visible (Phase 4 adds them).
6. Validate with Google Rich Results Test and the Schema.org validator. No ratings, no FAQ markup unless a visible FAQ exists.

Gate 3: you confirm the company facts (address, ABN if wanted, social profiles, founders' titles).

---

## Phase 4 — Information architecture, AI page and case studies (P1)

The largest phase. Needs content from you. About 1–2 weeks, depends on copy.

**4a. Separate Services from Our Work**
- Nav becomes: Services, AI, Work, About.
- New `/services/` overview page built from real capabilities: Creative Technology, Interaction Design, Software Development, AI (links to `/ai/`).
- `/what-we-do/*` case studies stay at their URLs (no migration), listed under "Work".
- Individual service pages (`/services/creative-technology/` etc.) only when there is enough real content. No thin pages.

**4b. Industry pages (only where we have proof)**
- Start with two: Commercial Real Estate (Amica / International Towers) and Quick Service Restaurants (Craveable Brands). Others wait for evidence.

**4c. `/ai/` additions** (keep the current design)
- Short plain-English section: what an AI agent is, RAG, workflow automation, system integration.
- Delivery stages (already partly there) and deployment options **only if confirmed** (cloud / private cloud / on-premises).
- Visible FAQ: cost factors (no prices), how long a prototype takes, data privacy, integration, maintenance. Then FAQ markup that matches.

**4d. Case study evidence**
- One reusable structure: client, industry, challenge, solution, services, technology, outcomes (with period and method).
- Verify the published numbers before any change:
  - Craveable: ~580 restaurants, "50% conversion increase", "6-minute delivery reduction".
  - International Towers: 16,448 permits, 49,344 hours, 8.16 working years (the working-year maths needs checking).
- Unverified numbers are flagged in the report, not republished.
- Breadcrumbs on case studies and service pages.

Gate 4: you approve each new page's claims and each number.

---

## Phase 5 — Regression testing and release

About 1 day.

- `npm run build` passes; check the page count against the baseline.
- Check every changed route on desktop and mobile, keyboard navigation, menu and the Let's Talk buttons.
- Link check across the built `dist/` (no broken internal links, no redirect chains).
- Validate sitemap, robots, canonicals and JSON-LD on the live site after deploy.
- Write `docs/aeo-implementation-report.md`: changed files, decisions, results, open issues, rollback (revert the commit and redeploy).
- Submit the sitemap in Google Search Console and Bing Webmaster Tools (you, since these need your login).

Gate 5: your OK before each production push.

---

## Phase 6 — Content, outreach and measurement (P2, ongoing)

- **Prompt benchmark** `docs/aeo-prompt-benchmark.csv`: 30–50 prompts across the five target queries ("custom AI development Australia", "interaction design agency Sydney" etc.). Run by hand monthly in ChatGPT, Perplexity, Google AI Mode and Copilot. Record: mentioned? recommended? cited URL? competitors? accuracy.
- **GA4**: a saved report for AI referrals (`chatgpt.com`, `perplexity.ai`, `copilot`, `gemini`, `utm_source=chatgpt.com`). No new tracking.
- **Content backlog** `docs/aeo-content-backlog.md`: the 8 articles from the brief, in that order, 2 per month. Each one: direct answer first, named author, dates, links to the service and case study. Start with "How much does custom AI development cost in Australia?" (cost factors, no invented ranges).
- **Old blog clean-up** (optional): many of the 210 posts are thin 2020–2022 SEO posts. Review for `noindex` or merge; thin content can weaken the whole site.
- **Outreach list** (you do the sending): client case study attributions, CUB, award listings, Google Business Profile, Clutch / directory profiles, LinkedIn company page consistency.

---

## Decisions needed from you

1. GPTBot (OpenAI training crawler): allow or block? (search crawlers are allowed either way)
2. OK to redirect `/work/*` and `/about` to their main pages?
3. OK to `noindex` `/creds`?
4. Nav label: "Work" for case studies, and is a new `/services/` page wanted now or later?
5. Company facts for Organization data: street address or just "Sydney, NSW"? Social profile URLs?
6. Who can verify the Craveable and International Towers numbers?
7. Deployment options for AI (cloud / private / on-prem): which are true today?

## Effort summary

| Phase | Effort | Risk |
|---|---|---|
| 1 Technical foundation | 1–2 days | Low |
| 2 Homepage + metadata | 1–2 days + copy review | Low |
| 3 Structured data | ~1 day | Low |
| 4 IA, AI page, case studies | 1–2 weeks (content-bound) | Medium |
| 5 Testing + release | ~1 day per release | Low |
| 6 Content + measurement | Ongoing | Low |

Phases 1–3 can ship as one release in about a week and fix most of the technical gaps. Phase 4 is where the content work is.

No result is guaranteed: these changes make the site easier for AI engines to read and cite, but rankings and mentions depend on the engines.
