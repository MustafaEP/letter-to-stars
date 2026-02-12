# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

# Create Virtual environment (isolation)
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy Dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

# Create Non-root user (security)
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown -R appuser:appuser /app

WORKDIR /app

# Copy Virtual env from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy App code
COPY --chown=appuser:appuser ./app ./app

# Use Non-root user
USER appuser

# Add Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8001/health')" || exit 1

ENV WORKERS=2

# Production-ready uvicorn config
CMD uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers $WORKERS --log-level info --access-log
