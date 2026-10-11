#!/usr/bin/env bash
# Terps Hoops Command: build offline snapshot, then serve on 127.0.0.1:4288.
#   ./run.sh           build + serve
#   ./run.sh --test    build + smoke test + serve
#   ./run.sh --shots   build + screenshot + serve
set -euo pipefail
cd "$(dirname "$0")"
PORT=4288
python3 build.py
if [[ "${1:-}" == "--shots" ]]; then bash tests/screenshot.sh; fi
if [[ "${1:-}" == "--test" ]]; then python3 tests/smoke_test.py | tee tests/smoke-test.log; fi
if ss -ltn | grep -q "127.0.0.1:$PORT "; then echo "already serving on http://127.0.0.1:$PORT/"; else
  nohup python3 server.py > /tmp/terps-hoops-$PORT.log 2>&1 &
  sleep 1; echo "serving http://127.0.0.1:$PORT/ (pid $!)  ·  offline file: dist/terps-hoops.html"; fi
