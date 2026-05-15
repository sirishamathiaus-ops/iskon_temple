# ISKCON Temple — full stack

React (Vite) + Tailwind frontend, FastAPI + PostgreSQL backend, Razorpay for donations, JWT admin auth.

**ISKCON Dornala:** Site copy, address, bank, and WhatsApp are in `frontend/src/content/temple.ts`. Set `VITE_UPI_ID` in `frontend/.env` for the public UPI line. Gallery JPEGs/PNGs live in `frontend/public/gallery/` (`01.png`–`45.png`); run `scripts/seed.py` to load them into the DB (use `SEED_REFRESH_GALLERY=1` to replace an old gallery).

## Quick start

### 1. Database

First-time setup or if you see **role "iskcon" does not exist** (stale volume or wrong port):

```bash
./scripts/setup-db.sh
```

Or manually:

```bash
./scripts/reset-db.sh   # docker compose down -v && up (creates user iskcon)
cd backend && cp .env.example .env   # DATABASE_URL uses port 5433
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: SECRET_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, seed demo content and the first admin user (override with `ADMIN_USERNAME` / `ADMIN_PASSWORD`):

```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. python scripts/seed.py
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` and `/static` to the backend.

**Admin (not linked in the public nav):** `http://localhost:5173/admin/login` — use credentials from `scripts/seed.py` defaults unless you overrode env vars.

### Production notes

- Set `VITE_API_URL` when the frontend is served separately (e.g. `https://api.yourtemple.org`).
- Use a strong `SECRET_KEY` and HTTPS everywhere.
- Configure Razorpay webhooks for payment reconciliation (extend `POST /api/donations/webhook` as needed).
- Replace placeholder contact address and Google Maps embed in the Contact page.
- For true **monthly** auto-debit, enable Razorpay Subscriptions or UPI Autopay in the dashboard and extend the backend to create subscription links instead of one-off Orders where appropriate.

## API overview

| Area | Path |
|------|------|
| Health | `GET /api/health` |
| Admin login | `POST /api/auth/login` (OAuth2 password form) |
| Public content | `GET /api/public/*` |
| Donations | `POST /api/donations/create-order`, `POST /api/donations/verify` |
| Admin | `GET/PATCH/POST/DELETE /api/admin/*` (Bearer token) |

## Project layout

- `backend/app` — FastAPI app, SQLAlchemy models, routers
- `frontend/src` — Pages, admin dashboard, API client
