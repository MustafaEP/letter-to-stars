#!/usr/bin/env bash
set -euo pipefail

echo "Letter to Stars | Full Deploy Started"

# ---- Config ----
PROJECT_ROOT="${PROJECT_ROOT:-/opt/letter-to-stars}"
COMPOSE_DIR="${COMPOSE_DIR:-$PROJECT_ROOT/infra/compose/prod}"
PROXY_CONTAINER="${PROXY_CONTAINER:-reverse-proxy}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-letter-to-stars}"

# Health check URL (public)
BASE_URL="${BASE_URL:-https://lettertostars.mustafaerhanportakal.com}"

# Optional: API health path (adjust if you have /api/health)
API_HEALTH_PATH="${API_HEALTH_PATH:-/api/health}"
AI_HEALTH_PATH="${AI_HEALTH_PATH:-/ai/health}"

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

  echo "Pulling latest code (hard reset to origin/main)..."
  cd "$PROJECT_ROOT"
  git fetch origin main
  git reset --hard origin/main

  echo "Building & starting ALL services..."
  cd "$COMPOSE_DIR"

  docker compose -p "$COMPOSE_PROJECT_NAME" \
    -f frontend.compose.yml \
    -f backend.compose.yml \
    -f ai.compose.yml \
    -f webhook.compose.yml \
    up -d --build

  echo "Reloading reverse-proxy nginx..."
  docker exec -i "$PROXY_CONTAINER" nginx -s reload

  echo "Running health checks..."
  curl -fsS "$BASE_URL/" >/dev/null || (echo "Frontend health failed" && exit 1)

  # Eğer bu endpointler henüz yoksa yoruma alabilirsin
  curl -fsS "$BASE_URL$API_HEALTH_PATH" >/dev/null || echo "WARN: API health endpoint not reachable: $BASE_URL$API_HEALTH_PATH"
  curl -fsS "$BASE_URL$AI_HEALTH_PATH" >/dev/null || echo "WARN: AI health endpoint not reachable: $BASE_URL$AI_HEALTH_PATH"

  echo "Full deploy completed successfully"
  echo "== Deploy finished: $(date -Is) =="
} |& tee -a "$LOG_FILE"
