#!/usr/bin/env bash
set -euo pipefail

echo "Stopping docs dev servers..."

PIDS="$(lsof -ti tcp:4321 -sTCP:LISTEN || true)"
PIDS="${PIDS} $(lsof -ti tcp:4322 -sTCP:LISTEN || true)"
PIDS="${PIDS} $(lsof -ti tcp:4323 -sTCP:LISTEN || true)"
PIDS="${PIDS} $(lsof -ti tcp:4324 -sTCP:LISTEN || true)"
PIDS="${PIDS} $(lsof -ti tcp:4325 -sTCP:LISTEN || true)"

UNIQUE_PIDS="$(echo "${PIDS}" | tr ' ' '\n' | awk 'NF' | sort -u)"

if [ -z "${UNIQUE_PIDS}" ]; then
  echo "No docs servers found on ports 4321-4325."
  exit 0
fi

echo "Killing PIDs: ${UNIQUE_PIDS}"
while IFS= read -r PID; do
  [ -z "${PID}" ] && continue
  kill "${PID}" >/dev/null 2>&1 || true
done <<< "${UNIQUE_PIDS}"

sleep 1

REMAINING="$(lsof -ti tcp:4321 -sTCP:LISTEN || true)"
REMAINING="${REMAINING} $(lsof -ti tcp:4322 -sTCP:LISTEN || true)"
REMAINING="${REMAINING} $(lsof -ti tcp:4323 -sTCP:LISTEN || true)"
REMAINING="${REMAINING} $(lsof -ti tcp:4324 -sTCP:LISTEN || true)"
REMAINING="${REMAINING} $(lsof -ti tcp:4325 -sTCP:LISTEN || true)"
REMAINING="$(echo "${REMAINING}" | tr ' ' '\n' | awk 'NF' | sort -u)"

if [ -n "${REMAINING}" ]; then
  echo "Some processes are still listening (possibly permission-protected): ${REMAINING}"
  exit 1
fi

echo "Docs servers stopped."
