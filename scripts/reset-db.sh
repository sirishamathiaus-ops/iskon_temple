#!/usr/bin/env bash
# Recreate PostgreSQL with user iskcon (fixes "role iskcon does not exist" from stale volumes).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Stopping database and removing old volume..."
docker compose down -v

echo "Starting PostgreSQL..."
docker compose up -d db

echo "Waiting for database..."
for i in $(seq 1 40); do
  if docker compose exec -T db pg_isready -U iskcon -d iskcon_temple >/dev/null 2>&1; then
    echo "Database is ready."
    exit 0
  fi
  sleep 1
done

echo "Database did not become ready in time." >&2
exit 1
