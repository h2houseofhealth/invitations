"""Local dev server with SPA rewrite — serves index.html for any unknown path."""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        # If the path maps to a real file, serve it normally
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            return super().do_GET()
        # Otherwise rewrite to index.html (SPA fallback)
        self.path = "/index.html"
        return super().do_GET()

print(f"Serving at http://localhost:{PORT}")
print(f"Open: http://localhost:{PORT}/")
http.server.HTTPServer(("", PORT), SPAHandler).serve_forever()
