/**
 * Industries we have worked in, taken from the case studies on this site.
 * Used on /services/ ("Industries We Know") and /industries/.
 * Add an industry only when there is a case study to link to.
 */
export interface Industry {
    title: string;
    text: string;
    /** Industry overview page, when one exists */
    overview?: string;
    work: { name: string; href: string }[];
}

export const industries: Industry[] = [
    {
        title: "Commercial Real Estate",
        text: "Connected workplace platforms, digital access permits, loyalty and brand design for International Towers.",
        overview: "/industries/commercial-real-estate/",
        work: [
            { name: "Connecting People to Workplace", href: "/what-we-do/connecting-people-to-workplace/" },
            { name: "A Brand That Feels Like a Friend", href: "/what-we-do/a-brand-that-feels-like-a-friend/" },
        ],
    },
    {
        title: "Quick Service Restaurants",
        text: "Online ordering, delivery, pickup and loyalty for Red Rooster, Oporto and Chicken Treat.",
        overview: "/industries/quick-service-restaurants/",
        work: [
            { name: "Building Restaurants of The Future", href: "/what-we-do/building-restaurants-of-the-future/" },
        ],
    },
    {
        title: "Healthcare",
        text: "A VR therapy experience that helps people manage chronic pain, for Innovate Pain Clinic.",
        work: [
            { name: "A Better Way to Manage Pain", href: "/what-we-do/a-better-way-to-manage-pain/" },
        ],
    },
    {
        title: "Arts and Culture",
        text: "A digital twin of White Rabbit Gallery's collection, and an interactive artwork for VIVID Sydney 2019.",
        work: [
            { name: "Immortalising Creativity", href: "/what-we-do/immortalising-creativity/" },
            { name: "Putting Smiles on Peoples Faces", href: "/what-we-do/putting-smiles-on-peoples-faces/" },
        ],
    },
    {
        title: "Theatre and Live Performance",
        text: "Box Office VR, an immersive VR theatre streaming platform with on-demand performances.",
        work: [
            { name: "The Magic of Theatre at Home", href: "/what-we-do/the-magic-of-theatre-at-home/" },
        ],
    },
    {
        title: "Building Products",
        text: "An augmented reality showcase that helps architects, interior designers and builders see Latham's products in the real world.",
        work: [
            { name: "Bringing Products to Life", href: "/what-we-do/bringing-products-to-life/" },
        ],
    },
    {
        title: "Strategy and Consulting",
        text: "An AI platform for Waterfield that turns conversations at scale into real consensus and insight.",
        work: [
            { name: "Putting the Intelligence in AI", href: "/what-we-do/putting-the-intelligence-in-ai/" },
        ],
    },
];
