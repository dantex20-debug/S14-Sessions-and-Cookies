# Cloud Trading Robot Platform (South Africa)

## Features
- Vite + React + Tailwind frontend
- FastAPI backend with JWT authentication
- Dockerized for local development
- GitHub Actions CI

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (for containerized dev)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn[standard] python-jose[cryptography] passlib[bcrypt]
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Full Stack (Docker Compose)
```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints
- `POST /api/register` — Register new user
- `POST /api/token` — Login, returns JWT
- `GET /api/users/me` — Get current user (JWT required)
- `GET /api/protected` — Example protected route

## CI/CD
- GitHub Actions: `.github/workflows/ci.yml` runs lint/build on push/PR

## Next Steps
- Add real database (PostgreSQL, etc.)
- Add broker integrations, ML, dashboards, etc.

---
MIT License