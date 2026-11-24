# AI Interview Prep — Full-stack starter

This project combines the Phase 1 React frontend with the Flask + SQLite authentication backend.

## Stack
- React 18, Vite, React Router, Recharts, Lucide
- Python Flask
- SQLite
- Werkzeug password hashing and Flask signed session cookies

## Requirements
- Node.js 18+
- Python 3.10+

## Run on Windows / VS Code

### 1. Backend (Terminal 1)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```
If PowerShell activation is blocked:
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```
Backend health check: http://127.0.0.1:5000/api/health

### 2. Frontend (Terminal 2 — project root)
```powershell
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Current integration
- React landing, login and registration screens
- Real Flask registration and login
- Password hashes stored in SQLite (not plaintext)
- Server-side session cookie; frontend sends credentials through Vite proxy
- User and answer tables created automatically
- Backend question and answer endpoints available

## Important implementation status
The Phase 1 interview workflow, question bank, dashboard charts and feedback currently still use the frontend prototype's mock service (`frontend/src/services/mockApi.js`). Authentication is connected to Flask/SQLite, but full persistence of interview sessions, dashboard statistics, AI evaluation, and server-side profile editing are not yet integrated. The existing backend answer endpoints persist individual answers. AI evaluation requires a separately configured AI provider and API key; no key is included.

Do not commit `.env`, database files, or secrets. Set a strong `SECRET_KEY` before deployment.
