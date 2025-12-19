# OneLink - Complete Technical Documentation

## 1. Project Overview

### Purpose
OneLink is a privacy-first link-in-bio platform that allows users to create customizable profile pages with links, social connections, and encrypted content sharing capabilities.

### Target Users
- Content creators who want to share multiple links
- Privacy-conscious individuals who want control over their data
- Users who want to share exclusive content with friends
- Anyone looking for a Linktree alternative with encryption

### Core Features
- **Link Management**: Create, organize, and track clicks on multiple links
- **Privacy Levels**: Public, friends-only, and private link visibility
- **Friend Connections**: Connect with other users to share exclusive content
- **End-to-End Encryption**: Support for encrypted link blocks using RSA public/private keys
- **Real-time Messaging**: Chat with connected friends
- **AI-Powered Themes**: Generate custom themes for profile pages
- **Profile Customization**: Upload avatar, cover photo, bio, and display name
- **Analytics**: Track link clicks and profile views
- **QR Code Generation**: Share profile via QR code

---

## 2. Tech Stack

### Framework
- **Next.js 16.0.10** (App Router)
- **React 19.2.0**
- **TypeScript 5**

### UI System
- **Tailwind CSS 4.1.9** with PostCSS
- **shadcn/ui components** (Radix UI primitives)
- **Lucide React** for icons
- **next-themes** for dark/light mode support

### State Management
- **React Server Components** for data fetching
- **Client-side state** with useState/useEffect hooks
- **SWR pattern** (not explicitly installed but pattern used)

### Authentication & Database
- **Supabase Auth** for user authentication
- **Supabase Database** (PostgreSQL) for data storage
- **@supabase/ssr** (v0.8.0) for server-side rendering support
- **Row Level Security (RLS)** for data access control

### Additional Libraries
- **@vercel/blob** (2.0.0) for file uploads (images, avatars)
- **@vercel/analytics** (1.3.1) for usage analytics
- **qrcode** (1.5.4) for QR code generation
- **@dnd-kit** (6.3.1) for drag-and-drop link reordering
- **zod** (3.25.76) for form validation
- **react-hook-form** (7.60.0) for form handling
- **date-fns** (4.1.0) for date formatting

---

## 3. Application Architecture

### Folder Structure

```
/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate-theme/       # AI theme generation
│   │   ├── save-theme/           # Save user theme
│   │   └── upload-photo/         # Upload images to Vercel Blob
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── sign-up/              # Sign up page
│   │   ├── sign-up-success/      # Post-signup confirmation
│   │   └── error/                # Auth error page
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── page.tsx              # Dashboard home
│   │   ├── links/                # Link management
│   │   ├── connections/          # Friend connections
│   │   ├── chat/                 # Messaging
│   │   ├── profile/              # Profile settings
│   │   └── theme/                # Theme customization
│   ├── u/[nickname]/             # Public profile pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles + Tailwind config
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   ├── links/                    # Link management components
│   ├── connections/              # Connection management
│   ├── chat/                     # Chat interface
│   ├── public/                   # Public profile components
│   ├── theme/                    # Theme customization
│   └── ui/                       # Reusable UI components (shadcn)
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client configurations
│   │   ├── client.ts             # Browser client (singleton)
│   │   ├── server.ts             # Server client
│   │   └── proxy.ts              # Middleware session handler
│   ├── types/                    # TypeScript types
│   │   └── database.ts           # Database type definitions
│   ├── crypto.ts                 # Encryption utilities
│   ├── link-templates.ts         # Link type templates
│   └── utils.ts                  # General utilities (cn, etc.)
├── scripts/                      # SQL migration scripts
│   ├── 001_create_users_table.sql
│   ├── 002_create_link_blocks_table.sql
│   ├── 003_create_connections_table.sql
│   ├── 004_create_profile_trigger.sql
│   ├── 005_increment_clicks_function.sql
│   ├── 006_add_cover_photo.sql
│   ├── 007_add_template_column.sql
│   └── 008_create_messages_table.sql
├── proxy.ts                      # Next.js middleware
├── package.json
└── tsconfig.json
```

### Routing Strategy
- **App Router** (Next.js 13+ architecture)
- **File-based routing** with dynamic segments
- **Server Components by default** for optimal performance
- **Client Components** marked with `"use client"` directive

### Server vs Client Components

**Server Components (default):**
- All pages in `app/` directory
- Data fetching pages: `/dashboard/*`, `/u/[nickname]`
- Layouts: `app/layout.tsx`
- Benefits: SEO, faster initial load, reduced bundle size

**Client Components:**
- Interactive forms: login, sign-up, profile editing
- Components with state: chat interface, link management
- Components with browser APIs: theme toggle, QR code dialog
- Real-time subscriptions: Supabase real-time listeners

### Middleware Usage
- **File**: `proxy.ts`
- **Purpose**: Session management and route protection
- **Implementation**: Refreshes Supabase auth tokens on every request
- **Protected Routes**: `/dashboard/*` routes require authentication
- **Redirects**: Unauthenticated users redirected to `/auth/login`

---

## 4. Authentication Flow

### Sign Up
1. User fills form at `/auth/sign-up`
2. Client calls `supabase.auth.signUp()` with email/password
3. Supabase creates user in `auth.users` table
4. Database trigger `on_auth_user_created` fires
5. Trigger creates profile in `public.users` table
6. User redirected to `/auth/sign-up-success`
7. Email verification sent (if configured)

**Key Files:**
- `app/auth/sign-up/page.tsx` - Sign up form
- `scripts/004_create_profile_trigger.sql` - Auto-profile creation

### Login
1. User fills form at `/auth/login`
2. Client calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials
4. Session cookie set via `@supabase/ssr`
5. User redirected to `/dashboard`

**Key Files:**
- `app/auth/login/page.tsx` - Login form
- `lib/supabase/client.ts` - Browser client (singleton pattern)

### Session Handling
- **Client-side**: Singleton Supabase client manages session
- **Server-side**: Each request creates new server client
- **Middleware**: `proxy.ts` refreshes tokens automatically
- **Cookie Storage**: Session stored in HTTP-only cookies
- **Token Refresh**: Automatic via middleware on each request

### Protected Routes
- **Pattern**: All `/dashboard/*` routes
- **Mechanism**: Middleware checks `supabase.auth.getUser()`
- **Unauthorized**: Redirect to `/auth/login`
- **Server Components**: Use `createClient()` from `lib/supabase/server.ts`
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`

---

## 5. Database Schema (Supabase)

### Tables

#### `public.users`
Stores public profile information for each user.

**Fields:**
- `id` (UUID, PK): References `auth.users(id)`, cascade delete
- `email` (TEXT, UNIQUE, NOT NULL): User email
- `nickname` (TEXT, UNIQUE, NOT NULL): URL-friendly username
- `display_name` (TEXT, NOT NULL): Full name or display name
- `bio` (TEXT, NULL): Profile bio/description
- `avatar_url` (TEXT, NULL): Profile picture URL (Vercel Blob)
- `cover_photo` (TEXT, NULL): Cover photo URL (Vercel Blob)
- `public_key` (TEXT, NULL): RSA public key for E2EE
- `theme_config` (JSONB, DEFAULT '{}'): AI-generated theme settings
- `created_at` (TIMESTAMPTZ): Account creation timestamp
- `updated_at` (TIMESTAMPTZ): Last profile update timestamp

**Indexes:**
- `idx_users_nickname` on `nickname` (for `/u/:nickname` lookups)

**RLS Policies:**
- SELECT: Public (anyone can view profiles)
- INSERT: Users can create their own profile only
- UPDATE: Users can update their own profile only
- DELETE: Users can delete their own profile only

---

#### `public.link_blocks`
Stores user links with visibility controls and encryption support.

**Fields:**
- `id` (UUID, PK): Auto-generated
- `user_id` (UUID, NOT NULL): References `users(id)`, cascade delete
- `type` (TEXT, NOT NULL): Enum: 'link' | 'social' | 'contact' | 'file' | 'note'
- `title` (TEXT, NOT NULL): Link display title
- `url` (TEXT, NULL): Link destination URL (for public links)
- `icon` (TEXT, NULL): Icon name or URL
- `visibility` (TEXT, NOT NULL): Enum: 'public' | 'friends' | 'private'
- `encrypted_blob` (TEXT, NULL): AES-GCM encrypted content for private/friends links
- `position` (INTEGER, DEFAULT 0): Display order
- `is_active` (BOOLEAN, DEFAULT true): Soft delete flag
- `click_count` (INTEGER, DEFAULT 0): Click analytics counter
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

**Indexes:**
- `idx_link_blocks_user_id` on `user_id`
- `idx_link_blocks_visibility` on `visibility`
- `idx_link_blocks_position` on `(user_id, position)`

**RLS Policies:**
- SELECT (Public): Anyone can view public + active links
- SELECT (Own): Users can view all their own links
- SELECT (Friends): Friends can view friends-only links (requires accepted connection)
- INSERT: Users can create their own links only
- UPDATE: Users can update their own links only
- DELETE: Users can delete their own links only

**Business Logic:**
- Click tracking via `increment_link_clicks()` function
- Drag-and-drop reordering via `position` field
- Visibility determines who can see the link:
  - `public`: Everyone
  - `friends`: Only accepted connections
  - `private`: Only the owner

---

#### `public.connections`
Manages friend connections between users.

**Fields:**
- `id` (UUID, PK): Auto-generated
- `requester_id` (UUID, NOT NULL): User who sent request
- `receiver_id` (UUID, NOT NULL): User who receives request
- `status` (TEXT, NOT NULL): Enum: 'pending' | 'accepted' | 'rejected' | 'blocked'
- `shared_key` (TEXT, NULL): Encrypted symmetric key for sharing content
- `created_at` (TIMESTAMPTZ): Request creation timestamp
- `updated_at` (TIMESTAMPTZ): Last status update timestamp

**Constraints:**
- `no_self_connection`: `requester_id != receiver_id`
- `unique_connection`: UNIQUE(requester_id, receiver_id)

**Indexes:**
- `idx_connections_requester` on `requester_id`
- `idx_connections_receiver` on `receiver_id`
- `idx_connections_status` on `status`

**RLS Policies:**
- SELECT: Users can view connections where they are involved (requester or receiver)
- INSERT: Users can create connection requests (must be requester)
- UPDATE: Receivers can update status (accept/reject)
- DELETE: Either party can delete the connection

---

#### `public.messages`
Stores chat messages between connected users.

**Fields:**
- `id` (UUID, PK): Auto-generated
- `connection_id` (UUID, NOT NULL): References `connections(id)`, cascade delete
- `sender_id` (UUID, NOT NULL): References `auth.users(id)`, cascade delete
- `receiver_id` (UUID, NOT NULL): References `auth.users(id)`, cascade delete
- `content` (TEXT, NOT NULL): Message content (plain or encrypted)
- `encrypted` (BOOLEAN, DEFAULT false): Whether content is encrypted
- `read` (BOOLEAN, DEFAULT false): Read receipt flag
- `created_at` (TIMESTAMPTZ): Message timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

**Indexes:**
- `idx_messages_connection` on `connection_id`
- `idx_messages_sender` on `sender_id`
- `idx_messages_receiver` on `receiver_id`
- `idx_messages_created_at` on `created_at DESC`

**RLS Policies:**
- SELECT: Users can read messages where they are sender or receiver
- INSERT: Users can send messages (must be sender)
- UPDATE: Senders can update their own messages
- DELETE: Senders can delete their own messages

---

### Relationships

```
auth.users (Supabase Auth)
    ↓ (1:1, cascade delete)
public.users
    ↓ (1:many, cascade delete)
public.link_blocks

public.users
    ↓ (many:many via connections)
public.connections
    ↓ (1:many, cascade delete)
public.messages
```

### Database Functions

#### `update_updated_at_column()`
- **Purpose**: Automatically updates `updated_at` timestamp
- **Trigger**: BEFORE UPDATE on all tables
- **Returns**: Modified NEW row with current timestamp

#### `handle_new_user()`
- **Purpose**: Auto-creates public profile on user signup
- **Trigger**: AFTER INSERT on `auth.users`
- **Logic**: Inserts into `public.users` with data from `raw_user_meta_data`

#### `increment_link_clicks(link_id UUID)`
- **Purpose**: Atomically increments click counter
- **Usage**: Called when user clicks a link
- **Returns**: Updated click count

---

### RLS Rules Summary

**Security Model:**
- All tables have RLS enabled
- Users can only modify their own data
- Public data is readable by everyone
- Friends-only data requires accepted connection
- Private data is owner-only

**Key Patterns:**
- `auth.uid() = user_id` - Owner check
- `EXISTS (SELECT 1 FROM connections WHERE status = 'accepted')` - Friend check
- `visibility = 'public'` - Public access

---

## 6. Environment Variables

### Required Variables

#### Supabase Connection
- **`NEXT_PUBLIC_SUPABASE_URL`** (Client & Server)
  - Your Supabase project URL
  - Example: `https://xxxxx.supabase.co`
  - Found in: Supabase Dashboard → Project Settings → API

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (Client & Server)
  - Supabase anonymous/public key
  - Safe to expose to client (RLS protects data)
  - Found in: Supabase Dashboard → Project Settings → API

#### Vercel Blob (Optional - for image uploads)
- **`BLOB_READ_WRITE_TOKEN`** (Server only)
  - Vercel Blob storage access token
  - Required for avatar/cover photo uploads
  - Auto-configured when using Vercel deployment

### Variable Usage by File

**Browser Client (`lib/supabase/client.ts`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Server Client (`lib/supabase/server.ts`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Middleware (`lib/supabase/proxy.ts`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Upload API (`app/api/upload-photo/route.ts`):**
- `BLOB_READ_WRITE_TOKEN`

### Security Notes
- Anon keys are safe to expose (RLS protects data)
- Never expose service role key to client
- Blob token is server-only
- All env vars are validated at runtime

---

## 7. API / Data Layer

### Data Fetching Strategy

#### Server Components (Preferred)
- Use `createClient()` from `lib/supabase/server.ts`
- Fetch data directly in async Server Components
- No loading states needed - rendered on server
- Example:
```typescript
const supabase = await createClient()
const { data } = await supabase.from('users').select('*')
```

#### Client Components
- Use `createClient()` from `lib/supabase/client.ts` (singleton)
- Fetch in `useEffect` or event handlers
- Manage loading states with `useState`
- Example:
```typescript
const supabase = createClient()
useEffect(() => {
  async function loadData() {
    const { data } = await supabase.from('users').select('*')
  }
  loadData()
}, [])
```

### Supabase Client Usage

#### Browser Client (`lib/supabase/client.ts`)
- **Pattern**: Singleton pattern (one instance per app)
- **Purpose**: Prevent multiple auth instances warning
- **Usage**: Import and call `createClient()`
- **Caution**: Only for client components

#### Server Client (`lib/supabase/server.ts`)
- **Pattern**: New instance per request
- **Purpose**: Server-side data fetching and auth
- **Usage**: `await createClient()` (async)
- **Cookie Handling**: Reads/writes cookies via Next.js cookies API

#### Middleware Client (`lib/supabase/proxy.ts`)
- **Pattern**: Custom client per request
- **Purpose**: Token refresh and route protection
- **Usage**: Called by `proxy.ts` middleware
- **Auth Check**: Validates user before serving protected routes

### Error Handling

**Supabase Errors:**
```typescript
const { data, error } = await supabase.from('users').select('*')
if (error) {
  console.error('Database error:', error)
  // Handle error
}
```

**Auth Errors:**
```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) {
  setError(error.message) // Display to user
}
```

**Server Component Errors:**
- Use `notFound()` for 404s
- Use `redirect()` for auth failures
- Errors bubble up to nearest `error.tsx` boundary

### Real-time Subscriptions

**Pattern:**
```typescript
const supabase = createClient()
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      // Handle new message
    })
    .subscribe()
    
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

**Used for:**
- Real-time chat messages
- Connection request notifications
- Link click updates

---

## 8. Deployment

### Deployment Platform
- **Primary**: Vercel (v0 built-in deployment)
- **Alternative**: Any platform supporting Next.js 16

### Build Process
1. User clicks "Publish" in v0 interface
2. Code pushed to connected GitHub repository
3. Vercel auto-deploys from GitHub
4. Build command: `next build`
5. Output: Static pages + server functions

### Build Command
```bash
npm run build
# or
pnpm build
```

### Start Command (Production)
```bash
npm start
# or
pnpm start
```

### Environment Configuration
- Environment variables set in Vercel dashboard
- Or via Vercel CLI: `vercel env add`
- Required: All Supabase env vars listed in section 6

### Runtime Requirements
- **Node.js**: 18.x or higher
- **Next.js**: 16.0.10
- **Build Output**: Hybrid (static + serverless functions)
- **Edge Functions**: Middleware runs on Vercel Edge

### Database Setup
1. Create Supabase project
2. Run migration scripts in order (001 through 008)
3. Enable RLS on all tables
4. Copy connection strings to env vars

### Post-Deployment Checklist
- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Check database connection
- [ ] Verify blob storage for images
- [ ] Test public profile pages
- [ ] Confirm middleware protection works

---

## 9. Known Failure Points

### What Breaks if Supabase is Missing

#### Complete Application Failure
- **Authentication**: Cannot log in or sign up
- **All Data Fetching**: No database access
- **User Profiles**: Cannot load or display
- **Links**: Cannot CRUD operations
- **Connections**: Cannot manage friends
- **Chat**: Cannot send/receive messages

#### Files Directly Dependent on Supabase

**Authentication:**
- `app/auth/login/page.tsx` - Login form
- `app/auth/sign-up/page.tsx` - Sign up form
- `proxy.ts` - Route protection
- `lib/supabase/proxy.ts` - Session management

**Data Layer:**
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- All `app/dashboard/*` pages - Dashboard functionality
- `app/u/[nickname]/page.tsx` - Public profiles

**Components:**
- `components/dashboard/*` - All dashboard components
- `components/links/*` - Link management
- `components/connections/*` - Connection management
- `components/chat/*` - Chat interface
- `components/public/public-profile.tsx` - Public profile display

### Critical Dependencies
1. **Supabase Auth**: Entire auth system depends on it
2. **Supabase Database**: All data operations require it
3. **Supabase Realtime**: Chat and notifications need it
4. **Vercel Blob**: Image uploads break without it (non-critical)

### Graceful Degradation
- **None**: Application is fully dependent on Supabase
- **Landing Page**: Works without Supabase (static)
- **Public Profiles**: Fail without database access

---

## 10. Migration Guide: Supabase → Firebase

### Overview
To replace Supabase with Firebase Auth + Firestore, you must rewrite the data layer while keeping UI components largely intact.

### Step 1: Install Firebase
```bash
npm install firebase firebase-admin
```

### Step 2: Replace Authentication

#### Files to Rewrite:
- `lib/supabase/client.ts` → `lib/firebase/client.ts`
- `lib/supabase/server.ts` → `lib/firebase/server.ts`
- `lib/supabase/proxy.ts` → `lib/firebase/middleware.ts`

#### Auth Changes:

**Supabase (Before):**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})
```

**Firebase (After):**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth'
const userCredential = await signInWithEmailAndPassword(auth, email, password)
```

#### Files Requiring Auth Changes:
- `app/auth/login/page.tsx`
- `app/auth/sign-up/page.tsx`
- `proxy.ts` (middleware)

### Step 3: Replace Database Access

#### Firestore Structure:
```
users/
  {userId}/
    profile: { nickname, displayName, bio, avatarUrl, ... }
    
link_blocks/
  {linkId}/
    userId, type, title, url, visibility, position, ...
    
connections/
  {connectionId}/
    requesterId, receiverId, status, ...
    
messages/
  {messageId}/
    connectionId, senderId, receiverId, content, ...
```

#### Query Changes:

**Supabase (Before):**
```typescript
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('nickname', nickname)
  .single()
```

**Firebase (After):**
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore'
const q = query(collection(db, 'users'), where('nickname', '==', nickname))
const snapshot = await getDocs(q)
const data = snapshot.docs[0]?.data()
```

### Step 4: Replace Real-time Subscriptions

**Supabase (Before):**
```typescript
supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', table: 'messages' }, handler)
  .subscribe()
```

**Firebase (After):**
```typescript
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore'
const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      // Handle new message
    }
  })
})
```

### Step 5: Replace Row Level Security with Firestore Rules

**Firestore Rules (rules.firestore):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    // Link blocks with visibility control
    match /link_blocks/{linkId} {
      allow read: if resource.data.visibility == 'public'
                  || request.auth.uid == resource.data.userId
                  || (resource.data.visibility == 'friends' 
                      && isConnected(request.auth.uid, resource.data.userId));
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Connections
    match /connections/{connectionId} {
      allow read: if request.auth.uid == resource.data.requesterId
                  || request.auth.uid == resource.data.receiverId;
      allow write: if request.auth.uid == resource.data.requesterId
                   || request.auth.uid == resource.data.receiverId;
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth.uid == resource.data.senderId
                  || request.auth.uid == resource.data.receiverId;
      allow write: if request.auth.uid == resource.data.senderId;
    }
  }
  
  function isConnected(userId1, userId2) {
    return exists(/databases/$(database)/documents/connections/$(userId1 + '_' + userId2))
           && get(/databases/$(database)/documents/connections/$(userId1 + '_' + userId2)).data.status == 'accepted';
  }
}
```

### Step 6: Files That Must Be Rewritten

**Core Data Layer (100% rewrite):**
- `lib/supabase/client.ts` → `lib/firebase/client.ts`
- `lib/supabase/server.ts` → `lib/firebase/server.ts`
- `lib/supabase/proxy.ts` → `lib/firebase/middleware.ts`
- `proxy.ts` (middleware auth check)

**Pages (database calls only):**
- `app/auth/login/page.tsx` - Replace auth calls
- `app/auth/sign-up/page.tsx` - Replace auth calls
- `app/dashboard/page.tsx` - Replace queries
- `app/dashboard/links/page.tsx` - Replace CRUD
- `app/dashboard/connections/page.tsx` - Replace CRUD
- `app/dashboard/chat/page.tsx` - Replace CRUD + realtime
- `app/dashboard/profile/page.tsx` - Replace updates
- `app/u/[nickname]/page.tsx` - Replace queries

**Components (database calls only):**
- `components/dashboard/profile-form.tsx`
- `components/dashboard/quick-stats.tsx`
- `components/links/links-list.tsx`
- `components/links/add-link-dialog.tsx`
- `components/links/edit-link-dialog.tsx`
- `components/connections/connections-tabs.tsx`
- `components/connections/search-users.tsx`
- `components/chat/chat-interface.tsx`
- `components/public/public-profile.tsx`

### Step 7: What Can Stay the Same

**UI Components (no changes needed):**
- All `components/ui/*` (shadcn components)
- `components/theme-provider.tsx`
- `components/theme-toggle.tsx`
- Layout components (as long as they don't fetch data)

**Utilities (mostly unchanged):**
- `lib/utils.ts` - No changes
- `lib/crypto.ts` - No changes (encryption logic)
- `lib/link-templates.ts` - No changes
- `app/globals.css` - No changes

**Static Pages (no changes):**
- `app/page.tsx` (landing page)
- `app/layout.tsx` (root layout)

### Step 8: Data Migration

**Export from Supabase:**
```sql
COPY (SELECT * FROM users) TO '/tmp/users.csv' CSV HEADER;
COPY (SELECT * FROM link_blocks) TO '/tmp/link_blocks.csv' CSV HEADER;
COPY (SELECT * FROM connections) TO '/tmp/connections.csv' CSV HEADER;
COPY (SELECT * FROM messages) TO '/tmp/messages.csv' CSV HEADER;
```

**Import to Firestore:**
```typescript
import { collection, doc, setDoc } from 'firebase/firestore'
import csv from 'csv-parser'
import fs from 'fs'

// Parse CSV and import
fs.createReadStream('users.csv')
  .pipe(csv())
  .on('data', async (row) => {
    await setDoc(doc(db, 'users', row.id), row)
  })
```

### Step 9: Testing Checklist
- [ ] Authentication (sign up, login, logout)
- [ ] Create/read/update/delete links
- [ ] Friend connections (request, accept, reject)
- [ ] Chat (send, receive, real-time updates)
- [ ] Profile updates (avatar, bio, theme)
- [ ] Public profile viewing
- [ ] Visibility controls (public, friends, private)
- [ ] Click tracking
- [ ] QR code generation

### Estimated Migration Effort
- **Data Layer Rewrite**: 8-16 hours
- **Auth Integration**: 4-8 hours
- **Real-time Features**: 4-8 hours
- **Testing & Debugging**: 8-16 hours
- **Total**: 24-48 hours

---

## Conclusion

This application is a fully-featured link-in-bio platform with privacy controls, built on Next.js 16 and Supabase. The architecture is modern, using React Server Components for performance and Supabase for authentication and data persistence. The codebase is well-structured with clear separation of concerns between UI, data layer, and business logic.

**Key Strengths:**
- Modern Next.js App Router architecture
- Comprehensive RLS security model
- Real-time capabilities (chat, notifications)
- End-to-end encryption support
- Scalable component structure

**Migration Considerations:**
- Fully dependent on Supabase (no graceful degradation)
- Migration to Firebase requires complete data layer rewrite
- UI components are reusable across backends
- Database schema must be replicated in Firestore collections

For questions or clarification on any section, refer to the specific files mentioned in each section.
