# Full-Stack Connection Guide

This guide explains how to connect the frontend (Next.js), backend (Express), and database (Supabase/PostgreSQL) for the AI System Design Platform.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js       │────▶│   Supabase      │◀────│   Express       │
│   Frontend      │     │   Database      │     │   Backend       │
│   (Port 3000)   │     │   (Cloud/Local) │     │   (Port 5000)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        └───────────────────────────────────────────────┘
                    API Proxy (Optional)
```

## Quick Start

### 1. Set Up Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key from Project Settings > API

### 2. Configure Frontend (.env.local)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Frontend

```bash
npm install
npm run dev
```

### 4. (Optional) Run Express Backend

If you want to use the Express backend for additional functionality:

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

## API Routes

### Frontend API Routes (Next.js)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | * | NextAuth authentication |
| `/api/auth/signup` | POST | User registration |
| `/api/user/profile` | GET/POST | User profile CRUD |
| `/api/user/progress` | GET/POST | User progress tracking |
| `/api/diagrams` | GET/POST | List/create diagrams |
| `/api/diagrams/[id]` | GET/PUT/DELETE | Diagram CRUD |
| `/api/submissions` | GET/POST | List/create submissions |
| `/api/submissions/[id]` | GET/PUT/DELETE | Submission CRUD |
| `/api/leaderboard` | GET | Leaderboard data |
| `/api/health` | GET | Health check |

### Backend API Routes (Express)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/me` | GET | Get current user |
| `/api/users` | GET | List users |
| `/api/users/:id` | GET/PUT/DELETE | User CRUD |
| `/api/problems` | GET/POST | List/create problems |
| `/api/problems/:id` | GET/PUT/DELETE | Problem CRUD |
| `/api/submissions` | GET/POST | List/create submissions |
| `/api/diagrams` | GET/POST | List/create diagrams |
| `/api/leaderboard` | GET | Leaderboard data |
| `/health` | GET | Health check |

## Using the API Service

The frontend includes a comprehensive API service (`src/lib/api.ts`) for communicating with the backend:

```typescript
import { authApi, diagramsApi, submissionsApi } from '@/lib/api';

// Authentication
await authApi.login({ email, password });
await authApi.register({ username, email, password });
authApi.logout();

// Diagrams
const diagrams = await diagramsApi.getAll();
await diagramsApi.create({ name, diagram_data, problem_id });
await diagramsApi.update(id, { diagram_data });
await diagramsApi.delete(id);

// Submissions
const submissions = await submissionsApi.getAll();
await submissionsApi.create({ problem_id, solution, score });
```

## React Hooks

Custom hooks are available for easy data management:

```typescript
import { useDiagrams } from '@/lib/hooks/useDiagrams';
import { useSubmissions } from '@/lib/hooks/useSubmissions';
import { useBackendAuth } from '@/lib/hooks/useBackendAuth';

// Using diagrams hook
const { diagrams, saveDiagram, updateDiagram, loading, error } = useDiagrams();

// Using submissions hook  
const { submissions, createSubmission, loading } = useSubmissions();

// Using backend auth hook (works alongside NextAuth)
const { user, login, register, logout, isAuthenticated } = useBackendAuth();
```

## Database Schema

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password (nullable for OAuth)
- `full_name` - User's full name
- `role` - User's role/title
- `bio` - User biography
- Profile URLs (GitHub, Twitter, LinkedIn, Website)
- OAuth IDs (Google, GitHub)

### User Progress Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `question_id` - Problem identifier
- `solved_at` - Timestamp when solved

### Diagrams Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `name` - Diagram name
- `problem_id` - Associated problem ID
- `diagram_data` - JSONB storing nodes and edges

### Submissions Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `problem_id` - Problem identifier
- `solution` - Text solution
- `score` - Score (0-100)
- `diagram_data` - Optional JSONB diagram

## Authentication Flow

### NextAuth (Primary)
1. User signs in with Google/GitHub/Credentials
2. Session stored in JWT
3. User data synced to Supabase users table

### Backend JWT (Secondary)
1. User registers/logs in via Express API
2. JWT token stored in localStorage
3. Token sent in Authorization header for API calls

## Proxy Configuration

The Next.js app can proxy requests to the Express backend:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/backend-api/:path*',
      destination: 'http://localhost:5000/api/:path*',
    },
  ];
}
```

## Troubleshooting

### Supabase Connection Issues
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check anon key permissions in Supabase dashboard
- Ensure RLS policies allow your operations

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check OAuth credentials in provider dashboards
- Ensure callback URLs are configured correctly

### Database Issues
- Run the schema.sql in Supabase SQL Editor
- Check RLS policies are not blocking operations
- Verify foreign key relationships

## Development Tips

1. **Use the health endpoint** to verify connections:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check Supabase logs** in the dashboard for database errors

3. **Use browser DevTools** to inspect API requests/responses

4. **Enable debug mode** in NextAuth:
   ```env
   NEXTAUTH_DEBUG=true
   ```
