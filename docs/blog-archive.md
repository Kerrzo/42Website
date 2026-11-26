# Blog archive

Posts that no longer fit what 42 Interactive does (creative technology, interaction design, custom software and AI). Archived on 2026-11-25 as part of the AEO work (see `aeo-plan.md`).

## What "archived" means

- The `.mdx` file moved from `data/blog/` to `data/blog-archive/`. It is kept in the repo and is not built.
- The post is gone from the blog list and the sitemap, and from search results over time.
- The old URL `/blog/<slug>/` returns a real 404. The 404 page (`src/pages/404.astro`) detects a missing `/blog/...` URL and says "Article No Longer Available. This article doesn't exist anymore. Visit our blog to read the latest articles.", with a "Visit the Blog" button and the three newest articles. No redirect is used, so search engines drop the page.
- Nothing was deleted. Git history keeps every file.

## Restore a post

```powershell
git mv data/blog-archive/<slug>.mdx data/blog/<slug>.mdx
```

Rebuild. The post is live again at its old URL.

## Archived now (70 posts)


### Personal, community, leisure, charity and Covid-era posts (18)

| Post | Date | Slug |
|---|---|---|
| 42 Interactive Supporting Good Causes | 2023-11 | `42-interactive-supporting-good-cause` |
| Bringing Hope and Smiles to These Brave Little Warriors | 2023-11 | `bringing-hope-and-smiles-to-these-brave-little-warriors` |
| Cricket Match in 2020 and Sandy Balls Cricket | 2023-11 | `cricket-matches-in-2020-and-sandy-balls-cricket` |
| How to Play Sandy Balls Cricket | 2023-11 | `how-to-play-sandy-balls-cricket` |
| Get Creative During the Australian Lockdown Don't Get Down | 2023-11 | `during-the-australian-lockdown-dont-get-down-get-creative` |
| Quarantine Fun: Cool and Free Apps for Home Entertainment | 2023-11 | `quarantine-can-be-fun-mobile-games` |
| Tech Essentials: Maximizing Home Life in Social-Distancing | 2023-11 | `using-technology-at-home-while-social-distancing` |
| Ideas for Easter Holiday at Home | 2023-11 | `ideas-for-easter-holiday-at-home` |
| A Better Future for Every Child on World Children's Day | 2023-11 | `world-childrens-day` |
| Are You Okay? - A Conversation That Might Transform a Life | 2023-11 | `ruok` |
| Remembering Mariza | 2023-11 | `remembering-mariza` |
| The Story of an Evil Lab, a Mad Scientist, and Good Tomatoes | 2023-11 | `the-story-of-an-evil-lab-a-mad-scientist-and-good-tomatoes` |
| Lessons in Leadership: Insights from a Japanese Tea Ceremony | 2023-11 | `what-a-tea-ceremony-can-teach-you-about-leadership-and-business-in-japan` |
| Why Naming Your Business is Harder Than Naming Your Children | 2023-11 | `why-naming-your-business-is-harder-than-naming-your-children` |
| Formidable Firepower Added | 2023-11 | `marion-baillat` |
| Anthem Conviction: Film and Game Merger | 2023-11 | `anthem-conviction-film-and-game-merger` |
| Food Escape: Newest Mobile Game by Gargle Blaster Games | 2023-11 | `food-escape-mobile-game` |
| Experience the 2018 PAX Australia Gaming Convention | 2023-11 | `experience-in-pax-australia-2018` |

### Playgrounds and children (FindMyPlayground) (7)

| Post | Date | Slug |
|---|---|---|
| The Joy of Playgrounds: Essential for Child Development | 2023-11 | `benefits-of-playgrounds-on-childrens-development` |
| Fun Outdoor Activities for Children's Development | 2023-11 | `fun-outdoor-activities-for-childrens-development` |
| Resuming Play: Australia Will Lift the Covid-19 Restriction | 2023-11 | `getting-back-to-playgrounds-australia-to-lift-covid-19-restriction-in-3-phases` |
| Activities in Jungle Gyms Can Promote Child Development | 2023-11 | `how-jungle-gym-activities-can-help-child-development` |
| Ways to Help Your Children Cope Through Playground Politics | 2023-11 | `ways-to-help-your-children-cope-through-playground-politics` |
| Your Easy-to-Use Outdoor and Indoor Playground Finder | 2023-11 | `find-my-playground-a-guide-to-locate-and-review-playgrounds` |
| Boost Visibility: List Your Business on FindMyPlayground.com | 2023-11 | `the-benefits-of-listing-your-business-in-findmyplayground-com` |

### Aged care and smart-home topics (4)

| Post | Date | Slug |
|---|---|---|
| 8 Ways Digital Transformation can Improve Your Aged Care Business | 2023-11 | `8-digital-transforming-ideas-for-improving-your-aged-care-business` |
| Challenges and Risks of Aged Care Management | 2023-11 | `challenges-and-risks-of-aged-care-management` |
| The Use of Digital Twins in Aged Care Services | 2023-11 | `the-use-of-digital-twins-in-aged-care-services` |
| Effortless Home Automation with Sonoff Basic WiFi Switch | 2023-11 | `sonoff-basic-a-smart-wifi-switch-for-your-iot-smart-home` |

### Generic SEO, social media, ads and e-commerce platform posts (29)

| Post | Date | Slug |
|---|---|---|
| Boosting Business Online Using SEO | 2023-11 | `boosting-business-online-using-seo` |
| Top 5 Ultimate Benefits Of SEO To Skyrocket Your Profit | 2023-11 | `top-5-ultimate-benefits-of-seo-to-skyrocket-your-profit` |
| The Significance of Page Titles and Meta Descriptions for SEO | 2023-11 | `the-significance-of-page-titles-and-meta-descriptions-for-seo` |
| Optimizing for Success: The Technical SEO Audit Blueprint | 2023-11 | `technical-seo-audit-guide` |
| Keyword Cannibalisation and How to Fix It | 2023-11 | `keyword-cannibalisation-and-how-to-fix-it` |
| Google Domination: Harnessing the Power of Keywords | 2023-11 | `how-to-use-keywords-effectively-in-your-website-to-rank-on-google` |
| From Frames to Rankings: Boosting SEO with Quality Videos | 2023-11 | `how-to-produce-a-high-quality-video-that-increases-your-seo` |
| Maximize your Digital Strategy with SEO and Social Media Marketing | 2023-11 | `how-to-maximize-your-digital-strategy-with-seo-social-media-marketing` |
| How does a search engine work? | 2023-11 | `how-does-a-search-engine-work` |
| Secrets to Success: Small Business Marketing Skills | 2023-11 | `digital-marketing-skills-for-small-businesses` |
| Digital Marketing Tips for Small Businesses | 2023-11 | `digital-marketing-tips-for-small-businesses` |
| Why Is Digital Marketing So Important For Your Business? | 2023-11 | `why-is-digital-marketing-so-important-for-your-business` |
| Why Social Media Marketing Is Important For Your Business? | 2023-11 | `why-social-media-marketing-is-important-for-your-business` |
| From Strategy to Success: Mastering Social Media Marketing | 2023-11 | `how-to-create-a-strategy-for-social-media-marketing` |
| How to Find Unlimited Content Ideas for Social Media | 2023-11 | `how-to-find-unlimited-content-ideas-for-social-media` |
| Why Is Blogging Crucial to Your Brand? | 2023-11 | `why-is-blogging-crucial-to-your-brand` |
| Paid Advertising Strategies: How to Avoid Costly Mistakes | 2023-11 | `valuable-tips-to-avoid-failure-in-paid-advertising` |
| Why Should You Use Google Adwords? | 2023-11 | `why-should-you-use-google-adwords` |
| Email Marketing Automation Advantages for eCommerce | 2023-11 | `email-marketing-automation-advantages-for-ecommerce` |
| Mastering Mobile App Marketing: Key Strategies Unveiled | 2023-11 | `successful-mobile-application-marketing-strategies` |
| Promote and Prosper: Key Strategies for Mobile App Success | 2023-11 | `effective-mobil-app-promotion-strategies-you-need-to-know` |
| What You Need To Know About Brand Activation | 2023-11 | `what-you-need-to-know-about-brand-activation` |
| The Art of Brand Strategy: Crafting a Winning Marketing Plan | 2023-11 | `brand-strategy-and-marketing-plan` |
| Supercharge Your Ecommerce Reports: Google Data Studio Tips | 2023-11 | `how-google-data-studio-can-enhanced-ecommerce-reports` |
| What Google Tag Manager Is and Why You Should Use It? | 2023-11 | `what-google-tag-manager-is-and-why-you-should-use-it` |
| Online Business Through E-commerce | 2023-11 | `e-commerce-getting-business-online` |
| Shopify Vs WooCommerce - Which Is Best? | 2023-11 | `shopify-vs-woocommerce-which-is-best` |
| Pros & Cons: Evaluating WooCommerce for Your Store | 2023-11 | `what-are-the-pros-and-cons-of-woocommerce` |
| Wix to WordPress Migration: The Benefits and The Challenges | 2023-11 | `wix-to-wordpress-migration-the-benefits-and-the-challenges` |

### Generic business-advice and thin posts (12)

| Post | Date | Slug |
|---|---|---|
| What is Digital Working And The Benefits | 2023-11 | `what-is-digital-working-and-the-benefits-digital-nomads` |
| Essential Tips That Will Transform Your Virtual Productivity | 2024-01 | `essential-tips-that-will-transform-your-virtual-productivity` |
| Achieving Excellence: Essential Tips for Managing Your Digital Team | 2023-11 | `managing-a-digital-team-effectively` |
| Why Paperless is Good for Your Business | 2023-11 | `why-paperless-is-good-for-your-business` |
| Contactless Technologies: Why Your Business Needs Them? | 2023-11 | `contactless-technologies-why-your-business-needs-them` |
| The Advantages Of Contactless Delivery for Business | 2023-11 | `the-advantages-of-contactless-delivery-for-business` |
| Tech Transformation: The Financial Landscape of 2020 Onwards | 2023-11 | `technology-as-the-main-expense-on-financial-year-2020-onwards` |
| Weekly Technology Update from Creative Technology Team | 2023-11 | `technology-update` |
| 3 Tech Trends You Should Use for Your Business in 2022 | 2023-11 | `3-tech-trends-you-should-use-for-your-business-in-2022` |
| Beyond Reality: Embracing the Potential of the Metaverse | 2023-11 | `how-can-we-help-you-build-up-your-presence-in-the-metaverse-world` |
| Everything You Need to Know About Good Branding And Design Process | 2023-11 | `everything-you-need-to-know-about-good-branding-and-design-process` |
| Design with Confidence: Explore Top UI/UX Prototyping Tools | 2023-11 | `some-great-prototyping-tools-for-ui-ux-designers` |

## Kept (decision: stay live)

Quality assurance and developer posts stay live because they show our software development work. Decision made 2026-11-25. Their publication dates are being corrected to the original dates (see `aeo-implementation-report.md`).


### Quality assurance and testing (18)

| Post | Date | Slug |
|---|---|---|
| Accelerate Time-to-Market: Benefits of QA as a Service | 2023-11 | `benefits-of-qa-as-a-service` |
| Choosing the Right QA as a Service: Best Practices | 2023-11 | `best-practices-for-choosing-a-qa-as-a-service-provider` |
| Discover the Secrets of Risk Management in Quality Assurance | 2023-11 | `discover-the-secrets-of-risk-management-in-quality-assurance` |
| Testing Troubles: Common QA Errors and How to Avoid Them | 2023-11 | `high-quality-process-of-qa-and-testing` |
| Quality Assurance: A Key Player in Cyber Security Defense | 2023-11 | `how-qa-can-help-your-cyber-security` |
| Mastering the Testing Superpower: Exploratory Testing's Role | 2023-11 | `mastering-the-testing-superpower-exploratory-testings-role` |
| Quick and Effective QA Testing as a Service Techniques | 2023-11 | `qa-as-a-service` |
| QA Perspective for Red Rooster Brand Merge Website | 2023-11 | `qa-perspective-for-red-rooster-brand-merge-website` |
| Quality Assurance [QA] and Testing for Web App Development | 2023-11 | `quality-assurance-and-testing-for-web-app-development` |
| Quality Assurance in XR | 2023-12 | `quality-assurance-in-xr` |
| Software Quality Metrics: Measuring and Improving Quality Assurance [QA] Efforts | 2024-03 | `software-quality-metrics-measuring-and-improving-quality-assurance-qa-efforts` |
| Building Blocks of Effective Software Testing Strategies | 2023-11 | `software-testing` |
| The Evolution of Test Management: Tools & Techniques | 2024-02 | `the-evolution-of-test-management-tools-techniques` |
| The Value of Quality Assurance in Software Development | 2023-11 | `the-importance-of-qa-in-software-development` |
| Unveiling the Game-Changing Secret: How Automation Revolutionises QA Forever! | 2023-11 | `unveiling-the-game-changing-secret-how-automation-revolutionises-qa-forever` |
| Useful Tips on Cypress Automation Test | 2023-11 | `useful-cypress-automation-test-tips` |
| Why Mobile App Testing Is Important And What It Can Do | 2023-11 | `why-mobile-app-testing-is-important-and-what-it-can-do` |
| Writing Test Case Using Specification-Based Technique | 2023-11 | `writing-test-case-using-specification-based-technique` |

### Older developer tutorials and tooling (24)

| Post | Date | Slug |
|---|---|---|
| Unleashing the Potential: Advantages of React JS Framework | 2023-11 | `benefits-of-using-react` |
| Content Management Systems (CMS) | 2023-11 | `content-management-system` |
| Developing a Simple E-commerce Mobile App with Flutter & GetX using the MVVM Pattern | 2024-04 | `developing-a-simple-e-commerce-mobile-app-with-flutter-getx-using-the-mvvm-pattern` |
| Essential Flutter Widgets When Developing Mobile Apps | 2024-06 | `essential-flutter-widgets-when-developing-mobile-apps` |
| Exploring SwiftUI: Building a Map App with MVVM Architecture | 2024-07 | `exploring-swiftui-building-a-map-app-with-mvvm-architecture` |
| Mastering Search: How Algolia API Optimizes User Engagement | 2023-11 | `fasten-up-your-search-with-algolia` |
| Feature Flags: Safeguarding Your Release Process Effectively | 2023-11 | `feature-flag-for-safer-release` |
| Boost Website Speed: Mastering Google PageSpeed Insights | 2023-11 | `how-to-improve-google-pagespeed-insights-score-of-your-website` |
| How to Increase Your Mobile Games Performance | 2023-11 | `how-to-increase-your-mobile-games-performance` |
| Implementing OData: A Game-Changing Approach in ASP.NET Core | 2023-11 | `introducing-odata-with-asp-net-core` |
| Introduction to Jetpack Compose: A Revolutionary Native Android UI Development Toolkit | 2024-05 | `introduction-to-jetpack-compose-a-revolutionary-native-android-ui-development-toolkit` |
| Json Web Token (JWT) Authentication. A How to Guide | 2023-11 | `json-web-token-jwt-authentication-a-how-to-guide` |
| Leveraging The Potential of Cloud Computing: Exploring the Advantages of Cloud-based Solutions | 2023-11 | `leveraging-the-potential-of-cloud-computing-exploring-the-advantages-of-cloud-based-solutions` |
| Sitecore and Its Benefits | 2023-11 | `sitecore-and-its-benefits` |
| The Advantages Of Utilising A CRM For Your Business | 2023-11 | `the-advantages-of-utilising-a-crm-for-your-business` |
| Take Your Business to New Heights with Aerial Photography | 2023-11 | `the-benefits-of-aerial-photography-for-business` |
| The Impact of 5G Technology on Digital Experience | 2024-02 | `the-impact-of-5g-technology-on-digital-experience` |
| The Power of Internet of Things and Hyperconnectivity! | 2024-05 | `the-power-of-internet-of-things-and-hyperconnectivity` |
| Maximize Data Potential: Embracing the Benefits of Power BI | 2023-11 | `using-power-bi` |
| We are now the Partner of Sitecore | 2023-11 | `we-are-now-the-partner-of-sitecore` |
| Master the Art of Design: Why Figma is the Ultimate Solution | 2023-11 | `why-you-should-use-figma` |
| Why Your Business Needs CRM and CMS | 2023-11 | `why-your-business-needs-crm-and-cms` |
| Working with Javascript Array of Objects | 2023-11 | `working-with-javascript-array-of-objects` |
| Xamarin Forms Shell: Streamline Your Mobile App Development | 2023-11 | `xamarin-forms-shell` |
