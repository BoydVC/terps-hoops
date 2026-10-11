#!/usr/bin/env python3
"""Inline web/ into one self-contained offline file: dist/terps-hoops.html."""
import os
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()
html = rd("web/index.html").replace("/*__CSS__*/", rd("web/app.css")).replace(
    "/*__APP__*/", rd("web/app.js").replace("</script", "<\\/script")
)
os.makedirs(os.path.join(R, "dist"), exist_ok=True)
open(os.path.join(R, "dist/terps-hoops.html"), "w", encoding="utf-8").write(html)
print("built dist/terps-hoops.html", len(html.encode()), "bytes")
