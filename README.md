# hacksheffield10

Basic Flask backend with a Vite + React frontend.

## Backend (Flask)
1. Create/activate a virtualenv (if you don't already have one): `python -m venv .venv && source .venv/bin/activate`
2. Install deps: `pip install -r requirements.txt`
3. Run API: `cd backend && python -m flask --app wsgi --debug run --host 0.0.0.0 --port 5000`

Backend layout (app factory + blueprints):
```
backend/
  app/
    __init__.py        # create_app, register blueprints
    config.py          # Dev/Prod configs
    routes/
      core.py          # health check, misc
      products.py      # product APIs (mock data)
      dashboard.py     # dashboard summary metrics
  wsgi.py              # entrypoint for flask run / WSGI servers
  app.py               # wrapper for create_app (for direct python app.py)
```

## Frontend (Vite + React)
1. Install deps: `cd frontend && npm install`

## One-command dev
- From repo root: `./run.sh`
  - Starts Flask (uses `.venv` if present) and Vite dev server. Ctrl+C stops both.

# Additional Links
[Planning GDoc](https://docs.google.com/document/d/1MT4SdZLEC-bVpvp3wWrfG7ge-RsYMCVKf6VB3071ums/edit?tab=t.0)
[DevPost](https://devpost.com/software/trendswipe?ref_content=my-projects-tab&ref_feature=my_projects)