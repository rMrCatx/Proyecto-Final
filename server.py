#!/usr/bin/env python3
"""
Servidor del Blog Institucional - Politécnico Vicente Aquilino Santos
Backend simple para manejar datos del blog sin frameworks
"""

import json
import os
import http.server
import socketserver
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Configuración
PORT = 8000
DATA_DIR = "data"
POSTS_FILE = os.path.join(DATA_DIR, "posts.json")
COMMENTS_FILE = os.path.join(DATA_DIR, "comments.json")
USERS_FILE = os.path.join(DATA_DIR, "users.json")

# Crear directorio de datos si no existe
os.makedirs(DATA_DIR, exist_ok=True)

# Inicializar archivos de datos si no existen
def init_data_files():
    default_data = {
        "posts": [
            {
                "id": 1,
                "title": "Bienvenidos al Blog del Politécnico",
                "content": "Este es nuestro nuevo blog institucional donde compartiremos noticias, eventos y logros de nuestra comunidad educativa.",
                "author": "Administración",
                "category": "institucional",
                "date": "2024-01-15",
                "likes": 42,
                "views": 150
            }
        ],
        "comments": [],
        "users": [
            {
                "id": 1,
                "username": "admin",
                "password": "admin123",  # En producción usar hash
                "role": "admin",
                "email": "admin@politecnico.edu"
            }
        ]
    }
    
    if not os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_data["posts"], f, indent=2)
    
    if not os.path.exists(COMMENTS_FILE):
        with open(COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_data["comments"], f, indent=2)
    
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_data["users"], f, indent=2)

class BlogHandler(http.server.SimpleHTTPRequestHandler):
    """Manejador personalizado para el blog"""
    
    def do_GET(self):
        """Manejar solicitudes GET"""
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            query_params = parse_qs(parsed_url.query)
            self.handle_api(path, query_params)
            return
        
        # Servir archivos estáticos
        super().do_GET()
    
    def do_POST(self):
        """Manejar solicitudes POST"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            data = {}
        
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path.startswith('/api/'):
            self.handle_api_post(path, data)
    
    def handle_api(self, path, params):
        """Manejar endpoints de la API"""
        response = {}
        status = 200
        
        if path == '/api/posts':
            posts = self.load_posts()
            
            # Filtrar por categoría si se especifica
            category = params.get('category', [None])[0]
            if category:
                posts = [p for p in posts if p.get('category') == category]
            
            # Limitar número de posts si se especifica
            limit = params.get('limit', [None])[0]
            if limit:
                posts = posts[:int(limit)]
            
            response = posts
            
        elif path == '/api/posts/latest':
            posts = self.load_posts()
            response = posts[:5]  # Últimos 5 posts
            
        elif path.startswith('/api/posts/'):
            post_id = path.split('/')[-1]
            if post_id.isdigit():
                post = self.get_post_by_id(int(post_id))
                if post:
                    response = post
                    # Incrementar vistas
                    post['views'] = post.get('views', 0) + 1
                    self.save_post(post)
                else:
                    status = 404
                    response = {"error": "Post no encontrado"}
        
        elif path == '/api/categories':
            posts = self.load_posts()
            categories = list(set(p.get('category', 'general') for p in posts))
            response = categories
        
        elif path.startswith('/api/comments/'):
            post_id = path.split('/')[-1]
            if post_id.isdigit():
                comments = self.load_comments()
                post_comments = [c for c in comments if c.get('post_id') == int(post_id)]
                response = post_comments
        
        else:
            status = 404
            response = {"error": "Endpoint no encontrado"}
        
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def handle_api_post(self, path, data):
        """Manejar POST a la API"""
        response = {}
        status = 200
        
        if path == '/api/comments':
            comment = {
                "id": self.get_next_id('comments'),
                "post_id": data.get('post_id'),
                "author": data.get('author', 'Anónimo'),
                "content": data.get('content'),
                "date": datetime.now().isoformat(),
                "likes": 0
            }
            
            comments = self.load_comments()
            comments.append(comment)
            self.save_comments(comments)
            
            response = {"success": True, "comment": comment}
            status = 201
        
        elif path == '/api/posts/like':
            post_id = data.get('post_id')
            post = self.get_post_by_id(post_id)
            
            if post:
                post['likes'] = post.get('likes', 0) + 1
                self.save_post(post)
                response = {"success": True, "likes": post['likes']}
            else:
                status = 404
                response = {"error": "Post no encontrado"}
        
        elif path == '/api/contact':
            # Simular envío de correo
            name = data.get('name', '')
            email = data.get('email', '')
            message = data.get('message', '')
            
            # Aquí iría el código real para enviar el correo
            print(f"Mensaje de contacto recibido:")
            print(f"Nombre: {name}")
            print(f"Email: {email}")
            print(f"Mensaje: {message}")
            
            response = {"success": True, "message": "Mensaje enviado correctamente"}
        
        else:
            status = 404
            response = {"error": "Endpoint no encontrado"}
        
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    # Métodos de utilidad
    def load_posts(self):
        """Cargar posts desde el archivo"""
        try:
            with open(POSTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def save_post(self, post):
        """Guardar un post actualizado"""
        posts = self.load_posts()
        for i, p in enumerate(posts):
            if p.get('id') == post.get('id'):
                posts[i] = post
                break
        
        with open(POSTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts, f, indent=2)
    
    def get_post_by_id(self, post_id):
        """Obtener post por ID"""
        posts = self.load_posts()
        for post in posts:
            if post.get('id') == post_id:
                return post
        return None
    
    def load_comments(self):
        """Cargar comentarios desde el archivo"""
        try:
            with open(COMMENTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def save_comments(self, comments):
        """Guardar comentarios"""
        with open(COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(comments, f, indent=2)
    
    def get_next_id(self, data_type):
        """Obtener el siguiente ID disponible"""
        if data_type == 'comments':
            data = self.load_comments()
        elif data_type == 'posts':
            data = self.load_posts()
        else:
            return 1
        
        if not data:
            return 1
        
        max_id = max(item.get('id', 0) for item in data)
        return max_id + 1

def main():
    """Función principal"""
    init_data_files()
    
    handler = BlogHandler
    handler.extensions_map.update({
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
    })
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Servidor del blog ejecutándose en http://localhost:{PORT}")
        print(f"API disponible en http://localhost:{PORT}/api/")
        print("Presiona Ctrl+C para detener el servidor")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDeteniendo servidor...")
            httpd.shutdown()

if __name__ == "__main__":
    main()