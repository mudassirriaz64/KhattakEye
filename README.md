# Khattak Eyewear — E-Commerce Platform (MERN)

Online eyewear store: browse, virtually try on, and purchase eyeglasses/sunglasses. Built as two independent apps — see `Architecture.md` and `FolderStructure.md` for the full system design.

- **`frontend/`** — React + Vite + TypeScript SPA (existing, complete storefront + admin UI)
- **`backend/`** — Node.js + Express + MongoDB API (in progress)

## Project Docs
Before touching any code, read these in order — they are the binding spec, not background reading:

1. `Agent.md` — operating rules for AI-assisted development on this repo
2. `Architecture.md` — system decisions, phased build plan
3. `ERP.md` — database schemas (single source of truth for data shapes)
4. `FolderStructure.md` — exact file/folder placement
5. `Rules.md` — security, data integrity, and workflow rules
6. `Skills.md` — approved tech stack and packages
7. `Design.md` — visual tokens, typography, motion (frontend)

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` by default (Vite).

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:5000` by default (see `backend/.env.example` for required variables — MongoDB URI, JWT secret, Cloudinary keys, CORS origin).

Both apps must be running simultaneously for the storefront to work end-to-end against real data. Frontend `.env` needs `VITE_API_BASE_URL` pointing at the backend.

## Deployment
- Frontend → **Vercel** (SPA build)
- Backend → **Render** (Node.js/Express service)
- Two separate domains — see Architecture.md §1/Phase 7 for the CORS and env var implications of this split (reverted from the earlier Vercel Services single-project setup, which wasn't working reliably in practice).
- Database → MongoDB Atlas
- Media → Cloudinary

See `Architecture.md` §3 (Phase 6) for deployment details.