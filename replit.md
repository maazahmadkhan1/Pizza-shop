# Cosmic Pizza & Donair - Restaurant Website

## Overview

Cosmic Pizza & Donair is a modern restaurant website built for a halal pizza and donair chain in Canada. The application features a clean, sophisticated design inspired by modern food delivery apps like Chipotle and Sweetgreen, with a focus on showcasing food quality, halal certification, and providing an intuitive customer experience.

The project is a full-stack web application with a React-based frontend using TypeScript and a Node.js/Express backend. It emphasizes visual storytelling, smooth animations, and a mobile-first responsive design approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management and API calls

**UI Component Library**
- **shadcn/ui** component system built on Radix UI primitives
- Follows the "new-york" style variant with customizable theming
- All components are installed locally in `client/src/components/ui/` for full control
- Components use CSS variables for theming support (light/dark modes)

**Styling Approach**
- **Tailwind CSS** for utility-first styling with custom configuration
- Custom design tokens defined in `tailwind.config.ts` for colors, spacing, and border radius
- CSS variables in `index.css` for dynamic theming (light/dark mode support)
- Framer Motion for animations and page transitions
- Design guidelines in `design_guidelines.md` specify typography (Inter/Poppins fonts), spacing units, and component patterns

**Component Structure**
- Page components in `client/src/pages/` (Home, Menu, BuildYourOwn, About, Contact, Ingredients)
- Reusable UI components in `client/src/components/` (Hero, PizzaCard, PizzaBuilder, FeatureSection, Header, Footer)
- Component examples in `client/src/components/examples/` for development reference
- All routes support page transitions via Framer Motion's AnimatePresence

### Backend Architecture

**Server Framework**
- **Express.js** for the HTTP server and API routing
- TypeScript for type safety across the entire backend
- ESM (ES Modules) format throughout the project

**API Design**
- RESTful API structure with routes prefixed under `/api`
- Route registration system in `server/routes.ts`
- Request/response logging middleware with duration tracking
- JSON body parsing with raw body preservation for webhook compatibility

**Data Storage**
- **Storage Interface Pattern**: Abstract `IStorage` interface in `server/storage.ts`
- **In-Memory Implementation**: `MemStorage` class for development (currently active)
- **Database-Ready**: Designed to swap in PostgreSQL via Drizzle ORM when needed
- User authentication schema defined but not yet implemented

**Development Tools**
- Vite middleware integration for HMR in development
- Custom error overlay plugin for runtime errors
- Replit-specific plugins for development banner and cartographer (when in Replit environment)

### Data Storage Solutions

**Database Schema (Drizzle ORM)**
- Configured for PostgreSQL via `@neondatabase/serverless` driver
- Schema definitions in `shared/schema.ts`:
  - `users` table with UUID primary keys, username/password fields
  - TypeScript interfaces for Pizza, PizzaSize, PizzaCrust, PizzaSauce, PizzaTopping
  - Zod schemas for runtime validation using `drizzle-zod`

**Current State**
- Database connection configured but not actively used
- Mock data currently served from page components (marked with TODO comments)
- Storage abstraction allows easy migration from in-memory to PostgreSQL

**Migration Strategy**
- Drizzle Kit configured with `drizzle.config.ts`
- Migrations directory: `./migrations`
- `db:push` script available for schema synchronization

### Authentication and Authorization

**Current Implementation**
- **Firebase Authentication** integrated for user authentication
- **Firebase SDK** (`firebase` package) configured in `client/src/lib/firebase.ts`
- **AuthContext** (`client/src/contexts/AuthContext.tsx`) provides authentication state and methods across the app
- Sign in/Sign up functionality with:
  - Email and password authentication
  - Google OAuth login via popup
- Authentication state management via Firebase's `onAuthStateChanged` listener
- Header component includes Sign In/Sign Up buttons (when logged out) and user menu with avatar (when logged in)
- Mobile-responsive authentication UI with dialogs for sign in/sign up flows

**Firebase Configuration**
- Requires environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_PROJECT_ID`
- Firebase config file prevents duplicate initialization during hot reload
- Storage bucket configured to use standard `appspot.com` domain

**Authentication Features**
- SignInDialog component with email/password and Google login
- SignUpDialog component with email/password registration and password confirmation
- User dropdown menu in header with profile access and sign out
- Toast notifications for success/error feedback
- Form validation (password length, matching passwords, required fields)

### External Dependencies

**UI and Component Libraries**
- **Radix UI**: Complete suite of unstyled, accessible UI primitives (accordion, dialog, dropdown, etc.)
- **Framer Motion**: Animation library for page transitions and interactive elements
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority (CVA)**: Utility for managing component variants
- **cmdk**: Command palette component
- **date-fns**: Date manipulation and formatting
- **Embla Carousel**: Carousel/slider functionality

**Authentication**
- **Firebase**: Authentication SDK for email/password and Google OAuth login
- Firebase initialized in `client/src/lib/firebase.ts` with config from environment variables
- AuthContext provides authentication methods: `signup`, `login`, `loginWithGoogle`, `logout`

**Form Handling**
- **React Hook Form**: Form state management
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: Zod integration with React Hook Form

**Development Tools**
- **TypeScript**: Type checking across frontend and backend
- **ESBuild**: Production build bundling for server code
- **tsx**: TypeScript execution for development server
- **PostCSS**: CSS processing with Autoprefixer for Tailwind

**Database and ORM**
- **Drizzle ORM**: Type-safe SQL query builder
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas
- **connect-pg-simple**: PostgreSQL session store for Express

**Asset Management**
- Generated images stored in `attached_assets/generated_images/`
- Vite alias `@assets` configured for easy imports
- Static assets served from Vite in development, from `dist/public` in production

**Hosting Considerations**
- Configured for Replit deployment with environment-specific plugins
- Environment variables: `DATABASE_URL` for PostgreSQL connection
- `NODE_ENV` for development/production modes
- Build output: `dist/public` for client, `dist/index.js` for server