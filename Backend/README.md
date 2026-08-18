# NoteFlow Notes App

Your original Notes App has been upgraded with a complete authentication flow and a premium notes workspace.

## Included
- React + Vite frontend
- Node + Express backend
- MongoDB Atlas
- Signup + login
- Password hashing with bcrypt
- JWT authentication
- Protected, user-specific notes
- Create / edit / delete notes
- Search notes
- Responsive premium UI
- Existing project structure preserved

## Run backend

```bash
npm install
```

Copy `.env.example` to `.env` and add your MongoDB Atlas URI and a strong JWT secret.

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## Run frontend

Open a second terminal:

```bash
cd notes-app
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Flow

1. Open `http://localhost:5173`
2. New user → **Create an account**
3. Existing user → **Sign in**
4. After successful authentication → private **Notes workspace**
5. Each user only sees their own notes
6. Logout returns to the login page

## MongoDB Atlas

Make sure the Atlas database user exists and your current IP/network is allowed under Atlas Network Access.

Never commit `.env` to GitHub.
