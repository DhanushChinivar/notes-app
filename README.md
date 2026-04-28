# 📝 NotesAI – Notes App with AI Summarisation

A full-stack notes application with AI-powered summarisation built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features
- ✅ Create, edit, and delete notes
- ✅ View all saved notes in a responsive grid
- ✅ AI summarisation via Claude API (with mock fallback)
- ✅ User authentication (Signup / Login) with JWT
- ✅ Search notes by title or content
- ✅ Redux Toolkit for state management

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Redux Toolkit, React Router |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | Anthropic Claude API |

## Project Structure
```
notes-app/
├── backend/
│   └── src/
│       ├── models/       # User, Note schemas
│       ├── routes/       # auth.js, notes.js
│       ├── middleware/   # JWT auth guard
│       └── index.js      # Express entry point
└── frontend/
    └── src/
        ├── api/          # Fetch wrappers
        ├── store/        # Redux slices
        └── components/
            ├── Auth/     # Login / Signup
            └── Notes/    # NoteList, NoteCard, NoteEditor
```

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/notes-app.git
cd notes-app
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and keys
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables (backend/.env)
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-key
ANTHROPIC_API_KEY=your-api-key   # optional – falls back to mock
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login + get token |
| GET | /api/notes | Get all notes (auth) |
| POST | /api/notes | Create note (auth) |
| PUT | /api/notes/:id | Update note (auth) |
| DELETE | /api/notes/:id | Delete note (auth) |
| POST | /api/notes/:id/summarize | AI summarise (auth) |
