# Employee Management System

A full-stack MERN employee management system for the SyntechHub internship Project 3.

## Features
- Add, edit, delete and list employees
- Fields: name, email, role, department, salary
- Form validation
- Search employees
- Responsive React UI
- Node.js + Express REST API
- MongoDB with Mongoose

## Run locally
### Backend
```bash
cd backend
npm install
cp .env.example .env
# Put your MongoDB Atlas connection string in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite and uses `VITE_API_URL` for the backend URL.

## Deployment
Deploy `backend` to Render/Railway and `frontend` to Vercel/Netlify. Set the environment variables shown in the example files.
