import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '../data/blog');

// Category mapping based on filename patterns and keywords
const categoryMap = {
    // Technology & Development
    'technology-development': [
        'react', 'flutter', 'xamarin', 'javascript', 'xray', 'x-ray', 'unity', 'figma',
        'algolia', 'sitecore', 'vector-databases', 'feature-flag', 'sonoff', 'iot',
        'working-with-javascript', 'wix-to-wordpress', 'xamarin-forms', 'xray-plugin'
    ],
    
    // Extended Reality (XR)
    'extended-reality': [
        'vr', 'ar', 'xr', 'virtual-reality', 'augmented-reality', 'mixed-reality',
        'vr-headset', 'hmd-odyssey', 'vr-headsets', 'box-office-vr', 'an-intro-to-xr',
        'ar-vr-development', 'exploration-with-virtual-reality', 'beginners-guide-to-vr',
        'a-fundamental-components-of-vr-headsets', 'samsung-hmd-odyssey'
    ],
    
    // Quality Assurance
    'quality-assurance': [
        'qa', 'quality-assurance', 'testing', 'test', 'qa-as-a-service', 'automation-test',
        'software-testing', 'software-quality-metrics', 'test-management', 'risk-management',
        'best-practices-for-choosing-a-qa', 'benefits-of-qa', 'discover-the-secrets-of-risk-management',
        'the-evolution-of-test-management', 'writing-test-case', 'quality-assurance-and-testing',
        'qa-perspective'
    ],
    
    // Digital Transformation
    'digital-transformation': [
        'digital-transformation', 'crm', 'salesforce', 'streamlining-business-processes',
        'why-digital-transformation', 'how-to-digitalise', 'the-importance-of-digital-experience',
        'why-is-digital-marketing', 'why-is-blogging', 'why-social-media-marketing',
        'why-should-you-use-google-adwords', 'why-paperless', 'email-marketing-automation',
        'boosting-business-online-using-seo', 'technical-seo-audit', 'brand-strategy',
        'successful-mobile-application-marketing', 'effective-mobil-app-promotion',
        'the-advantages-of-utilising-a-crm', 'the-advantages-of-contactless-delivery',
        'e-commerce-getting-business-online', 'technology-as-the-main-expense',
        'digitising-a-high-rise', 'streamlining-success-42-interactives-seamless-salesforce',
        'why-work-with-a-creative-and-technology-partner', 'why-naming-your-business',
        'why-your-business-needs-crm', '8-digital-transforming-ideas',
        '42-interactive-insights-solutions-for-small-businesses'
    ],
    
    // Web Development & Design
    'web-design': [
        'shopify', 'woocommerce', 'wordpress', 'web-development', 'website-design',
        'responsive-website-design', 'ui-ux', 'prototyping-tools', 'some-great-prototyping-tools',
        'multiplatform-web-based-applications', 'benefits-of-responsive-website-design',
        'service-design', 'everything-you-need-to-know-about-good-branding-and-design-process'
    ],
    
    // Property Technology
    'property-technology': [
        'virtual-tour', '3d-virtual-tour', '3d-walkthroughs', 'matterport', '360',
        'property-technology', 'property-virtual-tours', 'benefits-of-property',
        'benefits-360-virtual-tours', 'benefits-of-digital-twins', 'exploring-the-future-of-office-design',
        'how-a-3d-virtual-tour', 'the-benefits-of-aerial-photography', 'exploring-the-beauty-a-voyage-inside-the-white-rabbit',
        '360deg-scans-igniting-a-booking-revolution'
    ]
};

// Special cases for specific files
const specialCases = {
    '42-interactive-5th-anniversary': 'digital-transformation',
    '42-interactives-2020-journey': 'digital-transformation',
    '42-interactive-supporting-good-cause': 'digital-transformation',
    '42-interactive-clients-highlight': 'digital-transformation',
    'remembering-mariza': 'digital-transformation',
    'ruok': 'digital-transformation',
    'world-childrens-day': 'digital-transformation',
    'experience-in-pax-australia-2018': 'extended-reality',
    'during-the-australian-lockdown-dont-get-down-get-creative': 'technology-development',
    'quarantine-can-be-fun-mobile-games': 'technology-development',
    'food-escape-mobile-game': 'technology-development',
    'find-my-playground': 'digital-transformation',
    'fun-outdoor-activities-for-childrens-development': 'digital-transformation',
    'benefits-of-playgrounds-on-childrens-development': 'digital-transformation',
    'getting-back-to-playgrounds': 'digital-transformation',
    'the-benefits-of-listing-your-business-in-findmyplayground': 'digital-transformation',
    'red-rosters-brand-merge': 'digital-transformation',
    'enhancing-customer-experience-and-safety-red-rooster': 'digital-transformation',
    'enhancing-customer-experience-and-streamlining-design-with-augmented-reality-ar-the-case-of-latham-australia': 'extended-reality',
    'essential-tips-that-will-transform-your-virtual-productivity': 'digital-transformation',
    'youtube-tutorial-xray-plugins': 'technology-development'
};

function getCategory(filename) {
    // Check special cases first
    if (specialCases[filename]) {
        return specialCases[filename];
    }
    
    const lowerFilename = filename.toLowerCase();
    
    // Check each category
    for (const [category, keywords] of Object.entries(categoryMap)) {
        for (const keyword of keywords) {
            if (lowerFilename.includes(keyword)) {
                return category;
            }
        }
    }
    
    // Default to digital-transformation if no match
    return 'digital-transformation';
}

function addCategoryToFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if category already exists
        if (content.includes('category:')) {
            return { skipped: true, file: path.basename(filePath) };
        }
        
        // Get filename without extension
        const filename = path.basename(filePath, '.mdx');
        const category = getCategory(filename);
        
        // Find the frontmatter section and add category
        const frontmatterEnd = content.indexOf('---', 3);
        if (frontmatterEnd === -1) {
            return { error: 'No frontmatter found', file: path.basename(filePath) };
        }
        
        // Check if there's already a category (shouldn't be, but double-check)
        const frontmatter = content.substring(0, frontmatterEnd + 3);
        if (frontmatter.includes('category:')) {
            return { skipped: true, file: path.basename(filePath) };
        }
        
        // Add category before the closing ---
        const beforeFrontmatter = content.substring(0, frontmatterEnd);
        const afterFrontmatter = content.substring(frontmatterEnd);
        
        // Find the last line before ---
        const lines = beforeFrontmatter.split('\n');
        const lastLine = lines[lines.length - 1].trim();
        
        // Add category line
        const newContent = beforeFrontmatter + `category: "${category}"\n` + afterFrontmatter;
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        return { success: true, file: path.basename(filePath), category };
    } catch (error) {
        return { error: error.message, file: path.basename(filePath) };
    }
}

// Main execution
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
const results = {
    success: [],
    skipped: [],
    errors: []
};

console.log(`Processing ${files.length} blog files...\n`);

files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const result = addCategoryToFile(filePath);
    
    if (result.success) {
        results.success.push(result);
        console.log(`✓ ${result.file} → ${result.category}`);
    } else if (result.skipped) {
        results.skipped.push(result);
    } else {
        results.errors.push(result);
        console.error(`✗ ${result.file}: ${result.error}`);
    }
});

console.log(`\n\nSummary:`);
console.log(`✓ Successfully categorized: ${results.success.length}`);
console.log(`⊘ Skipped (already has category): ${results.skipped.length}`);
console.log(`✗ Errors: ${results.errors.length}`);

