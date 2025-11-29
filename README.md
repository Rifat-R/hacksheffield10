# hacksheffield10

Basic Flask backend with a Vite + React frontend.

## Backend (Flask)
1. Create/activate a virtualenv (if you don't already have one): `python -m venv .venv && source .venv/bin/activate`
2. Install deps: `pip install -r backend/requirements.txt`
3. Run the API: `cd backend && python -m flask --app app run --debug`
   - Serves on `http://localhost:5000` with `/api/hello`.

## Frontend (Vite + React)
1. Install deps: `cd frontend && npm install`
2. Start dev server: `npm run dev` (default at `http://localhost:5173`)
   - Vite proxies `/api` to `http://localhost:5000` (see `frontend/vite.config.js`).

## One-command dev
- From repo root: `./run.sh`
  - Starts Flask (uses `.venv` if present) and Vite dev server. Ctrl+C stops both.

## Notes
- Frontend displays the response from `/api/hello` when the Flask server is running.
- Adjust ports or proxy targets in `frontend/vite.config.js` if needed.
