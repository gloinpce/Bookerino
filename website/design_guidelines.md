# Design Guidelines: Hotel Management Automation Platform

## Design Approach
**System Selected:** Modern SaaS Dashboard (inspired by Linear, Notion, and Booking.com Extranet)
**Rationale:** This is a utility-focused application for hotel staff requiring efficiency, clarity, and data density. Professional dashboard aesthetics with excellent information hierarchy.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 90% 45% (Professional blue for actions, headers)
- Background: 0 0% 100% (Pure white)
- Surface: 220 15% 97% (Light gray for cards)
- Border: 220 15% 88% (Subtle dividers)
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%

**Dark Mode:**
- Primary: 220 90% 55%
- Background: 220 15% 10%
- Surface: 220 15% 14%
- Border: 220 15% 22%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%

**Status Colors:**
- Success (Confirmed bookings): 142 76% 36%
- Warning (Pending): 38 92% 50%
- Error (Cancelled): 0 72% 51%
- Info (Checked-in): 199 89% 48%

### B. Typography
**Font Families:**
- Primary: 'Inter' (headings, UI elements)
- Secondary: 'Inter' (body, data)

**Scale:**
- H1: text-3xl font-bold (Dashboard titles)
- H2: text-2xl font-semibold (Section headers)
- H3: text-xl font-semibold (Card titles)
- Body: text-base (Standard content)
- Small: text-sm (Labels, metadata)
- Tiny: text-xs (Timestamps, helper text)

### C. Layout System
**Spacing Primitives:** Use 4, 6, 8, 12, 16, 24 units
- Component padding: p-6
- Card spacing: space-y-4
- Section margins: mb-8
- Container max-width: max-w-7xl

**Grid System:**
- Dashboard stats: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Booking cards: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
- Main layout: Sidebar (w-64) + Content area

### D. Component Library

**Navigation:**
- Persistent sidebar with hotel logo, main sections (Dashboard, Bookings, Reviews, Rooms, Analytics)
- Top bar with search, notifications, user profile
- Breadcrumb navigation for deep pages

**Dashboard Cards:**
- Stats cards with icon, metric, change indicator (↑ 12% vs last week)
- Quick actions buttons
- Recent activity feed
- Upcoming check-ins/check-outs list

**Data Tables:**
- Sortable columns with hover states
- Row actions (view, edit, delete)
- Pagination and filters
- Status badges with appropriate colors
- Responsive: stack to cards on mobile

**Booking Management:**
- Calendar view with availability heatmap
- Booking detail cards with guest info, room type, dates, status
- Quick status update dropdown
- Guest communication timeline

**Review Interface:**
- Review cards with star rating, guest name, date
- Response textarea with character counter
- Sentiment indicators (positive/negative)
- Filter by rating and date

**Forms:**
- Floating labels for inputs
- Clear validation states (border color changes)
- Helper text below fields
- Action buttons right-aligned

**Modals/Overlays:**
- Centered modals with backdrop blur
- Clear close button
- Action buttons in footer

### E. Imagery

**Dashboard:**
- No hero image (utility app)
- Small hotel logo in sidebar
- Icons for stat cards (booking icon, revenue icon, guest icon, room icon)
- Empty states with simple illustrations

**Room Management:**
- Room thumbnail images in cards (4:3 ratio, rounded corners)
- Image gallery in detail view

## Page Structure

### Dashboard Layout
- Sidebar navigation (left, fixed)
- Top stats row (4 KPI cards)
- Main grid: Recent bookings (left 2/3) + Quick actions sidebar (right 1/3)
- Bottom: Upcoming check-ins calendar view

### Bookings Page
- Filter bar (status, date range, room type)
- Booking cards grid with status badges
- Click to expand detail view (sliding panel from right)

### Reviews Page
- Review cards with star rating prominently displayed
- Inline reply functionality
- Filter/sort toolbar

### Room Management
- Room cards with image, name, capacity, price
- Availability calendar overlay
- Quick edit actions

### Analytics Page
- Date range selector
- Chart cards (revenue trend, occupancy rate, booking sources)
- Exportable data tables

## Design Principles
1. **Information Density:** Maximize useful data per screen while maintaining readability
2. **Status Clarity:** Use color-coded badges and icons for quick scanning
3. **Action Accessibility:** Primary actions always visible, secondary in menus
4. **Responsive Data:** Tables collapse to cards on mobile
5. **Consistent Hierarchy:** Clear visual weight from primary to tertiary information

## Animations
Minimal and purposeful only:
- Smooth transitions on modal open/close (200ms)
- Hover states on interactive elements
- Loading skeletons for data fetching