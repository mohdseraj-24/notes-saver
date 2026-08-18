# Notes App Frontend

React frontend for the Notes App. It connects to the Express API at `http://localhost:5000/api/notes`.

## Features

- Create new notes
- Edit existing notes
- Delete notes
- Responsive card layout
- Loading, success, empty, and error states

## Tech Stack

- React
- Vite
- Oxlint

## Setup

```bash
cd "C:\Users\mohda\OneDrive\Desktop\notes app\notes-app"
npm install
```

## Run

Start the backend first:

```bash
cd "C:\Users\mohda\OneDrive\Desktop\notes app"
npm run dev
```

Then start the frontend:

```bash
cd "C:\Users\mohda\OneDrive\Desktop\notes app\notes-app"
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

If port `5173` is busy, Vite may use another port such as `5174`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Dependency

The frontend expects these API routes:

```http
GET /api/notes
POST /api/notes
PATCH /api/notes/:id
DELETE /api/notes/:id
```

If the UI shows a backend or database error, check:

```txt
http://localhost:5000/api/health
```
