#!/usr/bin/env bash
# Reset Docker Postgres, wait, create tables, seed data.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

bash "$ROOT/scripts/reset-db.sh"

cd "$ROOT/backend"
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created backend/.env from .env.example"
fi

if [[ -f .venv/bin/activate ]]; then
  # shellcheck disable=SC1091
  source .venv/bin/activate
fi

PYTHONPATH=. python3 scripts/seed.py
echo "Setup complete."
