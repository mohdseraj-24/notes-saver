# 📝 Notes Saver | NoteFlow

A full-stack *Notes Application* with secure user authentication and a clean, responsive notes workspace. Every user gets their own private notes — fully isolated from other users.

![Notes App Preview](https://via.placeholder.com/800x450/4f46e5/ffffff?text=Notes+Saver+Screenshot)  
(Replace with an actual screenshot of the app after deployment)

## ✨ Features

- User registration and login
- Secure password hashing with *bcrypt*
- *JWT* authentication with protected routes
- Each user can only see, create, edit, or delete *their own notes*
- Search notes functionality
- Responsive, modern card-based UI
- Loading, empty, error, and success states
- Production-ready deployment configurations

## 🛠️ Tech Stack

### Frontend
- *React* + *Vite*
- React Router & Context API (for auth & notes state)
- Responsive design
- Oxlint

### Backend
- *Node.js* + *Express.js*
- *MongoDB Atlas* + *Mongoose*
- *JWT* + *bcryptjs*
- Environment configuration with dotenv

### Deployment
- *Frontend*: Vercel (vercel.json)
- *Backend*: Render (render.yaml)

## 📁 Project Structure

```bash
notes-saver/
├── Backend/
│   ├── models/           # User & Note Mongoose schemas
│   ├── routes/           # auth.routes.js & notes.routes.js
│   ├── middleware/       # auth protection middleware
│   ├── server.js         # Main Express server
│   ├── package.json
│   ├── render.yaml
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/   # NoteCard, Auth forms, etc.
│   │   ├── pages/
│   │   └── context/      # AuthContext, NotesContext
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── README.md
│
├── package-lock.json
└── README.md