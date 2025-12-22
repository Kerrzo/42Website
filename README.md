# 42 Interactive Website

Modern website for 42 Interactive built with [Astro](https://astro.build) - a static site generator that delivers lightning-fast performance.

## 🚀 Tech Stack

- **Astro 4.0** - Static site generator
- **MDX** - Markdown with JSX for blog posts
- **TypeScript** - Type-safe development
- **GitHub Actions** - Automated deployment to GitHub Pages

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

## 🛠️ Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
# or
npm start
```

The site will be available at `http://localhost:4321` (Astro's default port).

### Build

```bash
# Build for production
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## 📁 Project Structure

```
42Website/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── OtherWork.astro
│   ├── layouts/             # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/               # Route pages (file-based routing)
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro      # About page
│   │   ├── who-we-are.astro
│   │   ├── blog/            # Blog pages
│   │   │   ├── index.astro   # Blog listing
│   │   │   └── [slug].astro  # Individual blog posts
│   │   ├── podcasts/         # Podcast pages
│   │   │   └── index.astro
│   │   └── what-we-do/       # Work case studies
│   └── data/                 # Data files
│       └── config.json       # Site configuration
├── data/
│   └── blog/                # Blog posts (MDX files)
├── public/                  # Static assets (copied as-is)
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   ├── images/              # Images and assets
│   └── blog/                # Blog images
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── astro.config.mjs         # Astro configuration
├── package.json
└── README.md
```

## 📄 Pages & Routes

### Main Pages
- `/` - Homepage with hero, work showcase, and featured podcasts
- `/about` - About page
- `/who-we-are` - Who We Are page

### Blog
- `/blog` - Blog listing page (all posts)
- `/blog/[slug]` - Individual blog post pages with sidebar

### Podcasts
- `/podcasts` - Podcast listing page with YouTube integration

### Work/Case Studies
- `/what-we-do/*` - Individual work case study pages
  - `/what-we-do/building-restaurants-of-the-future`
  - `/what-we-do/a-brand-that-feels-like-a-friend`
  - `/what-we-do/connecting-people-to-workplace`
  - `/what-we-do/putting-the-intelligence-in-ai`
  - `/what-we-do/the-magic-of-theatre-at-home`
  - `/what-we-do/a-better-way-to-manage-pain`
  - `/what-we-do/immortalising-creativity`
  - `/what-we-do/bringing-art-to-life`
  - `/what-we-do/bringing-products-to-life`

## ✨ Features

### Blog System
- **MDX Support** - Write blog posts in Markdown with JSX
- **Dynamic Routing** - Automatic blog post pages from MDX files
- **Sidebar Navigation** - Latest and highlighted posts on blog detail pages
- **Show All Button** - Quick navigation to full blog listing

### Podcasts/Videos
- **YouTube Integration** - Embedded YouTube videos with lightbox
- **Dynamic Loading** - Podcasts configured via `data/config.json`
- **Featured Podcasts** - Homepage showcase of featured content

### Design & UX
- **3-Column Responsive Grid** - Desktop-first with mobile optimization
- **Animated Gradients** - Interactive gradient backgrounds on homepage
- **Smooth Animations** - CSS transitions and JavaScript interactions
- **Mobile-First** - Fully responsive design
- **Dark/Light Themes** - Theme-aware sections

### Performance
- **Static Site Generation** - Pre-rendered pages for maximum speed
- **Optimized Assets** - Efficient image and asset handling
- **Minimal JavaScript** - Progressive enhancement approach

## 🎨 Styling

The site uses a custom CSS architecture:

- **Main Stylesheet**: `public/css/styles.css`
- **Component Styles**: Inline styles in Astro components
- **Work Page Styles**: Individual CSS files for specific work pages
- **CSS Variables**: Centralized design tokens

### Grid System

The website uses a **3-column responsive grid system**:

**Desktop (> 768px)**
- 3 equal columns with 40px gap
- 100px left/right margins
- 1440px maximum width

**Mobile (≤ 768px)**
- Collapses to 1 column
- 40px margins (20px on very small screens)

**CSS Variables**
```css
--page-margin: 100px;   /* Responsive: 100px → 60px → 40px → 20px */
--column-gap: 40px;     /* Responsive: 40px → 30px → 20px */
--max-width: 1440px;    /* Maximum page width */
```

## 🚢 Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages using GitHub Actions.

**Workflow**: `.github/workflows/deploy.yml`

**Deployment Process**:
1. Push to `main` branch triggers workflow
2. Builds the Astro site
3. Deploys to GitHub Pages

**Configuration**:
- Update `base` path in `astro.config.mjs` if repository name differs from `username.github.io`
- Enable GitHub Pages in repository settings (Settings → Pages → Source: GitHub Actions)

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.mdx` file in `data/blog/`
2. Add frontmatter:
```mdx
---
title: "Your Blog Post Title"
publishedAt: "2024-01-15"
summary: "A brief summary"
image: "/blog/images/your-image.jpg"
---

Your content here...
```

3. The post will automatically appear in the blog listing

### Updating Podcasts

Edit `data/config.json` to add or modify podcasts:
```json
{
  "podcasts": [
    {
      "id": "youtube-video-id",
      "title": "Podcast Title",
      "date": "January 15, 2024",
      "description": "Description text"
    }
  ],
  "featuredPodcasts": ["video-id-1", "video-id-2", "video-id-3"]
}
```

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server
npm start        # Alias for dev
npm run build    # Build for production
npm run preview   # Preview production build
```

## 📦 Dependencies

- `astro` - Static site generator
- `@astrojs/mdx` - MDX support for Astro

## 🔧 Configuration

### Astro Config (`astro.config.mjs`)

- **Base Path**: Set for GitHub Pages deployment
- **Output**: Static site generation
- **Integrations**: MDX for blog posts

### Site Config (`data/config.json`)

- Featured podcasts
- Highlighted blog posts
- Podcast listings

## 📚 Additional Documentation

- `docs/PROJECT.md` - Project overview and structure
- `docs/IMAGES-ASSETS.md` - Image and asset guidelines
- `docs/PODCASTS-SYSTEM.md` - Podcast system documentation

## 🎯 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## 📄 License

ISC

## 👥 Credits

- Design based on Figma mockups
- Fonts: Montserrat and Inter (Google Fonts)
- Built with Astro

---

For questions or issues, please open an issue on GitHub.
