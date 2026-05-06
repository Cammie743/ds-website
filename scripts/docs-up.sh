#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4321}"
URL="http://127.0.0.1:${PORT}/"
STRICT_FIXED="${STRICT_FIXED:-0}"

echo "Preparing docs dev server on port ${PORT}..."

PIDS="$(lsof -ti tcp:"${PORT}" -sTCP:LISTEN || true)"
if [ -n "${PIDS}" ]; then
  if curl -sSf "${URL}" >/dev/null 2>&1; then
    echo "Docs server is already running at ${URL}"
    open "${URL}" || true
    exit 0
  fi

  if [ "${STRICT_FIXED}" = "1" ]; then
    echo "Port ${PORT} is already in use and fixed mode is enabled."
    echo "Run 'npm run docs:stop' or free port ${PORT}, then retry."
    exit 1
  fi

  echo "Port ${PORT} is occupied by another process; finding another port..."
  for CANDIDATE in 4322 4323 4324 4325 4326; do
    if ! lsof -ti tcp:"${CANDIDATE}" -sTCP:LISTEN >/dev/null 2>&1; then
      PORT="${CANDIDATE}"
      URL="http://127.0.0.1:${PORT}/"
      echo "Using port ${PORT}"
      break
    fi
  done
fi

echo "Starting docs dev server..."
npm run dev -w @prism/docs -- --port "${PORT}" --strictPort &
SERVER_PID=$!

cleanup() {
  if kill -0 "${SERVER_PID}" >/dev/null 2>&1; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup INT TERM

for _ in $(seq 1 60); do
  if curl -sSf "${URL}" >/dev/null 2>&1; then
    echo "Docs is ready at ${URL}"
    open "${URL}" || true
    wait "${SERVER_PID}"
    exit $?
  fi
  sleep 0.5
done

echo "Docs server did not respond quickly; opening browser anyway."
open "${URL}" || true
wait "${SERVER_PID}"
