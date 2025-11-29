# hacksheffield10

Basic Flask backend with a Vite + React frontend.

## Backend (Flask)
1. Create/activate a virtualenv (if you don't already have one): `python -m venv .venv && source .venv/bin/activate`
2. Install deps: `pip install -r requirements.txt`

## Frontend (Vite + React)
1. Install deps: `cd frontend && npm install`

## One-command dev
- From repo root: `./run.sh`
  - Starts Flask (uses `.venv` if present) and Vite dev server. Ctrl+C stops both.
