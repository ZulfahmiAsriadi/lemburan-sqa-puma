import os
import json
import mimetypes

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')

def app(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')

    headers = [
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type'),
        ('Cache-Control', 'no-cache, no-store, must-revalidate')
    ]

    if method == 'OPTIONS':
        start_response('200 OK', headers)
        return [b'']

    # API Routes
    if path == '/api/data':
        if method == 'GET':
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'rb') as f:
                    content = f.read()
            else:
                content = b'{}'
            headers.append(('Content-Type', 'application/json; charset=utf-8'))
            start_response('200 OK', headers)
            return [content]

        elif method == 'POST':
            try:
                length = int(environ.get('CONTENT_LENGTH', 0))
                body = environ['wsgi.input'].read(length)
                parsed = json.loads(body.decode('utf-8'))
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(parsed, f, indent=2, ensure_ascii=False)
                headers.append(('Content-Type', 'application/json; charset=utf-8'))
                start_response('200 OK', headers)
                return [b'{"status":"ok","message":"Data berhasil disimpan"}']
            except Exception as e:
                headers.append(('Content-Type', 'application/json; charset=utf-8'))
                start_response('500 Internal Server Error', headers)
                return [json.dumps({'error': str(e)}).encode('utf-8')]

    # Static file routing
    clean_path = path.lstrip('/') or 'index.html'
    target_file = os.path.join(BASE_DIR, clean_path)
    if os.path.exists(target_file) and os.path.isfile(target_file):
        mime, _ = mimetypes.guess_type(target_file)
        headers.append(('Content-Type', mime or 'application/octet-stream'))
        with open(target_file, 'rb') as f:
            content = f.read()
        start_response('200 OK', headers)
        return [content]

    # Fallback: serve index.html
    index_file = os.path.join(BASE_DIR, 'index.html')
    if os.path.exists(index_file):
        headers.append(('Content-Type', 'text/html; charset=utf-8'))
        with open(index_file, 'rb') as f:
            content = f.read()
        start_response('200 OK', headers)
        return [content]

    start_response('404 Not Found', [('Content-Type', 'text/plain')])
    return [b'Not Found']

# Top-level variables for Vercel Python runtime
application = app
