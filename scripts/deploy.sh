#!/usr/bin/env bash
set -e

echo "Letter to Stars | Frontend Deploy Started"

PROJECT_ROOT="/opt/letter-to-stars"
COMPOSE_DIR="$PROJECT_ROOT/infra/compose/prod"
PROXY_CONTAINER="reverse-proxy"

echo "Pulling latest code..."
cd "$PROJECT_ROOT"
git pull

echo "Building & starting frontend container..."
cd "$COMPOSE_DIR"
docker compose -f frontend.compose.yml up -d --build

echo "Reloading reverse-proxy nginx..."
docker exec -it "$PROXY_CONTAINER" nginx -s reload

echo "Frontend deploy completed successfully"
