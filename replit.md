# Replit.md

## Overview
This is a full-stack e-commerce application for "Raj Garments" - a clothing store with products for men, women, and kids. The application features a React frontend with a Node.js/Express backend, using PostgreSQL as the database and Drizzle ORM for database operations. The app includes user authentication via Replit Auth, product management, shopping cart functionality, and admin capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling and logging

### Database Design
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Comprehensive e-commerce schema including users, products, categories, cart, and orders
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **User Management**: User profile storage with admin role support
- **Security**: HTTP-only cookies, secure session handling

### Product Management
- **Categories**: Hierarchical product categorization
- **Products**: Complete product information including variants (sizes, colors)
- **Images**: External image URL storage
- **Inventory**: Stock tracking and featured product marking
- **Search**: Product search functionality

### Shopping Cart
- **Cart Items**: User-specific cart with product variants
- **Quantity Management**: Add, update, remove cart items
- **Persistence**: Database-backed cart storage
- **Real-time Updates**: Optimistic updates with React Query

### Admin Panel
- **Product CRUD**: Full product management capabilities
- **Category Management**: Create and manage product categories
- **User Management**: Admin role verification
- **Dashboard**: Overview of products, orders, and users

## Data Flow

### Authentication Flow
1. User initiates login via `/api/login`
2. Replit Auth handles OIDC authentication
3. User profile stored/updated in PostgreSQL
4. Session created and stored in database
5. Frontend receives user data via `/api/auth/user`

### Product Browsing Flow
1. Frontend fetches categories and products via REST API
2. Products filtered by category, search, or featured status
3. Real-time cart updates when items are added
4. Optimistic UI updates with server synchronization

### Order Processing Flow
1. Cart items collected and validated
2. Order created with shipping information
3. Cart cleared after successful order
4. Order items stored for tracking

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: WebSocket-based connection for serverless compatibility

### Authentication
- **Replit Auth**: OIDC authentication provider
- **Session Store**: PostgreSQL session storage

### UI Libraries
- **Radix UI**: Headless UI component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production
- **Vite**: Development server and build tool

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle Kit handles schema migrations

### Production Environment
- **Platform**: Replit with autoscale deployment
- **Database**: Neon PostgreSQL with connection pooling
- **Static Assets**: Served via Express static middleware
- **Port Configuration**: Port 5000 mapped to external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OIDC issuer URL for authentication

## Changelog
- June 24, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.