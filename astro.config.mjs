import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Archived blog posts live in data/blog-archive/ and are not built.
// Their old URLs return a real 404; src/pages/404.astro shows a friendly
// "article no longer available" message for any missing /blog/... URL.

// https://astro.build/config
export default defineConfig({
    site: 'https://42interactive.com',
    base: '/',
    output: 'static',
    redirects: {
        '/contact-us': {
            status: 301,
            destination: '/',
        },
        // Retired older copies of pages that now live under /what-we-do and /who-we-are
        '/about': '/who-we-are/',
        '/work/ai': '/what-we-do/putting-the-intelligence-in-ai/',
        '/work/amica': '/what-we-do/connecting-people-to-workplace/',
        '/work/amicabrand': '/what-we-do/a-brand-that-feels-like-a-friend/',
        '/work/bovr': '/what-we-do/the-magic-of-theatre-at-home/',
        '/work/craveablebrands': '/what-we-do/building-restaurants-of-the-future/',
        '/work/latham': '/what-we-do/bringing-products-to-life/',
        '/work/neurotechnology': '/what-we-do/a-better-way-to-manage-pain/',
        '/work/vivid': '/what-we-do/putting-smiles-on-peoples-faces/',
        '/work/wrg': '/what-we-do/immortalising-creativity/',
        // Old-site URLs still linked from older blog posts (were 404s). Nearest current page.
        '/about-us': '/who-we-are/',
        '/find-digital-jobs': '/who-we-are/',
        '/our-digital-projects': '/what-we-do/',
        '/digital-agency-projects-accolades': '/what-we-do/',
        '/our-digital-agency-services': '/services/',
        '/digital-transformation-agency': '/services/',
        '/services/digital-marketing-services': '/services/',
        '/services/propviz-property-visualisation': '/industries/commercial-real-estate/',
        '/projects/good-design-award-digital-design-agency': '/what-we-do/',
        '/projects/international-towers-digital-ecosystem-project': '/what-we-do/connecting-people-to-workplace/',
    },
    integrations: [mdx()],
    build: {
        assets: 'assets',
        // Ensure production builds don't include dev-only attributes
        inlineStylesheets: 'auto'
    },
    vite: {
        build: {
            sourcemap: false
        }
    }
});

