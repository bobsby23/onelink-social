# OneLink - Complete Technical Documentation

## 1. Project Overview

### Purpose
OneLink is a privacy-first link-in-bio platform that enables users to create personalized profile pages with links, social connections, and content sharing capabilities. The application prioritizes user privacy through client-side end-to-end encryption (E2EE) for sensitive content.

### Target Users
- Content creators who need a single shareable profile URL
- Professionals managing multiple social media and contact links
- Privacy-conscious users who want control over their data
- Individuals seeking customizable, modern link-sharing solutions

### Core Features
1. **Profile Management**: Create and customize public profiles with nickname-based URLs (`/u/{nickname}`)
2. **Link Blocks**: Organize and display various types of links with beautiful pre-made templates
3. **End-to-End Encryption**: Client-side encryption for private and friends-only content using RSA-OAEP and AES-GCM
4. **Friend System**: Connect with other users to share friends-only content
5. **AI-Powered Themes**: Generate personalized themes using AI (Gemini API)
6. **Real-time Chat**: Message friends directly through the platform
7. **QR Code Generation**: Create shareable QR codes for profile URLs
8. **Dark/Light Mode**: System-aware theme switching with next-themes
9. **Photo Uploads**: Profile pictures and cover photos via Vercel Blob storage
10. **Social Media Icons**: Automatic platform detection with brand-appropriate styling

---

## 2. Tech Stack

### Framework
- **Next.js 16.0.10** (App Router)
- **React 19.2.0** with React Compiler support
- **TypeScript 5.x** for type safety

### UI System
- **Tailwind CSS 4.1.9** (CSS-first configuration in globals.css)
- **shadcn/ui** components (Radix UI primitives)
- **Lucide React** for icons
- **next-themes** for dark/light mode
- **Geist** and **Geist Mono** fonts from next/font/google

### State Management
- **React Hook Form** with Zod validation for forms
- **SWR pattern** for client-side data fetching and caching
- **Supabase Realtime** for real-time subscriptions (chat, live updates)

### Authentication & Database
- **Supabase Auth** for email/password authentication
- **Supabase Database** (PostgreSQL) with Row Level Security
- **@supabase/ssr** for server-side rendering support

### Storage & Assets
- **Vercel Blob** for image uploads (avatars, cover photos)
- **qrcode** library for QR code generation

### Deployment
- **Vercel** platform (optimized for Next.js 16)
- **@vercel/analytics** for usage tracking

---

## 3. Application Architecture

### Folder Structure

\`\`\`
onelink/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Server Actions alternative)
│   │   ├── generate-theme/       # AI theme generation endpoint
│   │   ├── save-theme/           # Save user theme preferences
│   │   └── upload-photo/         # Handle profile photo uploads
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── sign-up-success/
│   │   └── error/
│   ├── dashboard/                # Protected user dashboard
│   │   ├── page.tsx              # Dashboard home (stats, overview)
│   │   ├── profile/              # Edit profile settings
│   │   ├── links/                # Manage link blocks
│   │   ├── connections/          # Friend requests and management
│   │   ├── chat/                 # Real-time messaging
│   │   └── theme/                # AI theme customization
│   ├── u/[nickname]/             # Public profile pages (dynamic route)
│   │   ├── page.tsx              # Render public profile
│   │   └── not-found.tsx         # 404 for missing profiles
│   ├── layout.tsx                # Root layout (fonts, providers, metadata)
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Tailwind CSS v4 configuration
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── dashboard-shell.tsx   # Layout wrapper with navigation
│   │   ├── profile-card.tsx      # Profile display card
│   │   ├── profile-form.tsx      # Profile editing form
│   │   ├── quick-stats.tsx       # Stats display (links, clicks, friends)
│   │   └── qr-code-dialog.tsx    # QR code generator modal
│   ├── links/                    # Link management components
│   │   ├── links-list.tsx        # Display all user links
│   │   ├── link-card.tsx         # Individual link card with actions
│   │   ├── add-link-dialog.tsx   # Add new link modal
│   │   ├── edit-link-dialog.tsx  # Edit existing link modal
│   │   └── template-selector.tsx # Link template picker
│   ├── connections/              # Friend system components
│   │   ├── connections-tabs.tsx  # Tab navigation (Friends, Requests, Sent)
│   │   ├── connections-list.tsx  # List connections by status
│   │   ├── connection-card.tsx   # Individual connection card
│   │   └── search-users.tsx      # Search and connect with users
│   ├── chat/                     # Chat system components
│   │   └── chat-interface.tsx    # Real-time chat UI with Supabase subscriptions
│   ├── theme/                    # Theme customization components
│   │   ├── theme-generator.tsx   # AI theme generation form
│   │   └── theme-preview.tsx     # Live theme preview
│   ├── public/                   # Public-facing components
│   │   └── public-profile.tsx    # Render user profile for visitors
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ... (40+ components)
│   ├── theme-provider.tsx        # next-themes provider wrapper
│   └── theme-toggle.tsx          # Light/dark mode switcher
├── lib/                          # Utilities and configurations
│   ├── supabase/                 # Supabase client configurations
│   │   ├── client.ts             # Browser client (singleton pattern)
│   │   ├── server.ts             # Server-side client
│   │   └── proxy.ts              # Middleware client with cookie handling
│   ├── types/                    # TypeScript type definitions
│   │   └── database.ts           # Database schema types
│   ├── crypto.ts                 # E2EE functions (RSA-OAEP, AES-GCM)
│   ├── link-templates.ts         # Predefined link block templates
│   ├── social-icons.ts           # Social media icon and color mappings
│   └── utils.ts                  # Utility functions (cn, etc.)
├── scripts/                      # Database migration scripts
│   ├── 001_create_users_table.sql
│   ├── 002_create_link_blocks_table.sql
│   ├── 003_create_connections_table.sql
│   ├── 004_create_profile_trigger.sql
│   ├── 005_increment_clicks_function.sql
│   ├── 006_add_cover_photo.sql
│   ├── 007_add_template_column.sql
│   └── 008_create_messages_table.sql
├── proxy.ts                      # Next.js middleware for session management
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── BLUEPRINT.md                  # High-level project architecture
├── DEVELOPER.md                  # Developer onboarding guide
└── TECHNICAL_DOCUMENTATION.md    # This file
\`\`\`

### Routing Strategy
OneLink uses **Next.js 16 App Router** with the following routing patterns:

1. **Static Routes**: Landing page (`/`), auth pages (`/auth/*`), dashboard sections (`/dashboard/*`)
2. **Dynamic Routes**: Public profiles (`/u/[nickname]`) with server-side rendering
3. **API Routes**: REST endpoints in `app/api/*` for theme generation, photo uploads, etc.
4. **Middleware**: Session refresh handled in `proxy.ts` using Supabase SSR

### Server vs Client Components

#### Server Components (Default)
- **Page routes** (`app/**/page.tsx`): Fetch user data, verify auth, render initial UI
- **Layouts** (`app/layout.tsx`): Provide metadata, wrap with providers
- **Public profiles** (`app/u/[nickname]/page.tsx`): SSR for SEO and performance

#### Client Components (Explicit `'use client'`)
- **Interactive forms**: Login, sign-up, profile editing, link management
- **Real-time features**: Chat interface with Supabase subscriptions
- **Stateful UI**: Theme switcher, dialogs, dropdowns, accordions
- **Client-side crypto**: E2EE key generation and encryption functions

### Middleware Usage
**File**: `proxy.ts`

The middleware runs on every request to:
1. Refresh Supabase session tokens using `updateSession()`
2. Set HTTP-only cookies for secure session management
3. Redirect unauthenticated users from protected routes
4. Handle Supabase auth callbacks

\`\`\`typescript
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
\`\`\`

---

## 4. Authentication Flow

### Sign Up Process

1. **User submits form** (`app/auth/sign-up/page.tsx`):
   - Email, password, nickname, display name
   - Client-side validation with Zod schema

2. **Supabase Auth creates account**:
   \`\`\`typescript
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
     },
   })
   \`\`\`

3. **Database trigger creates profile** (`scripts/004_create_profile_trigger.sql`):
   - Automatically inserts row into `users` table
   - Extracts nickname and display_name from `raw_user_meta_data`

4. **Confirmation email sent**:
   - User must verify email before accessing dashboard
   - Redirect to `/auth/sign-up-success`

5. **E2EE key pair generated** (client-side):
   - RSA-OAEP key pair created in browser
   - Public key stored in database
   - Private key stored in browser localStorage

### Login Process

1. **User submits credentials** (`app/auth/login/page.tsx`):
   \`\`\`typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   })
   \`\`\`

2. **Session established**:
   - Supabase sets auth token in cookies via middleware
   - User redirected to `/dashboard`

3. **Profile data fetched**:
   - Server component queries `users` table by `auth.uid()`
   - RLS policies enforce access control

### Session Handling

**Middleware** (`proxy.ts`):
- Runs on every request
- Calls `supabase.auth.getUser()` to validate session
- Refreshes expired tokens automatically
- Sets/updates HTTP-only cookies

**Client-side**:
- `createClient()` in `lib/supabase/client.ts` uses singleton pattern
- Prevents multiple GoTrueClient instances
- Automatically includes auth headers in API calls

**Server-side**:
- `createClient()` in `lib/supabase/server.ts` reads cookies
- Used in server components and API routes
- Ensures consistent auth state

### Protected Routes

**Dashboard pages** check authentication:
\`\`\`typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/auth/login')
}
\`\`\`

**RLS policies** enforce database-level access control (see section 5).

---

## 5. Database Schema (Supabase)

### Tables

#### `public.users`
Stores user profile data visible to the public.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) | User ID from Supabase Auth |
| `email` | TEXT | NOT NULL, UNIQUE | User email address |
| `nickname` | TEXT | UNIQUE, NOT NULL | URL-safe username (e.g., `bobsby32`) |
| `display_name` | TEXT | NOT NULL | Human-readable name |
| `bio` | TEXT | NULLABLE | Profile bio/description |
| `avatar_url` | TEXT | NULLABLE | Profile picture URL (Vercel Blob) |
| `cover_photo_url` | TEXT | NULLABLE | Cover photo URL (Vercel Blob) |
| `public_key` | TEXT | NULLABLE | RSA public key for E2EE |
| `theme_config` | JSONB | DEFAULT '{}' | AI-generated theme variables |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_users_nickname` on `nickname` (for `/u/{nickname}` lookups)

**RLS Policies**:
- `SELECT`: Anyone can view all profiles (public data)
- `INSERT`: Users can only insert their own profile (`auth.uid() = id`)
- `UPDATE`: Users can only update their own profile
- `DELETE`: Users can only delete their own profile

---

#### `public.link_blocks`
Stores user links with visibility controls and encryption support.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated link ID |
| `user_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | Owner of the link |
| `type` | TEXT | CHECK IN ('link', 'social', 'contact', 'file', 'note') | Link category |
| `title` | TEXT | NOT NULL | Link display title |
| `url` | TEXT | NULLABLE | URL for public links |
| `icon` | TEXT | NULLABLE | Icon identifier (Lucide icon name) |
| `visibility` | TEXT | CHECK IN ('public', 'friends', 'private'), DEFAULT 'public' | Who can see this link |
| `encrypted_blob` | TEXT | NULLABLE | AES-GCM encrypted content (for private/friends) |
| `template` | TEXT | DEFAULT 'classic' | Link block template style |
| `position` | INTEGER | DEFAULT 0 | Display order |
| `is_active` | BOOLEAN | DEFAULT true | Show/hide link |
| `click_count` | INTEGER | DEFAULT 0 | Analytics counter |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_link_blocks_user_id` on `user_id`
- `idx_link_blocks_visibility` on `visibility`
- `idx_link_blocks_position` on `(user_id, position)`

**RLS Policies**:
- **Public links**: Anyone can SELECT where `visibility = 'public' AND is_active = true`
- **Own links**: Users can SELECT all their own links (`auth.uid() = user_id`)
- **Friends-only links**: Users can SELECT where `visibility = 'friends'` AND they have an accepted connection with the owner
- **Mutations**: Users can INSERT/UPDATE/DELETE only their own links

---

#### `public.connections`
Manages friend relationships between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Connection ID |
| `requester_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | User who sent the request |
| `receiver_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | User who received the request |
| `status` | TEXT | CHECK IN ('pending', 'accepted', 'rejected', 'blocked'), DEFAULT 'pending' | Connection status |
| `shared_key` | TEXT | NULLABLE | Encrypted symmetric key for friends-only content |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Request sent timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last status change |

**Constraints**:
- `no_self_connection`: `requester_id != receiver_id`
- `unique_connection`: `UNIQUE(requester_id, receiver_id)`

**Indexes**:
- `idx_connections_requester` on `requester_id`
- `idx_connections_receiver` on `receiver_id`
- `idx_connections_status` on `status`

**RLS Policies**:
- **SELECT**: Users can view connections where they are either requester or receiver
- **INSERT**: Users can only create requests where they are the requester
- **UPDATE**: Only the receiver can update status (accept/reject)
- **DELETE**: Either party can delete the connection

---

#### `public.messages`
Stores chat messages between connected users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Message ID |
| `sender_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | Message sender |
| `receiver_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | Message recipient |
| `content` | TEXT | NOT NULL | Message text |
| `read` | BOOLEAN | DEFAULT false | Read receipt |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Message timestamp |

**Indexes**:
- `idx_messages_sender` on `sender_id`
- `idx_messages_receiver` on `receiver_id`
- `idx_messages_created_at` on `created_at DESC`

**RLS Policies**:
- **SELECT**: Users can view messages where they are sender or receiver
- **INSERT**: Users can only send messages where they are the sender
- **UPDATE**: Only the receiver can mark messages as read
- **DELETE**: Users can delete messages they sent

---

### Database Functions

#### `update_updated_at_column()`
Trigger function that automatically updates the `updated_at` timestamp on any UPDATE.

Used by: `users`, `link_blocks`, `connections`

#### `increment_link_clicks()`
Increments the `click_count` for a link block when clicked.

\`\`\`sql
CREATE OR REPLACE FUNCTION increment_link_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.link_blocks
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

---

### Relationships

\`\`\`
auth.users (Supabase Auth)
    │
    ├──> public.users (1:1, profile data)
    │       ├──> link_blocks (1:many, user's links)
    │       ├──> connections (requester) (1:many)
    │       ├──> connections (receiver) (1:many)
    │       ├──> messages (sender) (1:many)
    │       └──> messages (receiver) (1:many)
    │
    └──> connections (many:many via requester/receiver)
             └──> Enables friends-only link visibility
\`\`\`

---

### RLS (Row Level Security) Rules Summary

**Public Access**:
- All user profiles (`users` table)
- Public link blocks (`link_blocks` WHERE `visibility = 'public'`)

**Authenticated Access**:
- Own profile, links, connections, messages
- Friends-only links (requires accepted connection)

**Protected**:
- Private links (only owner can see)
- Connection requests (only involved parties)
- Message history (only sender/receiver)

---

## 6. Environment Variables

### Required Variables

#### Supabase (Database & Auth)

\`\`\`env
# Supabase Project URL (public)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co

# Supabase Anonymous Key (public, protected by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase Service Role Key (server-only, NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Development redirect URL for email confirmation
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**Explanation**:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key for client-side requests (safe to expose, RLS protects data)
- `SUPABASE_SERVICE_ROLE_KEY`: Admin key for server-side operations (bypasses RLS, keep secret)
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: Local dev URL for email verification redirects

---

#### Vercel Blob (File Storage)

\`\`\`env
# Vercel Blob read/write token (server-only)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
\`\`\`

**Explanation**:
- `BLOB_READ_WRITE_TOKEN`: Token for uploading files to Vercel Blob storage (auto-provided by Vercel)

---

#### AI Theme Generation (Optional)

\`\`\`env
# Google Gemini API Key (server-only, for AI theme generation)
GEMINI_API_KEY=AIza...
\`\`\`

**Explanation**:
- `GEMINI_API_KEY`: Required for AI-powered theme generation feature (optional if not using AI themes)

---

### Setting Variables in v0

1. Click **Vars** in the left sidebar
2. Add each variable name and value
3. Save and refresh preview

### Setting Variables in Vercel

1. Go to Project Settings > Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy to apply changes

---

## 7. API / Data Layer

### Data Fetching Strategy

OneLink uses **Supabase clients** for all data operations, not traditional REST APIs.

#### Client-Side Fetching (React Components)

\`\`\`typescript
'use client'
import { createClient } from '@/lib/supabase/client'

// Example: Fetch user's links
const supabase = createClient()
const { data: links, error } = await supabase
  .from('link_blocks')
  .select('*')
  .eq('user_id', userId)
  .order('position')
\`\`\`

**Pattern**: Use `createClient()` in client components for interactive features.

---

#### Server-Side Fetching (Server Components)

\`\`\`typescript
import { createClient } from '@/lib/supabase/server'

// Example: Fetch public profile (SSR)
const supabase = await createClient()
const { data: profile, error } = await supabase
  .from('users')
  .select('*')
  .eq('nickname', nickname)
  .maybeSingle()
\`\`\`

**Pattern**: Use `await createClient()` in server components for SEO and performance.

---

#### API Routes (Alternative to Server Actions)

**File**: `app/api/upload-photo/route.ts`

\`\`\`typescript
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // Upload to Vercel Blob
  const blob = await put(file.name, file, { access: 'public' })
  
  // Update user profile with new URL
  await supabase
    .from('users')
    .update({ avatar_url: blob.url })
    .eq('id', user.id)
  
  return Response.json({ url: blob.url })
}
\`\`\`

**Pattern**: API routes for file uploads, third-party integrations, and server-side mutations.

---

### Real-Time Subscriptions

**File**: `components/chat/chat-interface.tsx`

\`\`\`typescript
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      },
      (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user.id])
\`\`\`

**Pattern**: Supabase Realtime for live updates (chat, notifications, live counters).

---

### Error Handling

#### Client-Side

\`\`\`typescript
const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()

if (error) {
  console.error('[v0] Error fetching user:', error)
  toast.error('Failed to load profile')
  return
}

if (!data) {
  toast.error('Profile not found')
  redirect('/dashboard')
}
\`\`\`

**Pattern**: Check `error` first, then handle missing data with user-friendly messages.

---

#### Server-Side

\`\`\`typescript
const { data: profile, error } = await supabase
  .from('users')
  .select('*')
  .eq('nickname', nickname)
  .maybeSingle()

if (error) {
  console.error('[v0] Database error:', error)
  throw new Error('Failed to fetch profile')
}

if (!profile) {
  notFound() // Triggers app/u/[nickname]/not-found.tsx
}
\`\`\`

**Pattern**: Use `maybeSingle()` instead of `single()` to avoid throwing errors on missing rows.

---

### Supabase Client Singleton Pattern

**Problem**: Multiple `createBrowserClient()` calls create duplicate GoTrueClient instances.

**Solution**: Cache the client instance in a module-level variable.

\`\`\`typescript
// lib/supabase/client.ts
let client: SupabaseClient | null = null

export function createClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
\`\`\`

---

## 8. Deployment

### Deploying in v0

1. **Click "Publish"** in the top-right corner of the v0 UI
2. **Connect Vercel Account**: First-time users authorize v0 to deploy on Vercel
3. **Auto-deployment**: v0 creates a Git repository and deploys to Vercel
4. **Environment Variables**: Automatically synced from v0 Vars section
5. **Live URL**: Provided after successful deployment (e.g., `onelink.vercel.app`)

---

### Build Configuration

**File**: `package.json`

\`\`\`json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
\`\`\`

**Build Command**: `npm run build` (or `yarn build`)
**Output Directory**: `.next`
**Install Command**: Auto-detected by Vercel

---

### Runtime Requirements

- **Node.js**: 18.x or higher (Next.js 16 requirement)
- **Edge Runtime**: Middleware (`proxy.ts`) runs on Vercel Edge Network
- **Regions**: Deploy globally for lowest latency

---

### Environment Setup on Vercel

1. Go to **Project Settings > Environment Variables**
2. Add all required env vars (see section 6)
3. Set scope:
   - **Production**: Live site
   - **Preview**: Git branches (PRs, commits)
   - **Development**: Local dev (use `.env.local`)

---

### Database Migrations

**Run SQL scripts in Supabase Dashboard**:
1. Go to **SQL Editor** in Supabase Dashboard
2. Paste contents of `scripts/001_create_users_table.sql`
3. Click **Run**
4. Repeat for all scripts in order (001 → 008)

**Alternatively**: Use Supabase CLI:
\`\`\`bash
supabase db push
\`\`\`

---

### Post-Deployment Checklist

- [ ] Run all database migration scripts (001-008)
- [ ] Verify RLS policies are enabled
- [ ] Test authentication flow (sign up, login, logout)
- [ ] Upload test profile photo (verify Blob integration)
- [ ] Create test link blocks with all visibility levels
- [ ] Test friend connections and friends-only links
- [ ] Generate AI theme (if using Gemini API)
- [ ] Check QR code generation
- [ ] Verify real-time chat functionality
- [ ] Test dark/light mode switching

---

## 9. Known Failure Points

### Supabase Missing or Misconfigured

**What Breaks**:
- **Authentication**: All auth pages fail (`/auth/login`, `/auth/sign-up`)
- **Dashboard**: Cannot fetch user profile or links
- **Public Profiles**: Cannot render `/u/{nickname}` pages
- **Real-time Chat**: Subscriptions fail to connect

**Files Affected**:
- `lib/supabase/client.ts` - Throws error if env vars missing
- `lib/supabase/server.ts` - Cannot create server client
- `lib/supabase/proxy.ts` - Middleware crashes, blocks all requests
- `app/auth/**` - All auth pages
- `app/dashboard/**` - All dashboard pages
- `app/u/[nickname]/page.tsx` - Public profiles
- `components/chat/chat-interface.tsx` - Real-time features

**Error Messages**:
\`\`\`
Error: Your project's URL and Key are required to create a Supabase client!
\`\`\`

**Fix**:
1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in environment variables
2. Restart dev server or redeploy

---

### Database Tables Missing

**What Breaks**:
- **Sign Up**: Profile trigger fails, user created in auth but no profile in `users` table
- **Dashboard**: Queries fail with "relation does not exist" errors
- **Links**: Cannot create or fetch link blocks
- **Connections**: Friend system non-functional

**Files Affected**:
- All queries in server/client components that reference `users`, `link_blocks`, `connections`, `messages`

**Error Messages**:
\`\`\`
Error: relation "public.users" does not exist
\`\`\`

**Fix**:
Run all SQL migration scripts in Supabase Dashboard (001-008 in order)

---

### RLS Policies Not Enabled

**What Breaks**:
- **Unauthorized Access**: Users can view/edit other users' private data
- **Friends-Only Links**: Visible to everyone (security breach)
- **Private Links**: Exposed in API responses

**Files Affected**:
- All Supabase queries (no compile errors, but security compromised)

**Error Messages**:
No errors, but data leaks occur silently.

**Fix**:
Verify RLS is enabled:
\`\`\`sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
\`\`\`

---

### Blob Storage Token Missing

**What Breaks**:
- **Photo Uploads**: Avatar and cover photo uploads fail
- **API Route**: `/api/upload-photo` returns 500 error

**Files Affected**:
- `app/api/upload-photo/route.ts`
- `components/dashboard/profile-form.tsx` (upload buttons)

**Error Messages**:
\`\`\`
Error: Blob token is required
\`\`\`

**Fix**:
Add `BLOB_READ_WRITE_TOKEN` environment variable (auto-provided by Vercel Blob integration)

---

### Using `.single()` Instead of `.maybeSingle()`

**What Breaks**:
- **404 Errors**: Unhandled "Not found" promise rejections
- **Profile Loading**: Crashes when user profile doesn't exist

**Files Affected**:
- `app/u/[nickname]/page.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/profile/page.tsx`
- `app/dashboard/connections/page.tsx`
- `app/dashboard/links/page.tsx`
- `app/dashboard/theme/page.tsx`

**Error Messages**:
\`\`\`
Unhandled promise rejection: Error: Not found
\`\`\`

**Fix**:
Replace `.single()` with `.maybeSingle()` in all Supabase queries:
\`\`\`typescript
// ❌ BAD
const { data } = await supabase.from('users').select('*').eq('id', userId).single()

// ✅ GOOD
const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
\`\`\`

---

## 10. Migration Guide: Supabase → Firebase

### Overview
This section details how to replace Supabase with Firebase Auth + Firestore while preserving application logic.

---

### Step 1: Install Firebase SDKs

\`\`\`bash
npm install firebase firebase-admin
\`\`\`

**Remove Supabase packages**:
\`\`\`bash
npm uninstall @supabase/supabase-js @supabase/ssr
\`\`\`

---

### Step 2: Initialize Firebase

**File**: `lib/firebase/client.ts` (create new file)

\`\`\`typescript
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
\`\`\`

**File**: `lib/firebase/server.ts` (create new file)

\`\`\`typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const apps = getApps()

const app = apps.length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : apps[0]

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
\`\`\`

---

### Step 3: Update Authentication Files

#### Sign Up (`app/auth/sign-up/page.tsx`)

**Before (Supabase)**:
\`\`\`typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { nickname, display_name: displayName },
  },
})
\`\`\`

**After (Firebase)**:
\`\`\`typescript
import { auth, db } from '@/lib/firebase/client'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const userCredential = await createUserWithEmailAndPassword(auth, email, password)
const user = userCredential.user

// Create profile in Firestore
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  nickname,
  display_name: displayName,
  created_at: new Date(),
})
\`\`\`

---

#### Login (`app/auth/login/page.tsx`)

**Before (Supabase)**:
\`\`\`typescript
const { data, error } = await supabase.auth.signInWithEmailAndPassword({
  email,
  password,
})
\`\`\`

**After (Firebase)**:
\`\`\`typescript
import { signInWithEmailAndPassword } from 'firebase/auth'

await signInWithEmailAndPassword(auth, email, password)
\`\`\`

---

#### Session Handling (Middleware)

**Before (Supabase)**: `proxy.ts`
\`\`\`typescript
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}
\`\`\`

**After (Firebase)**: `proxy.ts`
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/server'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    await adminAuth.verifyIdToken(token)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
\`\`\`

---

### Step 4: Update Database Queries

#### Firestore Collection Structure

\`\`\`
users/
  {uid}/
    - email: string
    - nickname: string
    - display_name: string
    - bio: string
    - avatar_url: string
    - public_key: string
    - theme_config: object
    - created_at: timestamp

link_blocks/
  {linkId}/
    - user_id: string
    - type: string
    - title: string
    - url: string
    - visibility: string
    - position: number
    - is_active: boolean
    - created_at: timestamp

connections/
  {connectionId}/
    - requester_id: string
    - receiver_id: string
    - status: string
    - created_at: timestamp

messages/
  {messageId}/
    - sender_id: string
    - receiver_id: string
    - content: string
    - read: boolean
    - created_at: timestamp
\`\`\`

---

#### Fetch User Profile

**Before (Supabase)**:
\`\`\`typescript
const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('nickname', nickname)
  .maybeSingle()
\`\`\`

**After (Firebase)**:
\`\`\`typescript
import { collection, query, where, getDocs } from 'firebase/firestore'

const q = query(collection(db, 'users'), where('nickname', '==', nickname))
const snapshot = await getDocs(q)
const profile = snapshot.docs[0]?.data()
\`\`\`

---

#### Create Link Block

**Before (Supabase)**:
\`\`\`typescript
const { data, error } = await supabase
  .from('link_blocks')
  .insert({
    user_id: userId,
    title,
    url,
    visibility: 'public',
  })
\`\`\`

**After (Firebase)**:
\`\`\`typescript
import { addDoc, collection } from 'firebase/firestore'

await addDoc(collection(db, 'link_blocks'), {
  user_id: userId,
  title,
  url,
  visibility: 'public',
  created_at: new Date(),
})
\`\`\`

---

#### Real-Time Subscriptions

**Before (Supabase)**:
\`\`\`typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', table: 'messages' }, handleNewMessage)
  .subscribe()
\`\`\`

**After (Firebase)**:
\`\`\`typescript
import { onSnapshot, collection, query, where } from 'firebase/firestore'

const q = query(collection(db, 'messages'), where('receiver_id', '==', userId))
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      handleNewMessage(change.doc.data())
    }
  })
})
\`\`\`

---

### Step 5: Implement Firestore Security Rules

**File**: `firestore.rules` (create new file in project root)

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if true; // Public profiles
      allow write: if request.auth.uid == userId;
    }
    
    // Link blocks collection
    match /link_blocks/{linkId} {
      allow read: if resource.data.visibility == 'public'
                  || request.auth.uid == resource.data.user_id
                  || (resource.data.visibility == 'friends' && isFriend(request.auth.uid, resource.data.user_id));
      allow write: if request.auth.uid == resource.data.user_id;
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read: if request.auth.uid == resource.data.requester_id
                  || request.auth.uid == resource.data.receiver_id;
      allow create: if request.auth.uid == request.resource.data.requester_id;
      allow update: if request.auth.uid == resource.data.receiver_id;
      allow delete: if request.auth.uid == resource.data.requester_id
                    || request.auth.uid == resource.data.receiver_id;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth.uid == resource.data.sender_id
                  || request.auth.uid == resource.data.receiver_id;
      allow create: if request.auth.uid == request.resource.data.sender_id;
      allow update: if request.auth.uid == resource.data.receiver_id;
    }
    
    // Helper function to check friendship
    function isFriend(userId, targetUserId) {
      return exists(/databases/$(database)/documents/connections/$(userId + '_' + targetUserId))
          && get(/databases/$(database)/documents/connections/$(userId + '_' + targetUserId)).data.status == 'accepted';
    }
  }
}
\`\`\`

Deploy rules:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

---

### Step 6: Update Environment Variables

**Remove**:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
\`\`\`

**Add**:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=onelink.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=onelink
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=onelink.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Server-only (Firebase Admin SDK)
FIREBASE_PROJECT_ID=onelink
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@onelink.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
\`\`\`

---

### Step 7: Files That Can Stay the Same

**No changes needed**:
- `lib/crypto.ts` - E2EE logic is client-side only
- `lib/link-templates.ts` - UI templates are framework-agnostic
- `lib/social-icons.ts` - Icon mappings don't depend on backend
- `components/ui/**` - shadcn components are UI-only
- `components/theme-provider.tsx` - next-themes is independent
- `app/globals.css` - Styling is unchanged
- `app/layout.tsx` - Only imports need updating

**Minimal changes**:
- API routes (`app/api/**`) - Update auth checks to use Firebase Admin SDK
- Dashboard pages (`app/dashboard/**`) - Replace Supabase queries with Firestore queries
- Public profile (`app/u/[nickname]/page.tsx`) - Replace Supabase fetch with Firestore fetch

---

### Step 8: Testing Migration

1. **Create test user in Firebase Console**
2. **Manually populate Firestore** with test data (users, link_blocks)
3. **Test authentication flow** (sign up, login, logout)
4. **Verify data fetching** in dashboard
5. **Test RLS-equivalent security rules** (try accessing other users' data)
6. **Verify real-time chat** with Firestore snapshots
7. **Test photo uploads** (Firebase Storage instead of Vercel Blob)

---

### Summary: What Must Be Rewritten

| Component | Effort | Details |
|-----------|--------|---------|
| **Auth pages** | Medium | Replace Supabase Auth API with Firebase Auth |
| **Middleware** | Medium | Replace session handling with Firebase ID token verification |
| **Database queries** | High | Replace all Supabase queries with Firestore queries |
| **Real-time features** | Medium | Replace Supabase subscriptions with Firestore snapshots |
| **RLS policies** | High | Migrate to Firestore Security Rules (different syntax) |
| **File uploads** | Low | Replace Vercel Blob with Firebase Storage (optional) |
| **E2EE logic** | None | Client-side crypto stays the same |
| **UI components** | None | React components unchanged |

**Total Migration Time**: 2-3 weeks (depending on familiarity with Firebase)

---

## Conclusion

This documentation provides a complete technical reference for the OneLink application. For additional details on specific implementations, refer to the inline code comments and the following supplementary documents:

- **BLUEPRINT.md** - High-level architecture and feature overview
- **DEVELOPER.md** - Developer onboarding and best practices
- **README.md** - Quick start guide and project setup

For questions or issues, consult the Supabase documentation (https://supabase.com/docs) and Next.js 16 documentation (https://nextjs.org/docs).
