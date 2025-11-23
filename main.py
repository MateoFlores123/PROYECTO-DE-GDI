# main.py - VERSIÓN CORREGIDA
import warnings
import logging
from socketserver import ThreadingMixIn
from http.server import HTTPServer
import sys
import webbrowser
import threading
import time

# Configurar logging para mejor rendimiento
logging.getLogger('psycopg2').setLevel(logging.WARNING)
warnings.filterwarnings("ignore", category=UserWarning)

from handlers import MunicipalRequestHandler

# Hacer que el servidor sea multi-hilo
class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    port = 8000
    server_address = ('', port)
    
    try:
        print("🚀 Iniciando sistema con precarga de datos...")
        print("⏳ Esto puede tomar unos segundos...")
        
        # Usar el servidor con threading
        httpd = ThreadingHTTPServer(server_address, MunicipalRequestHandler)
        
        print(f"✅ Servidor iniciado en http://localhost:{port}")
        print("📊 Sistema de Pre-Resoluciones Municipal")
        print("💾 Base de datos: Render.com (PostgreSQL)")
        print("⚡ Todos los datos precargados en memoria")
        print("🧵 Servidor multi-hilo activado")
        print("⏸️  Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        print("\n📨 LOGS DE SOLICITUDES (aparecerán aquí):")
        print("-" * 50)
        
        # Abrir navegador automáticamente
        def open_browser():
            time.sleep(3)  # Dar tiempo a que se precargue todo
            webbrowser.open(f'http://localhost:{port}')
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        httpd.serve_forever()
        
    except OSError as e:
        if "10048" in str(e):
            print(f"❌ Error: El puerto {port} está en uso.")
            print("💡 Solución: Cierra otros programas que usen el puerto 8000 o usa otro puerto")
        else:
            print(f"❌ Error: {e}")
        input("Presiona Enter para salir...")
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
        input("Presiona Enter para salir...")

if __name__ == "__main__":
    run_server()
