#!/usr/bin/env bash
set -euo pipefail

echo "Letter to Stars | Frontend Deploy Started"

# ---- Config ----
PROJECT_ROOT="${PROJECT_ROOT:-/opt/letter-to-stars}"
COMPOSE_DIR="${COMPOSE_DIR:-$PROJECT_ROOT/infra/compose/prod}"
PROXY_CONTAINER="${PROXY_CONTAINER:-reverse-proxy}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-letter-to-stars}"

# Health check URL (public)
BASE_URL="${BASE_URL:-https://lettertostars.mustafaerhanportakal.com}"

# ---- Logging ----
LOG_DIR="$PROJECT_ROOT/logs"
TS="$(date '+%Y%m%d-%H%M%S')"
LOG_FILE="$LOG_DIR/deploy-$TS.log"
mkdir -p "$LOG_DIR"

# ---- Lock ----
LOCK_FILE="/tmp/${COMPOSE_PROJECT_NAME}.deploy.lock"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another deploy is running. Exiting."
  exit 1
fi

# ---- Run + Tee to log ----
{
  echo "== Deploy started: $(date -Is) =="
  echo "PROJECT_ROOT=$PROJECT_ROOT"
  echo "COMPOSE_DIR=$COMPOSE_DIR"
  echo "PROXY_CONTAINER=$PROXY_CONTAINER"
  echo "COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME"
  echo "BASE_URL=$BASE_URL"
  echo "-----------------------------------"

  echo "Pulling latest code..."
  cd "$PROJECT_ROOT"
  git pull

  echo "Building & starting frontend container..."
  cd "$COMPOSE_DIR"
  docker compose -p "$COMPOSE_PROJECT_NAME" -f frontend.compose.yml up -d --build

  echo "Reloading reverse-proxy nginx..."
  docker exec -i "$PROXY_CONTAINER" nginx -s reload

  echo "Running health checks..."
  curl -fsS "$BASE_URL/" >/dev/null

  echo "Frontend deploy completed successfully"
  echo "== Deploy finished: $(date -Is) =="
} |& tee -a "$LOG_FILE"
