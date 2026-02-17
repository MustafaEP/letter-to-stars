#!/usr/bin/env bash
set -euo pipefail

echo "Letter to Stars | Deploy Started"

# ---- Config ----
PROJECT_ROOT="${PROJECT_ROOT:-/opt/letter-to-stars}"
COMPOSE_DIR="${COMPOSE_DIR:-$PROJECT_ROOT/infra/compose/prod}"
PROXY_CONTAINER="${PROXY_CONTAINER:-reverse-proxy}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-letter-to-stars}"

# Git
DEPLOY_REMOTE="${DEPLOY_REMOTE:-origin}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# Health check URL (public)
BASE_URL="${BASE_URL:-https://lettertostars.mustafaerhanportakal.com}"
FRONTEND_HEALTH_URL="${FRONTEND_HEALTH_URL:-$BASE_URL/}"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-$BASE_URL/api/health}"
AI_HEALTH_URL="${AI_HEALTH_URL:-$BASE_URL/ai/health}"

HEALTH_RETRIES="${HEALTH_RETRIES:-10}"
HEALTH_SLEEP_SECONDS="${HEALTH_SLEEP_SECONDS:-2}"

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
  echo "DEPLOY_REMOTE=$DEPLOY_REMOTE"
  echo "DEPLOY_BRANCH=$DEPLOY_BRANCH"
  echo "-----------------------------------"

  echo "Pulling latest code..."
  cd "$PROJECT_ROOT"
  echo "Current ref: $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)"
  git fetch "$DEPLOY_REMOTE" "$DEPLOY_BRANCH"
  # NOTE: do NOT `git clean -fd` here; VPS usually stores untracked env/log files inside repo.
  git checkout -B "$DEPLOY_BRANCH" "$DEPLOY_REMOTE/$DEPLOY_BRANCH"
  git reset --hard "$DEPLOY_REMOTE/$DEPLOY_BRANCH"
  echo "Updated ref: $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)"
  export APP_VERSION="${APP_VERSION:-$(git rev-parse --short HEAD)}"
  echo "APP_VERSION=$APP_VERSION"

  echo "Removing orphan containers if any..."
  docker rm -f lettertostars-backend lettertostars-ai lettertostars-web 2>/dev/null || true

  echo "Building & starting backend container..."
  cd "$COMPOSE_DIR"
  docker compose -p "$COMPOSE_PROJECT_NAME" -f backend.compose.yml up -d --build --force-recreate

  echo "Building & starting ai-service container..."
  docker compose -p "$COMPOSE_PROJECT_NAME" -f ai.compose.yml up -d --build --force-recreate

  echo "Building & starting frontend container..."
  docker compose -p "$COMPOSE_PROJECT_NAME" -f frontend.compose.yml up -d --build --force-recreate

  echo "Reloading reverse-proxy nginx..."
  docker exec -i "$PROXY_CONTAINER" nginx -s reload

  echo "Running health checks..."
  check_url() {
    local name="$1"
    local url="$2"
    if [ -z "${url:-}" ]; then
      echo "Health check skipped: $name (empty url)"
      return 0
    fi
    curl -fsS "$url" >/dev/null
  }

  i=1
  while true; do
    if check_url "frontend" "$FRONTEND_HEALTH_URL" \
      && check_url "backend" "$BACKEND_HEALTH_URL" \
      && check_url "ai-service" "$AI_HEALTH_URL"; then
      echo "Health checks: OK"
      break
    fi

    if [ "$i" -ge "$HEALTH_RETRIES" ]; then
      echo "Health checks failed after $HEALTH_RETRIES attempts"
      echo "Tried:"
      echo "  FRONTEND_HEALTH_URL=$FRONTEND_HEALTH_URL"
      echo "  BACKEND_HEALTH_URL=$BACKEND_HEALTH_URL"
      echo "  AI_HEALTH_URL=$AI_HEALTH_URL"
      exit 1
    fi

    echo "Health checks not ready (attempt $i/$HEALTH_RETRIES), retrying in ${HEALTH_SLEEP_SECONDS}s..."
    i=$((i + 1))
    sleep "$HEALTH_SLEEP_SECONDS"
  done

  echo "Deploy completed successfully"
  echo "== Deploy finished: $(date -Is) =="
} |& tee -a "$LOG_FILE"
