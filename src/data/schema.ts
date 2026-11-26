/**
 * Structured data (schema.org JSON-LD) for 42interactive.com.
 *
 * Only facts that are true and approved are listed here. Do not add ratings,
 * awards, prices or street addresses without approval.
 * Pages pass the result to <BaseLayout jsonLd={...} />.
 */
export const SITE = "https://42interactive.com";

export const ids = {
    org: `${SITE}/#organization`,
    website: `${SITE}/#website`,
    dhani: `${SITE}/#dhani-sutanto`,
    paul: `${SITE}/#paul-kerr`,
};

const description =
    "42 Interactive is a Sydney-based creative technology company. We design and develop digital experiences, custom software and AI solutions for businesses.";

const logo = {
    "@type": "ImageObject",
    url: `${SITE}/images/42logoWhite.jpg`,
    width: 256,
    height: 256,
};

/** Short reference used inside other nodes (publisher, provider). */
export const orgRef = {
    "@type": "Organization",
    "@id": ids.org,
    name: "42 Interactive",
    url: `${SITE}/`,
    logo,
};

const organization = {
    "@type": "Organization",
    "@id": ids.org,
    name: "42 Interactive",
    legalName: "42 Interactive Pty Ltd",
    url: `${SITE}/`,
    logo,
    image: `${SITE}/images/og-default.jpg`,
    slogan: "Building What Others Only Imagine",
    description,
    address: {
        "@type": "PostalAddress",
        addressLocality: "Sydney",
        addressRegion: "NSW",
        addressCountry: "AU",
    },
    sameAs: [
        "https://au.linkedin.com/company/42-interactive",
        "https://www.instagram.com/42interactive/",
        "https://www.youtube.com/@42interactive",
    ],
    employee: [{ "@id": ids.dhani }, { "@id": ids.paul }],
};

const website = {
    "@type": "WebSite",
    "@id": ids.website,
    url: `${SITE}/`,
    name: "42 Interactive",
    description,
    inLanguage: "en-AU",
    publisher: { "@id": ids.org },
};

const people = [
    {
        "@type": "Person",
        "@id": ids.dhani,
        name: "Dhani Sutanto",
        jobTitle: "Chief Creative Officer",
        worksFor: { "@id": ids.org },
        sameAs: ["https://www.linkedin.com/in/dhanisutanto"],
    },
    {
        "@type": "Person",
        "@id": ids.paul,
        name: "Paul Kerr",
        jobTitle: "Chief Technology Officer",
        worksFor: { "@id": ids.org },
        sameAs: ["https://www.linkedin.com/in/kerrzo"],
    },
];

/** Company graph: for the homepage and /who-we-are/. */
export const companyGraph = () => ({
    "@context": "https://schema.org",
    "@graph": [organization, website, ...people],
});

/** Service nodes (built from the visible service cards). A service may set its own `url`. */
export const serviceGraph = (
    pagePath: string,
    services: { title: string; text: string; url?: string }[],
) => ({
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
        "@type": "Service",
        "@id": `${SITE}${pagePath}#${s.title
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`,
        name: s.title,
        serviceType: s.title,
        description: s.text,
        url: `${SITE}${s.url ?? pagePath}`,
        provider: orgRef,
    })),
});

/** BreadcrumbList. Only use it on pages that show the same breadcrumbs. */
export const breadcrumbGraph = (items: { name: string; path: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `${SITE}${it.path}`,
    })),
});

/** FAQPage. Questions and answers must match the visible FAQ word for word. */
export const faqGraph = (faqs: { q: string; a: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
});

const authors: Record<string, object> = {
    "Dhani Sutanto": { "@type": "Person", "@id": ids.dhani, name: "Dhani Sutanto" },
    "Paul Kerr": { "@type": "Person", "@id": ids.paul, name: "Paul Kerr" },
};

/** BlogPosting for one post. Posts without a named author are credited to 42 Interactive. */
export const blogPostingGraph = (post: {
    title: string;
    description?: string;
    image?: string;
    publishedAt: string;
    url: string;
    author?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${post.url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    headline: post.title.length > 110 ? post.title.slice(0, 107) + "..." : post.title,
    description: post.description,
    image: post.image ? new URL(post.image, SITE).href : `${SITE}/images/og-default.jpg`,
    datePublished: post.publishedAt,
    inLanguage: "en",
    author: (post.author && authors[post.author]) || orgRef,
    publisher: orgRef,
});
