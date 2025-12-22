import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    // Only use base path for production (GitHub Pages)
    // For local dev, base will be '/' automatically
    base: process.env.NODE_ENV === 'production' ? '/42Website/' : '/',
    output: 'static',
    integrations: [mdx()],
    build: {
        assets: 'assets'
    }
});

