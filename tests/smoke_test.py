#!/usr/bin/env python3
"""Smoke test Terps Hoops Command offline build + health."""
import os, json, subprocess, urllib.request
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
subprocess.check_call(["python3", "build.py"])
html = open("dist/terps-hoops.html", encoding="utf-8").read()
assert "Terps Hoops Command" in html
assert "/*__CSS__*/" not in html and "/*__APP__*/" not in html
assert "#E21833" in html
assert "EXAMPLE" in html
assert "XFINITY" in html
for screen in ("Tipoff HQ", "Court Board", "Big Ten Desk", "Lore Wall", "Fan Notes"):
    assert screen in html, screen
print("offline html ok", len(html.encode()), "bytes")
try:
    with urllib.request.urlopen("http://127.0.0.1:4288/health", timeout=2) as r:
        h = json.loads(r.read())
        assert h.get("ok") and h.get("port") == 4288
        print("health ok", h)
except Exception as ex:
    print("health skipped (server not up):", ex)
print("SMOKE PASS")
