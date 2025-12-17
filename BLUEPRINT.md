# OneLink Application Blueprint

## Executive Summary

OneLink is a privacy-first link-in-bio platform that enables creators and professionals to build their digital presence with end-to-end encryption, selective content sharing, and AI-powered customization. Unlike traditional link aggregators, OneLink prioritizes data ownership, user privacy, and zero-tracking while providing a modern, feature-rich experience.

**Core Value Proposition:** The only link-in-bio platform where your private content remains truly private, with granular friend-based sharing and client-side encryption that ensures "trust no one" architecture.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Technical Architecture](#technical-architecture)
3. [Feature Specifications](#feature-specifications)
4. [Database Schema](#database-schema)
5. [Security & Encryption](#security--encryption)
6. [User Experience Flow](#user-experience-flow)
7. [API Architecture](#api-architecture)
8. [Design System](#design-system)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Future Roadmap](#future-roadmap)

---

## 1. Product Overview

### 1.1 Target Audience

- **Privacy-conscious creators:** Content creators who value data ownership
- **Professional influencers:** Individuals building personal brands across platforms
- **Communities:** Groups sharing exclusive content with verified members
- **Enterprise users:** Companies requiring secure link management

### 1.2 Key Differentiators

| Feature | OneLink | Competitors |
|---------|---------|-------------|
| **End-to-End Encryption** | ✅ RSA + AES-GCM | ❌ Server-side only |
| **Granular Privacy Controls** | Public / Friends / Private | Limited visibility options |
| **Zero Tracking** | ✅ No analytics tracking | ❌ Full user tracking |
| **Data Ownership** | ✅ User controls all data | ❌ Platform owns data |
| **AI Theme Generation** | ✅ Custom AI themes | Basic templates |
| **Friend Connections** | ✅ Verified network | Public only |

### 1.3 Core Features

1. **Link Management**
   - Unlimited link blocks
   - Drag-and-drop reordering
   - Click tracking (privacy-respecting)
   - Visibility controls per link

2. **Privacy & Encryption**
   - Client-side RSA-OAEP key generation
   - AES-GCM content encryption
   - Encrypted friend-only content
   - Private key stored locally only

3. **Friend Network**
   - Send/receive connection requests
   - Encrypted content sharing
   - Friend-only link visibility
   - Secure messaging

4. **Customization**
   - AI-powered theme generation
   - Custom colors and layouts
   - Profile customization
   - Cover photos and avatars

5. **Public Profiles**
   - Clean, branded URLs (onelink.app/u/username)
   - QR code generation
   - SEO-optimized pages
   - Responsive design

---

## 2. Technical Architecture

### 2.1 Technology Stack

#### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React 19 (Server Components + Client Components)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

#### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password)
- **Storage:** Vercel Blob (images, files)
- **API:** Next.js Route Handlers + Server Actions
- **Real-time:** Supabase Realtime (WebSocket)

#### DevOps
- **Hosting:** Vercel
- **CI/CD:** Vercel automatic deployments
- **Monitoring:** Vercel Analytics
- **Domain:** Custom domain support

### 2.2 Architecture Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Next.js   │  │  Crypto API  │  │  Local Storage    │  │
│  │  App       │  │  (RSA/AES)   │  │  (Private Keys)   │  │
│  └─────┬──────┘  └──────┬───────┘  └─────────┬──────────┘  │
└────────┼────────────────┼───────────────────────┼───────────┘
         │                │                       │
         │ HTTPS          │ Client-side only      │ Never sent
         │                │                       │
┌────────▼────────────────▼───────────────────────▼───────────┐
│                      Vercel Edge Network                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Next.js Server Components                 │   │
│  │  ├─ Route Handlers (API)                            │   │
│  │  ├─ Server Actions (Mutations)                      │   │
│  │  ├─ Middleware (Auth + Token Refresh)               │   │
│  │  └─ Server-side Rendering                           │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          │ Supabase Client
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                    Supabase Cloud                           │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  PostgreSQL    │  │  Auth        │  │  Realtime     │  │
│  │  (with RLS)    │  │  Service     │  │  (WebSocket)  │  │
│  └────────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Blob API
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                    Vercel Blob Storage                      │
│  (Images, Cover Photos, Avatars)                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Data Flow Patterns

**Public Content Flow:**
```
User Input → Next.js → Supabase → PostgreSQL (no encryption)
```

**Friends-Only Content Flow:**
```
User Input → Client Encryption (AES) → Next.js → Supabase → PostgreSQL (encrypted)
Friend Access → Fetch Encrypted → Decrypt Client-side → Display
```

**Private Content Flow:**
```
User Input → Client Encryption (AES) → Next.js → Supabase → PostgreSQL (encrypted)
Private Key stored in LocalStorage (never sent to server)
User Access → Fetch Encrypted → Decrypt with Local Key → Display
```

---

## 3. Feature Specifications

### 3.1 Authentication & Onboarding

#### Sign Up Flow
1. User enters email and password
2. System validates email format and password strength
3. Supabase creates auth user
4. Database trigger creates user profile with:
   - Auto-generated nickname (from email)
   - Display name (from email)
   - RSA key pair generation prompt (optional)
5. Email verification sent
6. User redirected to dashboard

#### Login Flow
1. User enters credentials
2. Supabase validates and issues JWT
3. Middleware refreshes token on each request
4. User session maintained via HTTP-only cookies
5. Private key retrieved from localStorage (if exists)

#### Security Measures
- Password: Min 6 characters
- Email verification required
- JWT tokens with 1-hour expiration
- Automatic token refresh via middleware
- Row Level Security (RLS) on all tables

### 3.2 Link Management

#### Creating Links
```typescript
// Link Block Structure
interface LinkBlock {
  type: "link" | "social" | "contact" | "file" | "note"
  title: string
  url: string | null
  icon: string | null
  visibility: "public" | "friends" | "private"
  template: string | null  // Social media template
  encrypted_blob: string | null  // For private content
  position: number  // For drag-drop ordering
  is_active: boolean
  click_count: number
}
```

**Visibility Levels:**
- **Public:** Visible to everyone visiting the profile
- **Friends:** Only visible to accepted connections
- **Private:** Requires decryption key, only visible to owner

**Link Types:**
- **Link:** Standard URL with title and optional icon
- **Social:** Pre-templated social media links (Instagram, Twitter, etc.)
- **Contact:** Email, phone, or messaging platforms
- **File:** Attachments via Vercel Blob
- **Note:** Text-only content blocks

#### Reordering Links
- Drag-and-drop interface using @dnd-kit
- Position stored as integer (0-indexed)
- Real-time updates without page refresh
- Server-side position validation

#### Click Tracking
```sql
-- Increment function (called on link click)
CREATE OR REPLACE FUNCTION increment_link_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE link_blocks
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.3 Friend Connections

#### Connection States
```
pending → accepted / rejected / blocked
```

**Connection Flow:**
1. User A searches for User B by nickname
2. User A sends connection request
3. User B receives notification
4. User B accepts/rejects
5. If accepted:
   - Shared encryption key generated
   - Friend-only content becomes visible
   - Messaging enabled

#### Connection Notifications
- Real-time notification badge in navigation
- Displays count of pending requests
- Supabase Realtime subscription for instant updates
- Badge persists across sessions

### 3.4 Messaging System

#### Standard Messaging
- One-to-one messaging between connections
- Real-time message delivery via Supabase Realtime
- Read/unread status tracking
- Message history persisted

#### Private Chat (Ephemeral)
```typescript
interface PrivateChat {
  connection_id: string
  created_by: string
  message_lifetime_minutes: number  // Auto-delete messages
  chat_destroy_at: timestamp  // Auto-destroy entire chat
  is_active: boolean
}
```

**Features:**
- Configurable message lifetime (5min, 1hr, 24hr, 7d)
- Configurable chat destruction time
- Messages auto-delete after lifetime expires
- Entire chat destroyed at specified time
- End-to-end encrypted by default

### 3.5 Theme Customization

#### AI Theme Generation
- User provides prompt (e.g., "dark mode with purple accents")
- Server-side API call to AI service
- Generates complete color palette:
  - Primary, secondary, accent colors
  - Background, foreground, muted colors
  - Border, input, ring colors
- Applies theme to profile instantly
- Theme saved in `theme_config` JSONB column

#### Manual Customization
- Color picker for each design token
- Live preview of changes
- Reset to default theme option
- Export/import theme JSON

### 3.6 Public Profile

#### Profile URL Structure
```
https://onelink.app/u/[nickname]
```

#### Profile Components
1. **Header Section**
   - Cover photo (optional)
   - Avatar image
   - Display name
   - Bio (500 chars max)
   - Friend connection button (if not connected)

2. **Link Blocks**
   - Filtered by visibility (respects privacy settings)
   - Social media icons for templated links
   - Click tracking (privacy-respecting)
   - Smooth animations and transitions

3. **QR Code**
   - Generate QR code for profile URL
   - Download as PNG/SVG
   - Share via link or print

#### SEO Optimization
- Dynamic meta tags (title, description)
- Open Graph tags for social sharing
- Structured data (JSON-LD)
- Sitemap generation for all public profiles

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │◄─────┐
│ email            │      │
│ nickname (UK)    │      │
│ display_name     │      │
│ bio              │      │
│ avatar_url       │      │
│ cover_photo      │      │
│ public_key       │      │
│ theme_config     │      │
│ created_at       │      │
│ updated_at       │      │
└──────────────────┘      │
         │                │
         │                │
         ▼                │
┌──────────────────┐      │
│   link_blocks    │      │
├──────────────────┤      │
│ id (PK)          │      │
│ user_id (FK)     │──────┘
│ type             │
│ title            │
│ url              │
│ icon             │
│ visibility       │
│ encrypted_blob   │
│ template         │
│ position         │
│ is_active        │
│ click_count      │
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│   connections    │
├──────────────────┤      ┌──────────────────┐
│ id (PK)          │      │    messages      │
│ requester_id(FK) │      ├──────────────────┤
│ receiver_id (FK) │      │ id (PK)          │
│ status           │◄─────┤ connection_id(FK)│
│ shared_key       │      │ sender_id (FK)   │
│ created_at       │      │ receiver_id (FK) │
│ updated_at       │      │ content          │
└──────────────────┘      │ encrypted        │
         │                │ read             │
         │                │ created_at       │
         │                │ updated_at       │
         │                └──────────────────┘
         │
         ▼
┌──────────────────┐
│  private_chats   │
├──────────────────┤
│ id (PK)          │
│ connection_id(FK)│
│ created_by (FK)  │
│ message_lifetime │
│ chat_destroy_at  │
│ is_active        │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### 4.2 Table Specifications

#### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cover_photo TEXT,
  public_key TEXT,  -- RSA public key for encryption
  theme_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_email ON users(email);
```

**RLS Policies:**
- ✅ Users can view all public profiles (SELECT)
- ✅ Users can insert their own profile (INSERT)
- ✅ Users can update their own profile (UPDATE)
- ✅ Users can delete their own profile (DELETE)

#### `link_blocks` Table
```sql
CREATE TABLE link_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('link', 'social', 'contact', 'file', 'note')),
  title TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  encrypted_blob TEXT,  -- Encrypted content for private/friends links
  template TEXT,  -- Social media template (instagram, twitter, etc.)
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_link_blocks_user_id ON link_blocks(user_id);
CREATE INDEX idx_link_blocks_visibility ON link_blocks(visibility);
CREATE INDEX idx_link_blocks_position ON link_blocks(position);
```

**RLS Policies:**
- ✅ Anyone can view public link blocks (SELECT)
- ✅ Friends can view friends-only link blocks (SELECT with JOIN)
- ✅ Users can view their own link blocks (SELECT)
- ✅ Users can insert their own link blocks (INSERT)
- ✅ Users can update their own link blocks (UPDATE)
- ✅ Users can delete their own link blocks (DELETE)

#### `connections` Table
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  shared_key TEXT,  -- Encrypted key for friends-only content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);

-- Indexes
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
```

**RLS Policies:**
- ✅ Users can view their connections (SELECT)
- ✅ Users can create connection requests (INSERT)
- ✅ Receivers can update connection status (UPDATE)
- ✅ Users can delete their connections (DELETE)

#### `messages` Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_connection ON messages(connection_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_read ON messages(read);
```

**RLS Policies:**
- ✅ Users can read their messages (SELECT)
- ✅ Users can send messages (INSERT)
- ✅ Users can update sent messages (UPDATE)
- ✅ Users can delete sent messages (DELETE)

#### `private_chats` Table
```sql
CREATE TABLE private_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_lifetime_minutes INTEGER NOT NULL,  -- Messages auto-delete after this
  chat_destroy_at TIMESTAMPTZ NOT NULL,  -- Entire chat destroyed at this time
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_private_chats_connection ON private_chats(connection_id);
CREATE INDEX idx_private_chats_destroy_at ON private_chats(chat_destroy_at);
```

**RLS Policies:**
- ✅ Users can view their private chats (SELECT)
- ✅ Users can create private chats (INSERT)

### 4.3 Database Functions

#### Increment Click Count
```sql
CREATE OR REPLACE FUNCTION increment_link_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE link_blocks
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Auto-Create User Profile on Signup
```sql
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, nickname, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    split_part(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

---

## 5. Security & Encryption

### 5.1 Encryption Architecture

#### "Trust No One" Model
OneLink implements a zero-knowledge architecture where the server never has access to private content in plaintext.

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Private Key (RSA-OAEP 2048-bit)                       │ │
│  │  - Generated client-side using Web Crypto API          │ │
│  │  - Stored in localStorage                              │ │
│  │  - NEVER sent to server                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Public Key (RSA-OAEP 2048-bit)                        │ │
│  │  - Generated with private key                          │ │
│  │  - Sent to server for sharing                          │ │
│  │  - Stored in users.public_key                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Only public key sent
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                    Supabase Database                        │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Encrypted Content (AES-GCM 256-bit)                   ││
│  │  - Content encrypted with AES key                      ││
│  │  - AES key encrypted with RSA public key               ││
│  │  - Stored as base64 strings                            ││
│  │  - Server cannot decrypt                               ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Encryption Flows

#### Private Content Encryption
```typescript
// 1. Generate AES key client-side
const aesKey = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
)

// 2. Encrypt content with AES
const iv = crypto.getRandomValues(new Uint8Array(12))
const encryptedContent = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  aesKey,
  textEncoder.encode(content)
)

// 3. Store encrypted content + IV (AES key stays local)
const encryptedBlob = JSON.stringify({
  content: arrayBufferToBase64(encryptedContent),
  iv: arrayBufferToBase64(iv)
})

// 4. Save to database
await supabase.from('link_blocks').insert({
  encrypted_blob: encryptedBlob,
  visibility: 'private'
})
```

#### Friends-Only Content Encryption
```typescript
// 1. Generate AES key
const aesKey = await generateAESKey()

// 2. Encrypt content with AES
const encryptedData = await encryptContent(content, aesKey)

// 3. Encrypt AES key with friend's public key (RSA)
const friendPublicKey = await fetchFriendPublicKey(friendId)
const encryptedAESKey = await encryptKeyWithPublicKey(aesKey, friendPublicKey)

// 4. Store both encrypted content and encrypted key
await supabase.from('link_blocks').insert({
  encrypted_blob: JSON.stringify({
    content: encryptedData.encryptedContent,
    iv: encryptedData.iv,
    key: encryptedAESKey  // Friend can decrypt this with their private key
  }),
  visibility: 'friends'
})
```

#### Decryption Flow (Friend Access)
```typescript
// 1. Fetch encrypted content
const { data } = await supabase
  .from('link_blocks')
  .select('encrypted_blob')
  .eq('id', linkId)
  .single()

const parsed = JSON.parse(data.encrypted_blob)

// 2. Decrypt AES key with user's private key
const privateKey = getPrivateKey(userId) // From localStorage
const aesKey = await decryptKeyWithPrivateKey(parsed.key, privateKey)

// 3. Decrypt content with AES key
const content = await decryptContent({
  encryptedContent: parsed.content,
  iv: parsed.iv
}, aesKey)
```

### 5.3 Security Best Practices

#### Authentication
- ✅ Email/password authentication via Supabase Auth
- ✅ Email verification required
- ✅ JWT tokens with 1-hour expiration
- ✅ Automatic token refresh via middleware
- ✅ HTTP-only cookies (no localStorage for tokens)
- ✅ CSRF protection via SameSite cookies

#### Row Level Security (RLS)
- ✅ All tables have RLS enabled
- ✅ Policies enforce user-level permissions
- ✅ Friend connections validated at database level
- ✅ No direct table access without policies

#### Data Protection
- ✅ Private keys never leave the browser
- ✅ Encrypted content stored as base64 strings
- ✅ AES-GCM authenticated encryption
- ✅ RSA-OAEP for key exchange
- ✅ Random IV for each encryption

#### API Security
- ✅ Server Actions for mutations (CSRF-safe)
- ✅ Route Handlers for read operations
- ✅ Input validation with Zod schemas
- ✅ Rate limiting via Vercel Edge Config
- ✅ CORS restrictions

---

## 6. User Experience Flow

### 6.1 New User Journey

```
┌──────────────┐
│  Visit Site  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Landing     │  ← Marketing page with features
│  Page        │     Call-to-action: "Get Started"
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Sign Up     │  ← Email + Password
│  Page        │     Nickname auto-generated
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Email       │  ← Verify email address
│  Verification│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dashboard   │  ← Empty state with onboarding
│  (First Time)│     Prompt to:
└──────┬───────┘     1. Add first link
       │              2. Customize profile
       │              3. Generate theme
       ▼
┌──────────────┐
│  Add Links   │  ← Add 2-3 links
│  Tutorial    │     Set visibility
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Customize   │  ← Upload avatar
│  Profile     │     Write bio
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Share       │  ← Copy profile URL
│  Profile     │     Generate QR code
└──────────────┘
```

### 6.2 Returning User Journey

```
┌──────────────┐
│  Login       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dashboard   │  ← Overview with stats
│  Home        │     Quick actions
└──────┬───────┘     Recent activity
       │
       ├─────────────┬─────────────┬─────────────┐
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Links   │  │ Friends  │  │   Chat   │  │  Theme   │
│  Mgmt    │  │ Network  │  │ Messages │  │ Customize│
└──────────┘  └──────────┘  └──────────┘  └──────────┘
       │             │             │             │
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Profile     │
              │  Settings    │
              └──────────────┘
```

### 6.3 Public Visitor Journey

```
┌──────────────┐
│  Discover    │  ← Find profile via:
│  Profile     │     - Direct link
└──────┬───────┘     - QR code scan
       │              - Search
       ▼
┌──────────────┐
│  View        │  ← See public links only
│  Profile     │     (unless connected)
└──────┬───────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Click   │  │  Send    │  │  Sign Up │
│  Links   │  │  Friend  │  │  to      │
│          │  │  Request │  │  Create  │
└──────────┘  └──────────┘  └──────────┘
```

### 6.4 Key Interactions

#### Adding a Link
1. Click "Add Link" button
2. Dialog opens with form
3. Select link type (link/social/contact/etc.)
4. Enter title and URL
5. Choose visibility (public/friends/private)
6. If private: content encrypted client-side
7. Save → Link appears in list
8. Drag to reorder position

#### Connecting with Friends
1. Go to "Friends" tab
2. Click "Add Friend"
3. Search by nickname
4. Send request
5. Notification sent to recipient
6. Recipient accepts/rejects
7. If accepted: friend-only content becomes visible

#### Sending Messages
1. Go to "Chat" tab
2. Select connection from list
3. Type message in input
4. Optional: Start private chat (ephemeral)
5. Send → Message appears instantly
6. Real-time delivery to recipient

#### Customizing Theme
1. Go to "Theme" tab
2. Choose: AI generation or manual
3. If AI: enter prompt (e.g., "dark purple")
4. Preview generated theme
5. Apply to profile
6. Changes reflected immediately

---

## 7. API Architecture

### 7.1 API Patterns

OneLink uses a hybrid API architecture:
- **Server Actions** for mutations (create, update, delete)
- **Route Handlers** for complex reads and external integrations
- **Direct Supabase calls** for simple reads in Server Components

#### Pattern 1: Server Actions (Mutations)
```typescript
// app/actions/links.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLink(data: LinkFormData) {
  const supabase = await createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('link_blocks')
    .insert({
      user_id: user.id,
      ...data
    })
  
  if (error) throw error
  
  revalidatePath('/dashboard/links')
  return { success: true }
}
```

#### Pattern 2: Route Handlers (External APIs)
```typescript
// app/api/generate-theme/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { prompt } = await request.json()
  
  // Call AI service to generate theme
  const theme = await generateThemeWithAI(prompt)
  
  return NextResponse.json({ theme })
}
```

#### Pattern 3: Direct Supabase (Server Components)
```typescript
// app/dashboard/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: links } = await supabase
    .from('link_blocks')
    .select('*')
    .eq('user_id', user.id)
    .order('position')
  
  return <LinksList links={links} />
}
```

### 7.2 API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-out` - User logout
- `GET /auth/callback` - OAuth callback

#### Links Management
- Server Action: `createLink(data)`
- Server Action: `updateLink(id, data)`
- Server Action: `deleteLink(id)`
- Server Action: `reorderLinks(positions)`
- Route Handler: `POST /api/links/increment-clicks`

#### Friend Connections
- Server Action: `sendConnectionRequest(userId)`
- Server Action: `acceptConnection(connectionId)`
- Server Action: `rejectConnection(connectionId)`
- Server Action: `blockConnection(connectionId)`

#### Messaging
- Server Action: `sendMessage(connectionId, content)`
- Server Action: `markMessageRead(messageId)`
- Server Action: `deleteMessage(messageId)`
- Server Action: `startPrivateChat(connectionId, config)`

#### Theme Customization
- Route Handler: `POST /api/generate-theme`
- Server Action: `saveTheme(themeConfig)`

#### File Uploads
- Route Handler: `POST /api/upload-photo`
- Uses Vercel Blob for storage
- Validates file type and size
- Returns public URL

### 7.3 Real-time Subscriptions

#### Connection Notifications
```typescript
// Subscribe to pending connection requests
const supabase = createClient()

const subscription = supabase
  .channel('connections')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'connections',
    filter: `receiver_id=eq.${userId}`
  }, (payload) => {
    // Update notification badge
    setPendingCount(prev => prev + 1)
  })
  .subscribe()
```

#### Real-time Chat
```typescript
// Subscribe to new messages
const subscription = supabase
  .channel(`chat:${connectionId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `connection_id=eq.${connectionId}`
  }, (payload) => {
    // Append message to chat
    setMessages(prev => [...prev, payload.new])
  })
  .subscribe()
```

---

## 8. Design System

### 8.1 Color Palette

#### Light Mode
```css
:root {
  --background: oklch(0.99 0 0);           /* #FCFCFC */
  --foreground: oklch(0.09 0 0);           /* #171717 */
  --primary: oklch(0.42 0.19 264);         /* #533BF5 (Electric Blue) */
  --primary-foreground: oklch(0.99 0 0);   /* #FCFCFC */
  --secondary: oklch(0.96 0 0);            /* #F5F5F5 */
  --muted: oklch(0.96 0 0);                /* #F5F5F5 */
  --border: oklch(0.92 0 0);               /* #EBEBEB */
  --ring: oklch(0.42 0.19 264);            /* #533BF5 */
}
```

#### Dark Mode
```css
.dark {
  --background: hsl(222.2 84% 4.9%);       /* #020817 */
  --foreground: hsl(210 40% 98%);          /* #F8FAFC */
  --primary: rgb(83, 59, 245);             /* #533BF5 */
  --secondary: hsl(217.2 32.6% 17.5%);     /* #1E293B */
  --muted: hsl(217.2 32.6% 17.5%);         /* #1E293B */
  --border: hsl(217.2 32.6% 17.5%);        /* #1E293B */
  --ring: hsl(224.3 76.3% 94.1%);          /* #DBEAFE */
}
```

### 8.2 Typography

```css
@theme inline {
  --font-sans: "Geist", "Geist Fallback";
  --font-mono: "Geist Mono", "Geist Mono Fallback";
}
```

**Font Hierarchy:**
- Headings: Geist Sans, Bold (600-700)
- Body: Geist Sans, Regular (400)
- Code: Geist Mono, Regular (400)

**Scale:**
- Display: 3.5-4rem (56-64px)
- H1: 2.5-3rem (40-48px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### 8.3 Component Library

OneLink uses shadcn/ui components built on Radix UI primitives.

**Core Components:**
- Button
- Card
- Dialog
- Input
- Select
- Textarea
- Avatar
- Badge
- Dropdown Menu
- Tabs
- Toast
- Tooltip

**Custom Components:**
- Link Card (drag-and-drop)
- Profile Card
- Connection Card
- Chat Interface
- Theme Preview
- QR Code Dialog

### 8.4 Spacing & Layout

**Spacing Scale:**
- 0.25rem (4px) - xs
- 0.5rem (8px) - sm
- 1rem (16px) - md
- 1.5rem (24px) - lg
- 2rem (32px) - xl
- 3rem (48px) - 2xl

**Breakpoints:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Layout Patterns:**
- Dashboard: Sidebar + Main Content
- Public Profile: Centered Single Column (max-w-2xl)
- Landing Page: Full Width Sections

### 8.5 Animations

```css
/* Smooth transitions for interactive elements */
@layer base {
  * {
    @apply transition-colors duration-200;
  }
}

/* Card hover effects */
.card-hover {
  @apply hover:border-primary transition-all duration-300;
}

/* Button animations */
.button-press {
  @apply active:scale-95 transition-transform;
}
```

---

## 9. Deployment & Infrastructure

### 9.1 Deployment Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                      │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │  Production Branch (main)                         │ │
│  │  - Auto-deploy on push                            │ │
│  │  - Custom domain (onelink.app)                    │ │
│  │  - Edge Network (Global CDN)                      │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Preview Branches                                 │ │
│  │  - Unique URL per PR                              │ │
│  │  - Full environment cloning                       │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Data Layer
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Supabase Cloud                         │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │  Production Database                              │ │
│  │  - PostgreSQL 15                                  │ │
│  │  - Auto-scaling                                   │ │
│  │  - Point-in-time recovery                         │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Development Database (optional)                  │ │
│  │  - Separate project                               │ │
│  │  - Same schema                                    │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Storage
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Vercel Blob Storage                    │
├─────────────────────────────────────────────────────────┤
│  - Profile avatars                                      │
│  - Cover photos                                         │
│  - File attachments                                     │
│  - Global CDN distribution                              │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Environment Variables

#### Required (Production)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Optional: Custom domain
NEXT_PUBLIC_APP_URL=https://onelink.app
```

#### Development
```bash
# Local Supabase (if using Docker)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Or use same as production for cloud development
```

### 9.3 Deployment Process

#### Automatic Deployment (main branch)
```
┌───────────┐
│  Git Push │
└─────┬─────┘
      │
      ▼
┌──────────────────┐
│  Vercel Build    │
│  1. Install deps │
│  2. Run build    │
│  3. Generate     │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  Deploy to Edge  │
│  - Global CDN    │
│  - Instant cache │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  Health Checks   │
│  - Run tests     │
│  - Verify routes │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  Live! ✅        │
└──────────────────┘
```

#### Database Migrations
```bash
# 1. Create migration script
# scripts/XXX_migration_name.sql

# 2. Run via Supabase Dashboard SQL Editor
# Or use Supabase CLI:
supabase db push

# 3. Verify in production
# Check tables and RLS policies
```

### 9.4 Monitoring & Analytics

#### Vercel Analytics
- Real-time visitor tracking
- Core Web Vitals monitoring
- Page performance metrics
- Error tracking

#### Supabase Dashboard
- Database queries/sec
- Connection pool usage
- Storage usage
- Auth success rate

#### Custom Logging
```typescript
// lib/analytics.ts
export function trackEvent(event: string, data?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('[Analytics]', event, data)
  }
}
```

### 9.5 Performance Optimizations

#### Image Optimization
- Next.js Image component
- Automatic WebP/AVIF conversion
- Lazy loading by default
- Responsive images

#### Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Tree shaking for unused code

#### Caching Strategy
```typescript
// Static pages (30 days)
export const revalidate = 2592000

// Dynamic pages (5 minutes)
export const revalidate = 300

// Real-time (no cache)
export const revalidate = 0
```

#### Edge Functions
- Middleware runs on Edge
- Global distribution
- Sub-10ms response times
- Reduced cold starts

---

## 10. Future Roadmap

### 10.1 Phase 2: Enhanced Features (Q2 2025)

#### Advanced Analytics
- Detailed click analytics per link
- Geographic visitor data
- Referrer tracking (privacy-respecting)
- Export analytics to CSV/JSON

#### Social Media Integration
- Auto-fetch profile data from social platforms
- Display follower counts
- Embed recent posts (Instagram, Twitter)
- YouTube video embed support

#### Team Collaboration
- Multi-user accounts (teams)
- Role-based permissions (admin, editor, viewer)
- Shared link collections
- Team activity logs

### 10.2 Phase 3: Monetization (Q3 2025)

#### Premium Features
- Custom domains (pro.johndoe.com)
- Advanced themes (more AI options)
- Priority support
- Analytics exports
- White-label branding

#### Pricing Tiers
```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│    Free     │     Pro      │   Business   │  Enterprise  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   $0/mo     │   $9/mo      │   $29/mo     │   Custom     │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ Unlimited   │ Custom       │ Multiple     │ White-label  │
│ links       │ domain       │ team members │ solution     │
│             │              │              │              │
│ Basic       │ Advanced     │ Advanced     │ Dedicated    │
│ themes      │ analytics    │ analytics    │ support      │
│             │              │              │              │
│ Public      │ Everything   │ Everything   │ Everything   │
│ profile     │ in Free      │ in Pro       │ + Custom     │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

### 10.3 Phase 4: Mobile App (Q4 2025)

#### Native Apps
- React Native for iOS and Android
- Offline support
- Push notifications
- QR code scanning
- Biometric authentication

#### Progressive Web App (PWA)
- Add to homescreen
- Offline-first architecture
- Service worker caching
- App-like experience

### 10.4 Phase 5: Advanced Encryption (2026)

#### Zero-Knowledge Proof
- Prove link ownership without revealing content
- Cryptographic access control
- Advanced key management

#### Blockchain Integration
- NFT gating (token-based access)
- Decentralized identity (ENS, Unstoppable Domains)
- Web3 wallet connections
- Crypto payments

### 10.5 Technical Debt & Improvements

#### Performance
- [ ] Implement Redis caching layer
- [ ] Add GraphQL API (Apollo)
- [ ] Optimize Supabase queries
- [ ] Image CDN optimization

#### Developer Experience
- [ ] Comprehensive test suite (Jest + Playwright)
- [ ] Storybook for component library
- [ ] API documentation (Swagger)
- [ ] Developer sandbox environment

#### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader optimization
- [ ] Keyboard navigation
- [ ] High contrast mode

#### Internationalization
- [ ] Multi-language support (i18n)
- [ ] RTL language support
- [ ] Currency localization
- [ ] Date/time formatting

---

## Appendix

### A. Technology References

#### Next.js
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

#### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

#### Web Crypto API
- [MDN Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [SubtleCrypto Interface](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)

### B. Security Considerations

#### OWASP Top 10 Compliance
- [X] A01: Broken Access Control → RLS policies
- [X] A02: Cryptographic Failures → E2E encryption
- [X] A03: Injection → Parameterized queries
- [X] A04: Insecure Design → Zero-trust architecture
- [X] A05: Security Misconfiguration → Environment validation
- [X] A06: Vulnerable Components → Regular updates
- [X] A07: Authentication Failures → Supabase Auth
- [X] A08: Data Integrity Failures → Content validation
- [X] A09: Logging Failures → Comprehensive logging
- [X] A10: SSRF → Input sanitization

### C. Performance Benchmarks

#### Lighthouse Scores (Target)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

#### Core Web Vitals
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

### D. Glossary

- **E2E Encryption:** End-to-end encryption where only sender and recipient can decrypt
- **RSA-OAEP:** Asymmetric encryption algorithm for key exchange
- **AES-GCM:** Symmetric encryption algorithm for content encryption
- **RLS:** Row Level Security, database-level access control
- **JWT:** JSON Web Token, used for authentication
- **SSR:** Server-Side Rendering
- **CSR:** Client-Side Rendering
- **ISR:** Incremental Static Regeneration

---

## Change Log

**Version 1.0 (Initial)** - December 2024
- Core platform launch
- Authentication system
- Link management
- Friend connections
- Basic encryption
- AI theme generation

---

**Document Version:** 1.0  
**Last Updated:** December 17, 2024  
**Author:** OneLink Development Team  
**Status:** Living Document

---

*This blueprint serves as the source of truth for the OneLink application architecture, features, and implementation details. All development should reference this document to ensure consistency and alignment with the product vision.*
