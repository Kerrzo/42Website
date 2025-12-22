import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    base: '/42Website', // Replace with your actual repository name
    output: 'static',
    integrations: [mdx()],
    build: {
        assets: 'assets'
    }
});

