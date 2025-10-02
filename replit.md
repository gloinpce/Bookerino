# BOOKERINO - Hotel Management Automation Platform

## Overview

BOOKERINO is a professional hotel management automation platform designed for modern hoteliers. The system provides comprehensive tools for managing bookings, rooms, reviews, and analytics in a unified dashboard interface. Built with a focus on efficiency and data clarity, it streamlines hotel operations through automated workflows and real-time insights.

The platform features a modern SaaS dashboard design inspired by Linear, Notion, and Booking.com Extranet, emphasizing utility, professional aesthetics, and excellent information hierarchy for hotel staff.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System:**
- Shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for dynamic theming (light/dark mode support)
- Custom design system with defined color palette, typography scale, and spacing primitives
- Component composition pattern using `class-variance-authority` for variant management

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod for form validation
- Context API for theme management and sidebar state
- Custom hooks for authentication (`useAuth`) and mobile detection

**Design Tokens:**
- Comprehensive color system with semantic naming (primary, secondary, destructive, muted, accent)
- Status colors for booking states (confirmed, pending, cancelled, checked-in)
- Light and dark mode variants with HSL color space
- Inter font family for consistent typography
- Standardized spacing scale (4, 6, 8, 12, 16, 24 units)

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and routing
- TypeScript with ES Modules for modern JavaScript features
- Separate development and production build processes (tsx for dev, esbuild for production)

**Database Layer:**
- Neon Serverless PostgreSQL as the database provider
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript types generated from database schema
- Connection pooling via `@neondatabase/serverless`
- WebSocket support for serverless PostgreSQL connections

**Data Models:**
- **Users:** Authentication and profile management (id, email, firstName, lastName, profileImageUrl)
- **Rooms:** Hotel room inventory (id, name, type, capacity, price, status)
- **Bookings:** Reservation management (id, guestName, guestEmail, roomId, checkIn, checkOut, status, totalPrice)
- **Reviews:** Guest feedback system (id, guestName, rating, comment, response, createdAt)
- **Sessions:** Server-side session storage for authentication

**Authentication System:**
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js strategy for authentication flows
- Server-side session management with PostgreSQL storage (connect-pg-simple)
- Session cookies with secure flags and 1-week TTL
- Protected routes using `isAuthenticated` middleware

**Storage Layer:**
- Interface-based storage abstraction (`IStorage`) for potential future implementations
- DatabaseStorage class implementing CRUD operations for all entities
- Centralized database connection management
- Transaction support through Drizzle ORM

### API Architecture

**REST Endpoints:**
- `/api/auth/user` - Get authenticated user information
- `/api/rooms` - CRUD operations for room management
- `/api/bookings` - CRUD operations for booking management
- `/api/reviews` - CRUD operations for review management
- All routes protected with authentication middleware

**Response Format:**
- JSON responses with consistent error handling
- Status codes: 200 (success), 401 (unauthorized), 500 (server error)
- Error messages in `{ message: string }` format
- Request/response logging for API routes with duration tracking

**Request Handling:**
- JSON body parsing with Express middleware
- URL-encoded form data support
- CORS and credentials enabled for cross-origin requests
- Custom error handling middleware for centralized error responses

### Development Tools

**Type Safety:**
- Shared TypeScript types between client and server via `@shared` alias
- Drizzle-Zod integration for runtime validation from database schema
- Strict TypeScript configuration with incremental builds

**Development Experience:**
- Replit-specific plugins for cartographer and dev banner (development only)
- Runtime error overlay for immediate feedback
- Custom Vite middleware mode for Express integration
- Hot Module Replacement preserving server state

**Code Quality:**
- TypeScript strict mode enabled
- ESModuleInterop for CommonJS compatibility
- Skip lib check for faster builds
- Centralized utility functions (cn for className merging)

## External Dependencies

### Third-Party Services

**Authentication:**
- Replit Auth (OpenID Connect provider)
- Session issuer URL: `https://replit.com/oidc`
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables

**Database:**
- Neon Serverless PostgreSQL
- Requires `DATABASE_URL` environment variable
- WebSocket-based connection for serverless environments

### Key NPM Packages

**Frontend Libraries:**
- `@tanstack/react-query` - Server state management and caching
- `@radix-ui/*` - 20+ accessible UI component primitives
- `react-hook-form` + `@hookform/resolvers` - Form handling with validation
- `zod` + `drizzle-zod` - Runtime type validation
- `date-fns` - Date manipulation and formatting
- `recharts` - Data visualization for analytics
- `lucide-react` - Icon system
- `class-variance-authority` - Component variant management
- `tailwindcss` + `autoprefixer` - Styling system
- `wouter` - Lightweight routing

**Backend Libraries:**
- `drizzle-orm` - Type-safe database ORM
- `@neondatabase/serverless` - PostgreSQL driver
- `express` + `express-session` - HTTP server and session management
- `passport` + `openid-client` - Authentication framework
- `connect-pg-simple` - PostgreSQL session store
- `memoizee` - Function memoization for OIDC config

**Build Tools:**
- `vite` - Frontend bundler and dev server
- `esbuild` - Production server bundling
- `tsx` - TypeScript execution for development
- `drizzle-kit` - Database migration tools
- `@vitejs/plugin-react` - React support for Vite
- Replit-specific Vite plugins for development enhancements

### Configuration Requirements

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `REPL_ID` - Replit deployment identifier (required for auth)
- `SESSION_SECRET` - Secret key for session encryption (required)
- `ISSUER_URL` - OIDC issuer URL (defaults to Replit OIDC)
- `REPLIT_DOMAINS` - Allowed domains for authentication
- `NODE_ENV` - Environment flag (development/production)

**Database Setup:**
- PostgreSQL database provisioned through Neon or compatible provider
- Migrations managed through `drizzle-kit push` command
- Session table (`sessions`) required for authentication
- UUID generation support (`gen_random_uuid()`) required for primary keys