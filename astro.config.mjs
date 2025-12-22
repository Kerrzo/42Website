import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://42interactive.com',
    base: '/',
    output: 'static',
    integrations: [mdx()],
    build: {
        assets: 'assets'
    }
});

