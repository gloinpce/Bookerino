# Figma Design Files

This folder contains copies of all important website files that can be shared with Figma for design purposes.

## Structure

```
figma-design-files/
├── README.md              # This file
├── App.tsx               # Main application structure and routing
├── pages/                 # All page components
│   ├── Index.tsx         # Homepage (main landing page) - MOST IMPORTANT
│   ├── Auth.tsx          # Login/Registration page
│   ├── Pricing.tsx       # Pricing plans page
│   ├── Success.tsx       # Payment success page
│   ├── Cancel.tsx        # Payment cancellation page
│   └── NotFound.tsx      # 404 error page
├── components/           # Reusable components
│   └── Navbar.tsx        # Navigation bar component
└── styles/               # Styling files
    └── index.css         # Global styles, design tokens, and CSS variables
```

## Files Description

### App.tsx
Main application file showing the overall structure, routing, and provider setup. This shows how all pages are connected.

### Pages

#### Index.tsx (Homepage) - **MOST IMPORTANT FOR DESIGN**
Complete homepage with:
- Hero section with animated title
- Features section (6 feature cards)
- Testimonials section (3 cards)
- FAQ section (accordion)
- Contact section (form + info)
- CTA section
- Footer

This is the main page that needs the most design attention.

#### Auth.tsx
Login/Registration page with:
- Two-column layout
- Form on left, info card on right
- Toggle between login and registration modes
- Form validation and error handling

#### Pricing.tsx
Pricing page with:
- 3 pricing plan cards
- Feature lists
- CTA buttons
- Popular plan highlighting

#### Success.tsx, Cancel.tsx, NotFound.tsx
Simple status pages with centered content and buttons.

### Components

#### Navbar.tsx
Navigation bar component with:
- Fixed positioning
- Responsive mobile menu
- Active link highlighting
- Smooth scroll navigation

### Styles

#### index.css
Complete styling system including:
- CSS custom properties (design tokens)
- Color system (light and dark modes)
- Gradients
- Typography settings
- Spacing system
- Shadow system
- Elevation system

## How to Use with Figma

1. **Import the files:** You can copy the code from these files into Figma's code view or use them as reference.

2. **Focus on Index.tsx:** This is the main page that needs design work. It contains all major sections.

3. **Use index.css for design tokens:** All colors, spacing, typography, and other design values are defined here.

4. **Reference component structure:** The component files show the structure and layout of each element.

5. **Check App.tsx for routing:** Understand how pages connect and navigate.

## Design Priorities

1. **Homepage (Index.tsx)** - Primary focus
2. **Auth Page** - Important for user onboarding
3. **Pricing Page** - Critical for conversions
4. **Navbar** - Navigation experience
5. **Status Pages** - Simple but important

## Notes

- All files are TypeScript React components
- Styling uses Tailwind CSS classes
- Components use Radix UI primitives
- Icons are from Lucide React
- Animations use GSAP (for SplitText) and CSS transitions

## Related Documentation

See `WEBSITE-DESIGN-DOCUMENTATION.md` in the root directory for complete documentation of the website structure, design tokens, and design guidelines.

