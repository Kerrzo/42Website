# Blog Categories Reference

This document outlines the 6 categories used for filtering blogs on the blog listing page.

## Categories

1. **technology-development** - "Technology & Development"
   - Development tools, frameworks, coding languages
   - Examples: React, Flutter, Xamarin, Unity, JavaScript, X-Ray plugins, Figma

2. **extended-reality** - "Extended Reality (XR)"
   - Virtual Reality (VR), Augmented Reality (AR), Mixed Reality (MR)
   - VR headsets, XR development, immersive experiences
   - Examples: VR exploration, AR development, XR quality assurance

3. **quality-assurance** - "Quality Assurance"
   - Testing, QA processes, test management, automation testing
   - Examples: QA as a service, test automation, quality metrics

4. **digital-transformation** - "Digital Transformation"
   - Business strategy, digital solutions, business growth
   - Examples: Digital transformation strategies, business digitization, CRM/CMS

5. **web-design** - "Web Development & Design"
   - Web development, UI/UX design, design tools
   - Examples: WordPress, Shopify, web development, design tools

6. **property-technology** - "Property Technology"
   - Virtual tours, 3D scans, Matterport, property tech
   - Examples: Virtual property tours, 3D walkthroughs, Matterport scans

## How to Add Categories

Add the `category` field to the frontmatter of each MDX file:

```yaml
---
title: "Your Blog Title"
publishedAt: "2023-11-05"
summary: "Your summary"
image: "/blog/images/your-image.jpg"
category: "technology-development"  # Add this line
---
```

## Category Values

Use these exact values (lowercase with hyphens):
- `technology-development`
- `extended-reality`
- `quality-assurance`
- `digital-transformation`
- `web-design`
- `property-technology`

## Notes

- If a blog post doesn't have a category, it will default to "all" and appear in all views
- Categories are case-sensitive - use lowercase with hyphens
- A blog can only have one category

