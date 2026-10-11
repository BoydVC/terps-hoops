#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${TERPS_HOOPS_PORT:-4288}"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p screenshots dist
python3 build.py
# ensure server
if ! ss -ltn | grep -q "127.0.0.1:$PORT "; then
  nohup python3 server.py > /tmp/terps-hoops-$PORT.log 2>&1 &
  sleep 1
fi
shot() {
  local url="$1" out="$2" size="$3"; shift 3 || true
  local prof; prof="$(mktemp -d /tmp/terpsshot.XXXX)"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --run-all-compositor-stages-before-draw --virtual-time-budget=16000 \
    --window-size="$size" --user-data-dir="$prof" --screenshot="$out" "$@" "$url" >/dev/null 2>&1
  rm -rf "$prof"; echo "  $out ($(wc -c < "$out") bytes)"
}
ABS="$(pwd)/dist/terps-hoops.html"
shot "file://$ABS" screenshots/00-best-home.png 1440,1100
shot "http://127.0.0.1:$PORT/" screenshots/01-desktop-live.png 1440,1000
shot "http://127.0.0.1:$PORT/" screenshots/02-phone.png 390,844 --user-agent="Mozilla/5.0 (iPhone)"
echo "screenshots done"
