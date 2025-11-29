#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    echo "Stopping Flask backend (pid ${BACKEND_PID})..."
    kill "${BACKEND_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "Starting Flask backend..."
(
  cd "${ROOT_DIR}/backend"
  if [[ -d "${ROOT_DIR}/.venv" ]]; then
    # Use local venv if present.
    source "${ROOT_DIR}/.venv/bin/activate"
  fi
  python -m flask --app app --debug run --host 0.0.0.0 --port 5000
) &
BACKEND_PID=$!

echo "Starting Vite dev server..."
cd "${ROOT_DIR}/frontend"
npm install
npm run dev -- --host 0.0.0.0
