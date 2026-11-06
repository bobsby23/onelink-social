# OneLink Blueprint

## Project Overview

OneLink is a privacy-first link-in-bio platform with end-to-end encryption (E2EE), allowing users to share links with customizable visibility levels (public, private, friends-only). Built with Next.js, Supabase, and client-side encryption.

## Core Features

### 1. Profile Management
- Secure authentication via Supabase Auth (email/password)
- Profile creation with nickname, display name, bio
- Profile photo and cover image uploads via Vercel Blob
- QR code generation for profile sharing
- Public profile URLs: `/u/{nickname}`

### 2. OneLink Management
- Add, edit, delete, and reorder link blocks
- Multiple link types: URL, email, phone, social media
- Beautiful pre-made link templates with platform-specific icons
- Visibility controls: public, private, friends-only
- Click tracking for analytics
- Active/inactive toggle for each link

### 3. Friend System
- Send and receive friend requests
- Accept/reject friend requests
- View all friends
- Search for users by nickname or display name
- Friends can view friends-only content

### 4. End-to-End Encryption (E2EE)
- RSA-OAEP key pair generation (client-side)
- Private keys stored in browser localStorage
- Public keys stored in Supabase
- AES-GCM encryption for private and friends-only content
- Zero-knowledge architecture

### 5. Real-time Chat
- Message friends in real-time
- Supabase subscriptions for live updates
- Message history
- Friend selection interface

### 6. Dark/Light Theme
- System theme detection
- Manual theme toggle
- Smooth transitions between themes
- Persistent theme preference

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks + SWR for caching

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Vercel Blob
- **API**: Next.js Route Handlers

### Security
- **Encryption**: Web Crypto API (RSA-OAEP, AES-GCM)
- **RLS**: Row Level Security policies on all tables
- **Session Management**: HTTP-only cookies via middleware

## Database Schema

### Tables

#### users
- `id` (UUID, FK to auth.users)
- `email` (TEXT, unique)
- `nickname` (TEXT, unique)
- `display_name` (TEXT)
- `bio` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `cover_photo` (TEXT, nullable)
- `public_key` (TEXT) - RSA public key for E2EE
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### link_blocks
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `title` (TEXT)
- `url` (TEXT, nullable)
- `type` (TEXT) - url, email, phone, social
- `visibility` (TEXT) - public, private, friends
- `encrypted_content` (TEXT, nullable) - for private/friends-only
- `is_active` (BOOLEAN)
- `position` (INTEGER)
- `click_count` (INTEGER)
- `template` (TEXT, nullable) - link template name
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### connections
- `id` (UUID, PK)
- `requester_id` (UUID, FK to users)
- `receiver_id` (UUID, FK to users)
- `status` (TEXT) - pending, accepted, rejected
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### messages
- `id` (UUID, PK)
- `sender_id` (UUID, FK to users)
- `receiver_id` (UUID, FK to users)
- `content` (TEXT)
- `read` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

### Row Level Security (RLS) Policies

All tables have RLS enabled with policies ensuring:
- Users can only read/write their own data
- Public profiles are viewable by everyone
- Friends can view friends-only content
- Private content is only accessible by the owner

## File Structure

```
onelink/
├── app/
│   ├── api/
│   │   └── upload-photo/         # Blob upload endpoint
│   ├── auth/
│   │   ├── login/                # Login page
│   │   ├── sign-up/              # Sign-up page
│   │   ├── sign-up-success/      # Email confirmation page
│   │   └── error/                # Auth error page
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── links/                # OneLink management
│   │   ├── connections/          # Friend management
│   │   ├── chat/                 # Real-time chat
│   │   └── profile/              # Profile editing
│   ├── u/[nickname]/             # Public profile pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── dashboard/                # Dashboard components
│   ├── links/                    # Link management components
│   ├── connections/              # Friend system components
│   ├── chat/                     # Chat interface
│   ├── public/                   # Public profile components
│   ├── theme-provider.tsx        # Theme context provider
│   ├── theme-toggle.tsx          # Theme switcher
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── proxy.ts              # Middleware helper
│   ├── crypto.ts                 # E2EE utilities
│   ├── social-icons.ts           # Social media icons
│   ├── link-templates.ts         # Link block templates
│   └── types/
│       └── database.ts           # TypeScript types
├── scripts/                      # SQL migration scripts
├── proxy.ts                      # Next.js middleware
└── package.json
```

## API Endpoints

### POST /api/upload-photo
Upload profile or cover photo to Vercel Blob
- **Body**: FormData with `file` and `type` (avatar/cover)
- **Returns**: `{ url: string }`

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Key Implementation Details

### E2EE Flow
1. User generates RSA key pair on signup
2. Private key stored in localStorage
3. Public key uploaded to Supabase
4. Private/friends-only content encrypted with AES-GCM
5. AES key encrypted with recipient's RSA public key
6. Decryption happens client-side only

### Friend System Flow
1. User A searches for User B by nickname
2. User A sends friend request
3. User B receives pending request
4. User B accepts/rejects request
5. If accepted, both can view each other's friends-only content

### Visibility Control
- **Public**: Visible to everyone
- **Private**: Only owner can see (encrypted)
- **Friends**: Only accepted friends can see (encrypted)

## Security Features

1. **Row Level Security**: Database-level access control
2. **Client-side Encryption**: Private keys never leave browser
3. **HTTP-only Cookies**: Secure session management
4. **CORS Protection**: API endpoints protected
5. **Input Validation**: All user inputs sanitized

## Deployment

### Prerequisites
1. Vercel account
2. Supabase project
3. GitHub repository

### Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Post-Deployment
1. Run SQL scripts in Supabase SQL editor
2. Test authentication flow
3. Verify RLS policies
4. Test E2EE functionality

## Future Enhancements

1. **Analytics Dashboard**: Detailed link click analytics
2. **Custom Domains**: Allow users to use custom domains
3. **Monetization**: Premium features and subscriptions
4. **Mobile App**: React Native mobile application
5. **Link Scheduling**: Schedule links to activate/deactivate
6. **Bulk Operations**: Import/export links
7. **Webhooks**: Notify external services of events
8. **A/B Testing**: Test different link arrangements

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write semantic HTML
- Mobile-first responsive design

### Testing
- Test all RLS policies
- Verify E2EE encryption/decryption
- Test friend request flow
- Test link visibility controls
- Test file uploads

### Performance
- Use React Server Components where possible
- Implement proper loading states
- Optimize images with Next.js Image
- Use SWR for client-side data fetching
- Minimize client-side JavaScript

## Support

For issues or questions:
1. Check documentation
2. Review error logs
3. Test in incognito mode
4. Verify environment variables
5. Check Supabase logs
