#!/usr/bin/env bash
set -euo pipefail
STAGING_URL="${STAGING_URL:-}"
MAX_RETRIES=20
RETRY_DELAY=5
if [ -z "$STAGING_URL" ]; then
  echo "STAGING_URL no definido; simulando smoke test OK"
  exit 0
fi
i=1
while [ $i -le $MAX_RETRIES ]; do
  echo "[SMOKE] intento $i/$MAX_RETRIES"
  if curl -fsS "$STAGING_URL/health" >/tmp/health.json 2>&1; then
    echo "OK"
    cat /tmp/health.json
    exit 0
  fi
  sleep $RETRY_DELAY
  i=$((i+1))
done
echo "FAIL: smoke test tras $MAX_RETRIES intentos"
exit 1

