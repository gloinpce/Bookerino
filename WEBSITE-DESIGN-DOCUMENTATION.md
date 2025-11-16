# Bookerino Website Design Documentation

## Overview
This document provides comprehensive documentation of the Bookerino website codebase for Figma design purposes. The website is built with React, TypeScript, Tailwind CSS, and uses modern UI components from Radix UI.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Main Application Files](#main-application-files)
3. [Pages](#pages)
4. [Components](#components)
5. [Styling System](#styling-system)
6. [Design Tokens](#design-tokens)
7. [Layout Structure](#layout-structure)
8. [Interactive Elements](#interactive-elements)

---

## Project Structure

```
client/src/website/
├── App.tsx                 # Main application router and provider setup
├── main.tsx                # Application entry point
├── index.css               # Global styles and design tokens
├── pages/                  # All page components
│   ├── Index.tsx          # Homepage (main landing page)
│   ├── Auth.tsx           # Login/Registration page
│   ├── Pricing.tsx        # Pricing plans page
│   ├── Success.tsx        # Payment success page
│   ├── Cancel.tsx         # Payment cancellation page
│   └── NotFound.tsx       # 404 error page
└── components/            # Reusable components
    ├── Navbar.tsx         # Navigation bar component
    └── ui/                # UI component library (Radix UI based)
```

---

## Main Application Files

### `App.tsx` - Application Root
**Location:** `client/src/website/App.tsx`

**Purpose:** Main application component that sets up routing, providers, and global components.

**Key Features:**
- React Router for navigation
- QueryClient for data fetching
- Toast notifications (Toaster & Sonner)
- Stack Auth initialization
- Lazy loading for Auth component

**Routes:**
- `/` - Homepage (Index)
- `/lander` - Alternative landing page (same as Index)
- `/auth` - Authentication page (Login/Register)
- `/pricing` - Pricing plans
- `/success` - Payment success
- `/cancel` - Payment cancellation
- `*` - 404 Not Found page

---

## Pages

### 1. Index.tsx - Homepage
**Location:** `client/src/website/pages/Index.tsx`

**Sections:**
1. **Hero Section**
   - Large animated title "Bookerino" using SplitText component
   - Subtitle: "Soluție Completă de Management HoReCa"
   - Two CTA buttons: "Începe Perioada de Probă" and "Află Mai Multe"
   - Decorative wave SVG at bottom

2. **Features Section** (`id="features"`)
   - 6 feature cards in grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
   - Features:
     - Analiză Financiară (Financial Analysis)
     - Rezervări Inteligente (Smart Bookings)
     - Managementul Camerelor (Room Management)
     - Managementul Oaspeților (Guest Management)
     - Suport Multi-Proprietate (Multi-Property Support)
     - Analiza Performanței (Performance Analytics)
   - Each card has icon, title, and description
   - Hover effects: scale and shadow transitions

3. **Testimonials Section**
   - 3 testimonial cards
   - Each includes: 5-star rating, quote, name, role, company
   - Background: `bg-muted/30`

4. **FAQ Section**
   - Accordion component with 5 questions
   - Questions cover: free trial, business types, integrations, data security, technical support

5. **Contact Section** (`id="contact"`)
   - Two-column layout:
     - Left: Contact information (email, phone, address)
     - Right: Contact form (name, email, message)
   - Form includes validation and toast notifications

6. **CTA Section**
   - Call-to-action card with gradient background
   - Two buttons: "Începe Astăzi" and "Vezi Prețurile"

7. **Footer**
   - 4-column grid layout
   - Sections: About, Product, Company, Support
   - Copyright notice

**Design Elements:**
- Gradient backgrounds (`bg-gradient-hero`, `bg-gradient-subtle`)
- Smooth scroll navigation
- Hover animations (scale, shadow)
- Responsive grid layouts
- Card-based design system

---

### 2. Auth.tsx - Authentication Page
**Location:** `client/src/website/pages/Auth.tsx`

**Layout:**
- Two-column grid (side-by-side on desktop, stacked on mobile)
- Left: Authentication form
- Right: Information card

**Form Features:**
- Toggle between Login and Registration modes
- Login fields: Email, Password, Remember me checkbox, Forgot password link
- Registration fields: Name, Email, Password, Confirm Password
- Form validation
- Loading states
- Error handling with error messages
- Success navigation

**Information Card:**
- Dynamic content based on mode (Login/Register)
- List of benefits with checkmarks
- Styled with `bg-primary/5`

**Design Elements:**
- Card-based layout
- Form inputs with labels
- Primary button for submission
- Link to toggle between modes
- Back to homepage link

---

### 3. Pricing.tsx - Pricing Page
**Location:** `client/src/website/pages/Pricing.tsx`

**Layout:**
- Centered header with title and description
- 3-column grid of pricing cards
- Back to homepage link

**Pricing Plans:**
1. **Starter Plan**
   - Price: 0 lei/lună
   - Features: Up to 10 rooms, Basic bookings, Email support, Basic reports

2. **Professional Plan** (Popular - highlighted)
   - Price: 299 lei/lună
   - Features: Up to 50 rooms, All features, Priority support, Advanced reports, API integrations
   - Special styling: `border-primary shadow-lg scale-105`

3. **Enterprise Plan**
   - Price: 599 lei/lună
   - Features: Unlimited rooms, All features, Dedicated 24/7 support, Custom reports, Custom integrations, Training included

**Design Elements:**
- Card-based pricing cards
- Popular badge for Professional plan
- Check icons for features
- CTA button on each card
- Responsive grid layout

---

### 4. Success.tsx - Payment Success Page
**Location:** `client/src/website/pages/Success.tsx`

**Layout:**
- Centered card layout
- Green checkmark icon
- Success message
- Button to navigate to dashboard

**Design Elements:**
- Centered content
- Green success color (`text-green-500`)
- Card container
- Full-width button

---

### 5. Cancel.tsx - Payment Cancellation Page
**Location:** `client/src/website/pages/Cancel.tsx`

**Layout:**
- Centered card layout
- Red X icon
- Cancellation message
- Two buttons: "Vezi Planuri" and "Pagina Principală"

**Design Elements:**
- Centered content
- Red error color (`text-red-500`)
- Card container
- Two-button layout

---

### 6. NotFound.tsx - 404 Page
**Location:** `client/src/website/pages/NotFound.tsx`

**Layout:**
- Centered card layout
- Large "404" text
- Error message
- Button to return to homepage

**Design Elements:**
- Centered content
- Large bold 404 text
- Card container
- Full-width button

---

## Components

### Navbar.tsx - Navigation Bar
**Location:** `client/src/website/components/Navbar.tsx`

**Features:**
- Fixed position at top
- Transparent background that becomes opaque on scroll
- Responsive design (mobile menu)
- Active link highlighting
- Smooth scroll for anchor links

**Navigation Links:**
- Acasă (Home) - `/`
- Prețuri (Pricing) - `/pricing`
- Funcții (Features) - `/#features`
- Contact - `/#contact`
- Autentificare (Login) button

**Mobile Menu:**
- Hamburger icon that transforms to X
- Dropdown menu with all links
- Full-width login button

**Design Elements:**
- Fixed positioning (`fixed top-0`)
- Backdrop blur on scroll
- Transition animations
- Z-index: 50

---

## Styling System

### index.css - Global Styles
**Location:** `client/src/website/index.css`

**Design Tokens:**

#### Color System (Light Mode)
- **Primary:** `hsl(220, 90%, 50%)` - Blue
- **Background:** `hsl(0, 0%, 100%)` - White
- **Foreground:** `hsl(220, 15%, 8%)` - Dark gray
- **Muted:** `hsl(220, 12%, 91%)` - Light gray
- **Accent:** `hsl(220, 18%, 92%)` - Light blue-gray
- **Destructive:** `hsl(0, 72%, 51%)` - Red

#### Gradients
- **Background Gradient:** `linear-gradient(135deg, hsl(220, 100%, 99%) 0%, hsl(210, 100%, 98%) 50%, hsl(200, 100%, 98%) 100%)`
- **Hero Gradient:** `linear-gradient(135deg, hsl(192, 78%, 48%) 0%, hsl(220, 90%, 45%) 50%, hsl(192, 78%, 48%) 100%)`
- **Card Gradient:** `linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsl(220, 20%, 99.5%) 100%)`

#### Typography
- **Font Sans:** 'Playfair Display', serif
- **Font Serif:** 'Inter', sans-serif
- **Font Mono:** 'Inter', sans-serif
- **Base Font Size:** 19px

#### Spacing & Shadows
- **Border Radius:** 0.7rem (8px)
- **Shadows:** Multiple levels from 2xs to 2xl
- **Spacing:** 0.25rem base unit

#### Elevation System
- **Elevate-1:** `rgba(0,0,0, .03)` - Subtle hover
- **Elevate-2:** `rgba(0,0,0, .08)` - Active/pressed

---

## Design Tokens

### CSS Variables (Custom Properties)

#### Backgrounds
```css
--background: 0 0% 100%
--background-gradient: linear-gradient(...)
--card: 0 0% 100%
--card-gradient: linear-gradient(...)
```

#### Colors
```css
--primary: 220 90% 50%
--primary-foreground: 0 0% 100%
--foreground: 220 15% 8%
--muted-foreground: 220 10% 45%
--accent: 220 18% 92%
```

#### Spacing
```css
--radius: 0.7rem
--spacing: 0.25rem
```

#### Shadows
```css
--shadow-sm: 0px 2px 6px -1px hsl(...)
--shadow-md: 0px 8px 20px -4px hsl(...)
--shadow-lg: 0px 12px 28px -6px hsl(...)
```

---

## Layout Structure

### Container System
- **Container:** `container mx-auto px-4`
- **Max Width:** Responsive (default Tailwind container)
- **Padding:** Horizontal padding of 1rem (px-4)

### Grid Layouts
- **Features:** `grid gap-8 md:grid-cols-2 lg:grid-cols-3`
- **Testimonials:** `grid gap-8 md:grid-cols-3`
- **Pricing:** `grid gap-8 md:grid-cols-3`
- **Contact:** `grid md:grid-cols-2 gap-8`
- **Footer:** `grid md:grid-cols-4 gap-8`

### Section Spacing
- **Section Padding:** `py-20` (vertical padding)
- **Section Margin:** `mb-16` (between sections)
- **Card Padding:** `p-8` (internal card padding)

---

## Interactive Elements

### Buttons
**Primary Button:**
- Background: `bg-background text-primary`
- Hover: `hover:bg-background/90`
- Shadow: `shadow-card`
- Transition: `transition-all hover:scale-105`

**Outline Button:**
- Border: `border-primary-foreground/20`
- Background: `bg-primary-foreground/10`
- Hover: `hover:bg-primary-foreground/20`

### Cards
- Base: `Card` component with shadow
- Hover: `hover:shadow-card hover:scale-105`
- Transition: `transition-all`
- Padding: `p-8` or `p-6`

### Forms
- Input fields with labels
- Validation states
- Error messages
- Loading states
- Submit buttons

### Animations
- **Fade In:** `animate-fade-in`
- **Scale on Hover:** `hover:scale-105`
- **Smooth Scroll:** `scrollIntoView({ behavior: "smooth" })`
- **SplitText Animation:** GSAP-based character animation

### Transitions
- **Color:** `transition-colors`
- **All:** `transition-all`
- **Transform:** `transition-transform`
- **Duration:** Default Tailwind durations

---

## Component Library (UI Components)

All UI components are located in `client/src/website/components/ui/` and are based on Radix UI primitives with Tailwind CSS styling.

**Key Components:**
- Button
- Card
- Input
- Textarea
- Label
- Accordion
- Toast
- Dialog
- And 40+ more components

---

## Responsive Breakpoints

Following Tailwind CSS default breakpoints:
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

---

## File Locations for Figma

All files needed for Figma design are located in the `figma-design-files/` folder:

```
figma-design-files/
├── App.tsx                 # Main app structure
├── pages/
│   ├── Index.tsx          # Homepage (complete)
│   ├── Auth.tsx           # Login/Register page
│   ├── Pricing.tsx        # Pricing page
│   ├── Success.tsx        # Success page
│   ├── Cancel.tsx         # Cancel page
│   └── NotFound.tsx       # 404 page
├── components/
│   └── Navbar.tsx         # Navigation component
└── styles/
    └── index.css          # All design tokens and styles
```

---

## Design Guidelines

### Color Usage
- **Primary:** Used for CTAs, links, and important elements
- **Background:** Main page background with gradient
- **Card:** White cards with subtle gradients
- **Muted:** Secondary text and less important elements

### Typography Hierarchy
1. **Hero Title:** `text-5xl sm:text-6xl lg:text-7xl font-bold`
2. **Section Titles:** `text-4xl font-bold`
3. **Card Titles:** `text-2xl font-semibold`
4. **Body Text:** `text-lg` or `text-base`
5. **Small Text:** `text-sm`

### Spacing System
- **Section Spacing:** `py-20` (80px vertical)
- **Card Spacing:** `p-8` (32px all sides)
- **Grid Gaps:** `gap-8` (32px)
- **Element Spacing:** `space-y-4` (16px vertical)

### Border Radius
- **Default:** `0.7rem` (8px)
- **Buttons:** Inherits from default
- **Cards:** Inherits from default
- **Inputs:** `rounded-md` (6px)

---

## Notes for Figma Designers

1. **Component-Based Design:** The website uses a component-based architecture. Design reusable components that can be composed into pages.

2. **Responsive Design:** All layouts are responsive. Design mobile-first, then expand to tablet and desktop.

3. **Animation:** Include hover states, transitions, and micro-interactions in your designs.

4. **Accessibility:** Ensure proper contrast ratios, focus states, and semantic HTML structure.

5. **Design Tokens:** Use the CSS variables as design tokens for consistency.

6. **Gradients:** The website heavily uses gradients, especially for hero sections and backgrounds.

7. **Cards:** Card-based design is central to the UI. Ensure cards have proper shadows, spacing, and hover effects.

8. **Forms:** Design forms with clear labels, validation states, and error messages.

---

## Additional Resources

- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/
- **Lucide Icons:** https://lucide.dev/
- **React Router:** https://reactrouter.com/

---

**Last Updated:** November 2025
**Version:** 1.0.0

