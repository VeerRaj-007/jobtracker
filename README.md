# JobTracker

A full-stack job and internship application tracker with a Kanban board. Built because spreadsheets are terrible for tracking applications — drag cards between stages, add notes, set deadlines, and see your stats at a glance.

**Live Demo:** https://jobtracker-weld.vercel.app/

---

## Features

- **Kanban board** : Five columns: Wishlist, Applied, Interview, Offered, Rejected. Drag and drop cards between stages.
- **Application cards** : Each card shows company, role, location, salary, applied date, and deadline with a color-coded status indicator.
- **Add / Edit / Delete** : Full CRUD via a clean modal. Edit any field, delete applications you no longer need.
- **Stats dashboard** : Live counters for total applications, interviews, offers, and interview rate percentage.
- **Deadline tracking** : Deadlines highlighted in red when within 3 days.
- **JWT Authentication** : Register and log in. Every user sees only their own applications.
- **Persistent storage** : All data saved to PostgreSQL. Nothing lost on refresh.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 + TypeScript | Framework and routing |
| @dnd-kit/core | Drag and drop between Kanban columns |
| Tailwind CSS v4 | Styling |
| React Context | Auth state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM v7 | Database access layer |
| PostgreSQL (Supabase) | Persistent storage |
| bcryptjs | Password hashing |
| JSON Web Tokens | Stateless authentication |

---

## Architecture

```
┌─────────────────────────────┐
│      Next.js Frontend        │
│  Kanban Board + Auth Pages   │
└──────────────┬──────────────┘
               │ HTTP REST
┌──────────────▼──────────────┐
│    Node.js / Express API     │
│  Auth routes + Jobs routes   │
└──────────────┬──────────────┘
               │
        ┌──────▼──────┐
        │  PostgreSQL  │
        │  (Supabase)  │
        └─────────────┘
```

### API Routes

```
POST   /auth/register         Register new user
POST   /auth/login            Login, returns JWT
GET    /auth/me               Verify token, return user

GET    /jobs                  Get all jobs for user
POST   /jobs                  Create new job
PATCH  /jobs/:id              Update job (status, fields)
DELETE /jobs/:id              Delete job
GET    /jobs/stats/summary    Get dashboard stats
```

### How Drag and Drop Works

```
User drags card from "Applied" to "Interview"
        ↓
@dnd-kit fires DragEndEvent with source and target
        ↓
Frontend optimistically updates UI immediately
(card moves instantly — no waiting for server)
        ↓
PATCH /jobs/:id sent to backend with new status
        ↓
If request fails → UI reverts to original status
        ↓
If request succeeds → stats refetch in background
```

Optimistic updates make the UI feel instant even on slow connections.

### Auth Flow

```
User registers → password hashed with bcrypt (10 rounds)
             → user created in PostgreSQL
             → JWT signed with 7 day expiry
             → token stored in localStorage

Subsequent requests → JWT sent in Authorization header
                   → middleware verifies signature
                   → userId extracted, attached to request
                   → queries scoped to that userId only
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/VeerRaj-007/jobtracker.git
cd jobtracker
```

### 2. Start the database

```bash
docker run --name jobtracker-db \
  -e POSTGRES_USER=jobtracker \
  -e POSTGRES_PASSWORD=jobtracker123 \
  -e POSTGRES_DB=jobtracker \
  -p 5432:5432 \
  -d postgres
```

### 3. Setup backend

```bash
cd backend
npm install
```

Create `.env`:
```
PORT=5001
DATABASE_URL="postgresql://jobtracker:jobtracker123@localhost:5432/jobtracker"
DIRECT_URL="postgresql://jobtracker:jobtracker123@localhost:5432/jobtracker"
JWT_SECRET="your_secret_key"
```

Run migrations and start:
```bash
npx prisma migrate dev
npm run dev
```

### 4. Setup frontend

```bash
cd frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

Start:
```bash
npm run dev
```

### 5. Open the app

Go to `http://localhost:3000`, register an account, and start tracking applications.

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  jobs      Job[]
}

model Job {
  id          String    @id @default(cuid())
  company     String
  role        String
  status      Status    @default(APPLIED)
  appliedDate DateTime  @default(now())
  deadline    DateTime?
  notes       String?
  link        String?
  salary      String?
  location    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}

enum Status {
  WISHLIST
  APPLIED
  INTERVIEW
  OFFERED
  REJECTED
}
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase PostgreSQL |

---

## Project Structure

```
jobtracker/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── dashboard/page.tsx     # Kanban board + stats
│       │   ├── login/page.tsx
│       │   ├── register/page.tsx
│       │   └── page.tsx               # Redirect to dashboard/login
│       ├── components/
│       │   ├── KanbanColumn.tsx       # Droppable column + sortable cards
│       │   ├── JobCard.tsx            # Individual application card
│       │   ├── JobModal.tsx           # Add/Edit modal
│       │   └── StatsBar.tsx           # Dashboard stats
│       ├── context/
│       │   └── AuthContext.tsx        # JWT auth state
│       └── lib/
│           ├── api.ts                 # Fetch wrapper with auth header
│           └── types.ts               # Shared TypeScript types
└── backend/
    ├── src/
    │   ├── index.ts                   # Express server
    │   ├── prisma.ts                  # Prisma client
    │   ├── routes/
    │   │   ├── auth.ts               # Register / login / me
    │   │   └── jobs.ts               # CRUD + stats
    │   └── middleware/
    │       └── auth.ts               # JWT verification
    └── prisma/
        └── schema.prisma
```

---

## Key Engineering Decisions

**Why optimistic updates on drag and drop?**
Waiting for the server before moving the card creates a noticeable lag that breaks the drag and drop feel. Optimistic updates move the card immediately and revert only on failure — which is rare. This matches how production tools like Linear and Trello handle it.

**Why JWT over sessions?**
JWTs are stateless — the server doesn't need to store session data. This makes the backend horizontally scalable and simpler to deploy. The tradeoff is tokens can't be invalidated before expiry, which is acceptable for a portfolio project.

**Why separate frontend and backend instead of Next.js API routes?**
Keeping concerns separate makes each piece independently deployable and scalable. It also mirrors real-world team structures where frontend and backend are separate services.

---

## Author

Veer Raj — [GitHub](https://github.com/VeerRaj-007)
