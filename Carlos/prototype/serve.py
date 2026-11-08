"""Practice canvas: static file server plus a same-origin coach proxy (prototype only).

Run from the hackathon folder root, after setting ANTHROPIC_API_KEY in this shell:
    python prototype/serve.py
Then open http://localhost:8000/prototype/canvas-prototype-v0.html and switch cloud on.

The key is read from the environment only. It goes to the API as a request header and is
never printed, logged, written to a file or accepted from the browser. Standard library only.
"""
import http.server
import json
import os
import sys
import urllib.error
import urllib.request

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-opus-5-5"
PORT = 8000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the hackathon folder root
MAX_BODY = 64 * 1024
ALLOWED = ("max_tokens", "fallbacks", "system", "output_config", "messages")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        # method and path only: never headers, never bodies
        sys.stderr.write("%s %s\n" % (self.command, self.path.split("?")[0]))

    def _json(self, status, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path.split("?")[0] != "/api/coach":
            return self._json(404, {"error": "not found"})
        key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not key:
            # 501 tells the page there is no working proxy, so it can try a pasted key
            return self._json(501, {"error": "no ANTHROPIC_API_KEY in the shell that runs serve.py"})
        try:
            length = int(self.headers.get("content-length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            return self._json(400, {"error": "body missing or too large"})
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            return self._json(400, {"error": "body is not JSON"})
        if not isinstance(body, dict):
            return self._json(400, {"error": "body is not a JSON object"})

        # a NEW request: only the expected fields, fixed model, capped output
        out = {k: body[k] for k in ALLOWED if k in body}
        out["model"] = MODEL
        try:
            out["max_tokens"] = max(1, min(int(out.get("max_tokens", 2048)), 2048))
        except (TypeError, ValueError):
            out["max_tokens"] = 2048
        request = urllib.request.Request(
            API_URL,
            data=json.dumps(out).encode("utf-8"),
            method="POST",
            headers={
                "content-type": "application/json",
                "x-api-key": key,
                "anthropic-version": "2026-10-21",
                "anthropic-beta": "server-side-fallback-2026-07-01",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=25) as resp:
                status, raw = resp.status, resp.read()
        except urllib.error.HTTPError as err:
            status, raw = err.code, err.read()
        except (urllib.error.URLError, TimeoutError, OSError):
            return self._json(502, {"error": "API not reachable"})
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            payload = {"error": "unreadable API reply"}
        self._json(status, payload)


def main():
    state = "set" if os.environ.get("ANTHROPIC_API_KEY") else "not set (the page falls back to a pasted key)"
    print("Serving %s on http://localhost:%d  (coach proxy POST /api/coach; key %s)" % (ROOT, PORT, state))
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
