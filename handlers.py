# handlers.py - USANDO SINGLETON (COMPLETO)
import http.server
import json
import urllib.parse
import os
import sys
from datetime import datetime
from database import DatabaseManager
from models import ConsultasManager

def resource_path(relative_path):
    """Obtiene la ruta correcta ya sea en desarrollo o dentro del exe."""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# Crear UNA SOLA instancia al inicio
db_manager = DatabaseManager()
consultas_manager = ConsultasManager(db_manager)

class MunicipalRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Usar las instancias globales
        self.db = db_manager
        self.consultas = consultas_manager
        super().__init__(*args, **kwargs)
    
    def log_message(self, format, *args):
        """Override para logs más visibles"""
        print(f"🌐 [{self.address_string()}] {format % args}")
    def do_GET(self):
        """Manejar solicitudes GET - VERSIÓN ULTRA DEBUG"""
        print("\n" + "="*80)
        print("🔥🔥🔥 PETICIÓN GET INTERCEPTADA 🔥🔥🔥")
        print("="*80)
        
        try:
            parsed_path = urllib.parse.urlparse(self.path)
            
            # LOG ULTRA VISIBLE
            print(f"📍 RUTA SOLICITADA: '{parsed_path.path}'")
            print(f"📍 QUERY STRING: '{parsed_path.query}'")
            print(f"📍 CLIENT: {self.client_address}")
            print(f"📍 MÉTODO: GET")
            print("-"*80)
            
            # Servir archivos estáticos
            if parsed_path.path.startswith('/static/'):
                print(f"📁 ➡️  ARCHIVO ESTÁTICO: {parsed_path.path}")
                self.serve_static_file(parsed_path.path)
                return
            
            # Rutas de la API - CON LOGS EXPLÍCITOS
            if parsed_path.path == '/':
                print("🏠 ➡️  SERVIR PÁGINA PRINCIPAL")
                self.serve_index()
                print("✅ Página principal servida\n")
                
            elif parsed_path.path == '/expedientes':
                print("📂 ➡️  SOLICITUD DE EXPEDIENTES")
                data = self.get_expedientes_optimizado()
                print(f"📂 ➡️  Enviando {len(data)} expedientes")
                self.send_json_response(data)
                print("✅ Expedientes enviados\n")
                
            elif parsed_path.path == '/administrados':
                print("👥 ➡️  SOLICITUD DE ADMINISTRADOS")
                data = self.get_administrados_optimizado()
                print(f"👥 ➡️  Enviando {len(data)} administrados")
                self.send_json_response(data)
                print("✅ Administrados enviados\n")
                
            elif parsed_path.path == '/solicitudes':
                print("📄 ➡️  SOLICITUD DE SOLICITUDES")
                data = self.get_solicitudes_optimizado()
                print(f"📄 ➡️  Enviando {len(data)} solicitudes")
                self.send_json_response(data)
                print("✅ Solicitudes enviadas\n")
                
            elif parsed_path.path == '/proveidos':
                print("📋 ➡️  SOLICITUD DE PROVEÍDOS")
                data = self.get_proveidos_optimizado()
                print(f"📋 ➡️  Enviando {len(data)} proveídos")
                self.send_json_response(data)
                print("✅ Proveídos enviados\n")
                
            elif parsed_path.path == '/preresoluciones':
                print("⚖️ ➡️  SOLICITUD DE PRE-RESOLUCIONES")
                data = self.get_preresoluciones_optimizado()
                print(f"⚖️ ➡️  Enviando {len(data)} pre-resoluciones")
                self.send_json_response(data)
                print("✅ Pre-resoluciones enviadas\n")
                
            elif parsed_path.path == '/gerencias':
                print("🏢 ➡️  SOLICITUD DE GERENCIAS")
                data = self.get_gerencias()
                self.send_json_response(data)
                print("✅ Gerencias enviadas\n")
                
            elif parsed_path.path == '/subgerencias':
                print("🏛️ ➡️  SOLICITUD DE SUBGERENCIAS")
                data = self.get_subgerencias()
                self.send_json_response(data)
                print("✅ Subgerencias enviadas\n")
                
            elif parsed_path.path == '/analistas':
                print("👤 ➡️  SOLICITUD DE ANALISTAS")
                data = self.get_analistas()
                self.send_json_response(data)
                print("✅ Analistas enviados\n")
                
            elif parsed_path.path == '/mesa_partes':
                print("📦 ➡️  SOLICITUD DE MESA DE PARTES")
                data = self.get_mesa_partes()
                self.send_json_response(data)
                print("✅ Mesa de partes enviada\n")
                
            elif parsed_path.path == '/consultas':
                print("🔍 ➡️  SOLICITUD DE CONSULTAS")
                self.handle_consultas(parsed_path)
                print("✅ Consultas procesadas\n")
                
            elif parsed_path.path == '/diagnostico':
                print("🔬 ➡️  DIAGNÓSTICO DEL SISTEMA")
                self.hacer_diagnostico()
                print("✅ Diagnóstico completado\n")

            else:
                print(f"❌❌❌ RUTA NO ENCONTRADA: {parsed_path.path}")
                self.send_error(404)
                print("="*80 + "\n")
                
        except Exception as e:
            print(f"💥💥💥 ERROR CRÍTICO en do_GET 💥💥💥")
            print(f"Error: {e}")
            print("="*80)
            import traceback
            traceback.print_exc()
            self.send_error(500, f"Error interno: {e}")
    
    def hacer_diagnostico(self):
        """Endpoint de diagnóstico"""
        print("🔍 EJECUTANDO DIAGNÓSTICO...")
        
        diagnostico = {
            'conexion_db': self.db.connection is not None,
            'all_data_loaded': self.db._all_data_loaded,
            'cache_keys': list(self.db._cache.keys()) if hasattr(self.db, '_cache') else [],
            'estadisticas': {}
        }
        
        # Probar cada endpoint
        endpoints = ['expedientes', 'administrados', 'solicitudes', 'proveidos', 'preresoluciones']
        
        for endpoint in endpoints:
            try:
                method_name = f'get_{endpoint}_supabase'
                method = getattr(self.db, method_name)
                data = method()
                diagnostico['estadisticas'][endpoint] = len(data)
            except Exception as e:
                diagnostico['estadisticas'][endpoint] = f"Error: {e}"
        
        print(f"📊 Resultado diagnóstico: {diagnostico}")
        self.send_json_response(diagnostico)

    # En handlers.py, agrega este método en la clase MunicipalRequestHandler

    def verificar_dependencias_administrado(self, d_r):
        """Verificar dependencias de un administrado"""
        try:
            dependencias = self.db.verificar_dependencias_administrado(d_r)
            return dependencias
        except Exception as e:
            print(f"❌ Error verificando dependencias: {e}")
            return {
                'solicitudes': 0,
                'puede_eliminar': False,
                'mensaje': f'Error al verificar dependencias: {e}'
            }
    
    def do_POST(self):
        """Manejar solicitudes POST"""
        print("\n" + "="*80)
        print("🔥🔥🔥 PETICIÓN POST INTERCEPTADA 🔥🔥🔥")
        print("="*80)
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            data = urllib.parse.parse_qs(post_data)
            
            print(f"📍 RUTA: {self.path}")
            print(f"📍 DATOS: {list(data.keys())}")
            print("-"*80)
            
            if self.path == '/crear_proveido':
                success = self.crear_proveido(data)
                self.send_json_response({'success': success})
            elif self.path == '/crear_preresolucion':
                success = self.crear_preresolucion(data)
                self.send_json_response({'success': success})
            elif self.path == '/agregar_administrado':
                success = self.agregar_administrado(data)
                self.send_json_response({'success': success})
            elif self.path == '/agregar_solicitud':
                success, expediente = self.agregar_solicitud(data)
                self.send_json_response({'success': success, 'expediente': expediente})
            elif self.path == '/descargar_proveido':
                self.descargar_proveido(data)
            elif self.path == '/descargar_preresolucion':
                self.descargar_preresolucion(data)
            elif self.path == '/eliminar_administrado':
                d_r = data.get('d_r', [''])[0]
                resultado = self.eliminar_administrado(d_r)
                self.send_json_response(resultado)
            elif self.path == '/eliminar_solicitud':
                nums = data.get('nums', [''])[0]
                resultado = self.eliminar_solicitud(nums)
                self.send_json_response(resultado)
            elif self.path == '/eliminar_expediente':
                nuex = data.get('nuex', [''])[0]
                resultado = self.eliminar_expediente(nuex)
                self.send_json_response(resultado)
            elif self.path == '/eliminar_proveido':
                npro = data.get('npro', [''])[0]
                success = self.db.eliminar_proveido(npro)
                self.send_json_response({'success': success})
            elif self.path == '/eliminar_preresolucion':
                nupr = data.get('nupr', [''])[0]
                success = self.db.eliminar_preresolucion(nupr)
                self.send_json_response({'success': success})
            elif self.path == '/actualizar_administrado':
                success = self.actualizar_administrado(data)
                self.send_json_response({'success': success})
            elif self.path == '/actualizar_solicitud':
                success = self.actualizar_solicitud(data)
                self.send_json_response({'success': success})
            elif self.path == '/actualizar_expediente':
                success = self.actualizar_expediente(data)
                self.send_json_response({'success': success})
            elif self.path == '/actualizar_proveido':
                success = self.actualizar_proveido(data)
                self.send_json_response({'success': success})
            elif self.path == '/actualizar_preresolucion':
                success = self.actualizar_preresolucion(data)
                self.send_json_response({'success': success})
            else:
                self.send_error(404)
                
            print("="*80 + "\n")
        except Exception as e:
            print(f"❌ Error en do_POST: {e}")
            import traceback
            traceback.print_exc()
            self.send_error(500, f"Error interno: {e}")

    def serve_static_file(self, path):
        """Servir archivos estáticos"""
        try:
            if path.startswith('/static/'):
                file_path = resource_path(path[1:])
            elif path.startswith('/templates/'):
                file_path = resource_path(path[1:])
            else:
                self.send_error(404)
                return
                
            if not os.path.exists(file_path):
                print(f"❌ Archivo no encontrado: {file_path}")
                self.send_error(404, "File not found")
                return
                
            mime_types = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.ico': 'image/x-icon',
                '.json': 'application/json'
            }
            
            _, ext = os.path.splitext(file_path)
            mime_type = mime_types.get(ext.lower(), 'text/plain')
            
            self.send_response(200)
            self.send_header('Content-type', f'{mime_type}; charset=utf-8')
            self.end_headers()
            
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
                
        except Exception as e:
            print(f"❌ Error sirviendo archivo estático {path}: {e}")
            self.send_error(500, f"Error serving static file: {e}")
    
    def serve_index(self):
        try:
            index_path = resource_path("templates/index.html")
            
            if not os.path.exists(index_path):
                print(f"❌ Archivo index.html no encontrado en: {index_path}")
                self.send_error(404, f"index.html not found at {index_path}")
                return
                
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            with open(index_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            self.wfile.write(html_content.encode('utf-8'))
            
        except Exception as e:
            print(f"Error sirviendo index: {e}")
            self.send_error(500, f"Error: {e}")
    
    def send_json_response(self, data):
        """Enviar respuesta JSON con logs detallados"""
        try:
            json_data = json.dumps(data, ensure_ascii=False)
            json_bytes = json_data.encode('utf-8')
            
            print(f"📤 ENVIANDO JSON:")
            print(f"   - Tipo de datos: {type(data)}")
            print(f"   - Cantidad de elementos: {len(data) if isinstance(data, (list, dict)) else 'N/A'}")
            print(f"   - Tamaño en bytes: {len(json_bytes)}")
            print(f"   - Primeros 200 chars: {json_data[:200]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', len(json_bytes))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json_bytes)
            
            print(f"✅ Respuesta JSON enviada correctamente")
            
        except Exception as e:
            print(f"❌ Error enviando JSON: {e}")
            import traceback
            traceback.print_exc()
    
    def handle_consultas(self, parsed_path):
        query_params = urllib.parse.parse_qs(parsed_path.query)
        consulta_type = query_params.get('type', [None])[0]
        
        resultados = []
        if consulta_type == 'fecha_preresolucion_numero':
            resultados = self.consultas.get_fecha_preresolucion_numero()
        elif consulta_type == 'encargados_fecha_preresolucion':
            resultados = self.consultas.get_encargados_fecha_preresolucion()
        elif consulta_type == 'fecha_mesa_partes_solicitud':
            resultados = self.consultas.get_fecha_mesa_partes_solicitud()
        elif consulta_type == 'preresolucion_ordenada_fecha_solicitud':
            resultados = self.consultas.get_preresolucion_ordenada_fecha_solicitud()
        elif consulta_type == 'preresoluciones_con_gerencia':
            resultados = self.consultas.get_preresoluciones_con_gerencia()
        elif consulta_type == 'solicitudes_estado_analista':
            resultados = self.consultas.get_solicitudes_estado_analista()
        elif consulta_type == 'solicitudes_por_mesa_partes':
            resultados = self.consultas.get_solicitudes_por_mesa_partes()
        elif consulta_type == 'preresoluciones_por_normativa':
            resultados = self.consultas.get_preresoluciones_por_normativa()
        elif consulta_type == 'preresoluciones_por_mes_anio':
            resultados = self.consultas.get_preresoluciones_por_mes_anio()
        elif consulta_type == 'preresoluciones_pendientes_por_analista':
            resultados = self.consultas.get_preresoluciones_pendientes_por_analista()
        
        self.send_json_response(resultados)
    
    # MÉTODOS OPTIMIZADOS - TODOS CON DEBUG
    def get_expedientes_optimizado(self):
        """Método optimizado para expedientes - VERSIÓN SEGURA"""
        try:
            print("🔄 [HANDLER] Solicitando expedientes...")
            results = self.db.get_expedientes_supabase()
            
            # Si está vacío, forzar recarga
            if not results or len(results) == 0:
                print("⚠️ [HANDLER] Expedientes vacíos, forzando recarga...")
                self.db.recargar_todos_los_datos()
                results = self.db.get_expedientes_supabase()
                
            print(f"✅ [HANDLER] Expedientes a enviar: {len(results)} registros")
            return results
            
        except Exception as e:
            print(f"❌ [HANDLER] Error obteniendo expedientes: {e}")
            return []
    
    def get_proveidos_optimizado(self):
        """Método optimizado para proveídos"""
        try:
            print("📋 Solicitando proveídos...")
            results = self.db.get_proveidos_supabase()
            print(f"📋 Proveídos obtenidos: {len(results)} registros")
            return results
        except Exception as e:
            print(f"❌ Error obteniendo proveídos optimizados: {e}")
            return []
    
    def get_preresoluciones_optimizado(self):
        """Método optimizado para pre-resoluciones"""
        try:
            print("⚖️ Solicitando pre-resoluciones...")
            results = self.db.get_preresoluciones_supabase()
            print(f"⚖️ Pre-resoluciones obtenidas: {len(results)} registros")
            return results
        except Exception as e:
            print(f"❌ Error obteniendo pre-resoluciones optimizadas: {e}")
            return []
    
    def get_administrados_optimizado(self):
        try:
            print("🔄 [HANDLER] Solicitando administrados...")
            results = self.db.get_administrados_supabase()
            
            if not results or len(results) == 0:
                print("⚠️ [HANDLER] Administrados vacíos, forzando recarga...")
                self.db.recargar_todos_los_datos()
                results = self.db.get_administrados_supabase()
                
            print(f"✅ [HANDLER] Administrados a enviar: {len(results)} registros")
            return results
            
        except Exception as e:
            print(f"❌ [HANDLER] Error obteniendo administrados: {e}")
            return []
    

    # Aplica el mismo patrón a todos los métodos optimizados
    def get_solicitudes_optimizado(self):
        """Método optimizado para solicitudes - VERSIÓN MEJORADA"""
        try:
            print("📄 Solicitando solicitudes...")
            results = self.db.get_solicitudes_supabase()
            print(f"📄 Solicitudes obtenidas: {len(results)} registros")
            
            # DEBUG: Verificar contenido
            if results and len(results) > 0:
                print(f"📄 Primera solicitud: {results[0].get('nums', 'N/A')}")
            else:
                print("📄 No hay solicitudes o array vacío")
                
            return results
        except Exception as e:
            print(f"❌ Error obteniendo solicitudes optimizadas: {e}")
            return []
    
    # MÉTODOS REGULARES
    def get_gerencias(self):
        try:
            results = self.db.get_gerencias_supabase()
            return results
        except Exception as e:
            print(f"Error obteniendo gerencias: {e}")
            return []
    
    def get_subgerencias(self):
        try:
            results = self.db.get_subgerencias_supabase()
            return results
        except Exception as e:
            print(f"Error obteniendo subgerencias: {e}")
            return []
    
    def get_analistas(self):
        try:
            results = self.db.get_analistas_supabase()
            return results
        except Exception as e:
            print(f"Error obteniendo analistas: {e}")
            return []
    
    def get_mesa_partes(self):
        try:
            results = self.db.get_mesa_partes_supabase()
            return results
        except Exception as e:
            print(f"Error obteniendo mesa de partes: {e}")
            return []
    
    # MÉTODOS DE AGREGAR
    def agregar_administrado(self, data):
        try:
            # Obtener los datos del formulario
            d_r = data.get('d_r', [''])[0]
            noma = data.get('noma', [''])[0]
            dir_d = data.get('dir_d', [''])[0]
            dir_a = data.get('dir_a', [''])[0]
            dir_c = data.get('dir_c', [''])[0]
            dir_n = data.get('dir_n', [''])[0]

            print(f"📝 Datos recibidos para administrado:")
            print(f"   D_R: {d_r}")
            print(f"   Nombre: {noma}")

            # Validar que todos los campos tengan valores
            if not all([d_r, noma, dir_d, dir_a, dir_c, dir_n]):
                print("❌ Error: Faltan campos obligatorios")
                return False
                
            success = self.db.agregar_administrado((d_r, noma, dir_d, dir_a, dir_c, dir_n))
            if success:
                print("✅ Administrado agregado correctamente")
            else:
                print("❌ Error al agregar administrado en la base de datos")
            return success
        except Exception as e:
            print(f"❌ Error agregando administrado: {e}")
            return False
    
    def agregar_solicitud(self, data):
        try:
            # Obtener el último número de solicitud para generar el siguiente
            ultima_solicitud = self.obtener_ultima_solicitud()
            nuevo_numero = self.generar_numero_solicitud(ultima_solicitud)
            
            print(f"🔢 Número de solicitud generado: {nuevo_numero} (longitud: {len(nuevo_numero)})")
            
            tita = data.get('tita', [''])[0]
            estd = True  # Por defecto activa
            now = datetime.now()
            fpdi = now.day
            fpme = now.month
            fpañ = now.year
            asnt = data.get('asnt', [''])[0]
            codm = data.get('codm', [''])[0]
            d_r = data.get('d_r', [''])[0]
            
            print(f"📝 Datos para solicitud:")
            print(f"   Nums: {nuevo_numero}")
            print(f"   Título: {tita}")
            print(f"   Asunto: {asnt}")
            print(f"   Mesa partes: {codm}")
            print(f"   Administrado: {d_r}")
            
            # Agregar solicitud
            datos_solicitud = (nuevo_numero, tita, estd, fpdi, fpme, fpañ, asnt, codm, d_r)
            success_solicitud = self.db.agregar_solicitud(datos_solicitud)
            
            if success_solicitud:
                # Generar expediente automáticamente
                fad = now.day
                fam = now.month
                fan = now.year
                estd_exp = 'En revision'
                aresp = 'Pendiente asignación'
                asnt_exp = f"Expediente para: {tita}"
                
                # Generar número de expediente secuencial
                ultimo_expediente = self.obtener_ultimo_expediente()
                nuevo_expediente = self.generar_numero_expediente(ultimo_expediente)
                
                datos_expediente = (nuevo_expediente, fad, fam, fan, estd_exp, aresp, asnt_exp, nuevo_numero)
                success_expediente = self.db.agregar_expediente_supabase(datos_expediente)
                
                return success_expediente, nuevo_expediente
            
            return False, None
        except Exception as e:
            print(f"❌ Error agregando solicitud: {e}")
            import traceback
            traceback.print_exc()
            return False, None

    def obtener_ultima_solicitud(self):
        """Obtener el último número de solicitud de la base de datos"""
        try:
            query = "SELECT nums FROM solicitud ORDER BY nums DESC LIMIT 1"
            resultados = self.db.execute_query(query)
            if resultados and len(resultados) > 0:
                return resultados[0]['nums']
            return None
        except Exception as e:
            print(f"❌ Error obteniendo última solicitud: {e}")
            return None

    def generar_numero_solicitud(self, ultima_solicitud):
        """Generar número de solicitud secuencial: SOL001, SOL002, etc."""
        if not ultima_solicitud or not ultima_solicitud.startswith('SOL'):
            # Si no hay solicitudes previas, empezar con SOL001
            return "SOL001"
        
        try:
            # Extraer el número de la última solicitud (ej: "SOL003" -> 3)
            ultimo_numero = int(ultima_solicitud[3:])
            nuevo_numero = ultimo_numero + 1
            return f"SOL{nuevo_numero:03d}"  # Formato: SOL001, SOL002, etc.
        except (ValueError, IndexError):
            # Si hay error en el formato, empezar desde SOL001
            return "SOL001"

    def obtener_ultimo_expediente(self):
        """Obtener el último número de expediente de la base de datos"""
        try:
            query = "SELECT nuex FROM expediente ORDER BY nuex DESC LIMIT 1"
            resultados = self.db.execute_query(query)
            if resultados and len(resultados) > 0:
                return resultados[0]['nuex']
            return None
        except Exception as e:
            print(f"❌ Error obteniendo último expediente: {e}")
            return None

    def generar_numero_expediente(self, ultimo_expediente):
        """Generar número de expediente secuencial: EXP001, EXP002, etc."""
        if not ultimo_expediente or not ultimo_expediente.startswith('EXP'):
            # Si no hay expedientes previos, empezar con EXP001
            return "EXP001"
        
        try:
            # Extraer el número del último expediente (ej: "EXP005" -> 5)
            ultimo_numero = int(ultimo_expediente[3:])
            nuevo_numero = ultimo_numero + 1
            return f"EXP{nuevo_numero:03d}"  # Formato: EXP001, EXP002, etc.
        except (ValueError, IndexError):
            # Si hay error en el formato, empezar desde EXP001
            return "EXP001"
    
    def crear_proveido(self, data):
        try:
            # DEBUG: Mostrar todos los datos recibidos
            print("📥 Datos recibidos en crear_proveido:")
            for key, value in data.items():
                print(f"   {key}: {value}")
            
            npro = f"PRO{datetime.now().strftime('%H%M%S')}"  # PRO + hora + minuto + segundo
            today = datetime.now()
            
            # Obtener datos CORREGIDOS
            ints = data.get('ints', [''])[0]
            nuex = data.get('nuex', [''])[0]
            idger = data.get('idger', [''])[0]
            nsub = data.get('nsub', [''])[0]
            
            print(f"📝 Datos procesados para proveído:")
            print(f"   NPRO: {npro}")
            print(f"   Instrucción: {ints}")
            print(f"   Expediente: {nuex}")
            print(f"   Gerencia: {idger}")
            print(f"   Subgerencia: {nsub}")
            
            params = (
                npro, today.day, today.month, today.year,
                ints, nuex, idger, nsub
            )
            
            success = self.db.agregar_proveido_supabase(params)
            return success
        except Exception as e:
            print(f"❌ Error creando proveído: {e}")
            import traceback
            traceback.print_exc()
            return False

    def crear_preresolucion(self, data):
        try:
            # DEBUG: Mostrar todos los datos recibidos
            print("📥 Datos recibidos en crear_preresolucion:")
            for key, value in data.items():
                print(f"   {key}: {value}")
            
            nupr = f"PRE{datetime.now().strftime('%H%M%S')}"  # PRE + hora + minuto + segundo
            today = datetime.now()
            
            # Obtener datos CORREGIDOS
            estd = data.get('estd', [''])[0]
            fuhe = data.get('fuhe', [''])[0]
            fude = data.get('fude', [''])[0]
            nuex = data.get('nuex', [''])[0]
            dnia = data.get('dnia', [''])[0]
            
            print(f"📝 Datos procesados para pre-resolución:")
            print(f"   NUPR: {nupr}")
            print(f"   Estado: {estd}")
            print(f"   Fundamento Hecho: {fuhe}")
            print(f"   Fundamento Derecho: {fude}")
            print(f"   Expediente: {nuex}")
            print(f"   Analista: {dnia}")
            
            params = (
                nupr, estd, fuhe, fude,
                today.day, today.month, today.year, nuex, dnia
            )
            
            success = self.db.agregar_preresolucion_supabase(params)
            return success
        except Exception as e:
            print(f"❌ Error creando pre-resolución: {e}")
            import traceback
            traceback.print_exc()
            return False
        
    def descargar_proveido(self, data):
        try:
            npro = data['npro'][0]
            proveidos = self.db.get_proveidos_supabase()
            proveido = next((p for p in proveidos if p['npro'] == npro), None)
            
            if proveido:
                contenido = f"""**GOBIERNO LOCAL**

MUNICIPALIDAD DISTRITAL DE ASILLO

**"Año del Buen Servicio al Ciudadano"**

# PROVEIDO N° {proveido['npro']}

Asillo, {proveido['fed']}/{proveido['fem']}/{proveido['fea']}

**Vistos:** Expediente N° {proveido['nuex']}

**CONSIDERANDO:**

{proveido['ints']}

Atentamente

---

Cesar W. MAMANI CUTIFACA
C.A.P. 3079
ABOGADO"""
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain; charset=utf-8')
                self.send_header('Content-Disposition', f'attachment; filename="proveido_{npro}.txt"')
                self.end_headers()
                self.wfile.write(contenido.encode('utf-8'))
            else:
                self.send_error(404, "Proveído no encontrado")
        except Exception as e:
            print(f"Error descargando proveído: {e}")
            self.send_error(500, "Error interno del servidor")
    
    def descargar_preresolucion(self, data):
        try:
            nupr = data['nupr'][0]
            preresoluciones = self.db.get_preresoluciones_supabase()
            preresolucion = next((p for p in preresoluciones if p['nupr'] == nupr), None)
            
            if preresolucion:
                contenido = f"""RESOLUCIÓN DE GERENCIA N° {preresolucion['nupr']}

Expediente: {preresolucion['nuex']}
Analista: {preresolucion['analista']}
Fecha: {preresolucion['fed']}/{preresolucion['fem']}/{preresolucion['fea']}

VISTO: El expediente {preresolucion['nuex']} y,

CONSIDERANDO:

{preresolucion['fuhe']}

{preresolucion['fude']}

RESUELVE:

ARTICULO PRIMERO. – Declarar {preresolucion['estd']} la solicitud presentada.

ARTICULO SEGUNDO. – Comunicar la presente resolución a las áreas correspondientes.

REGÍSTRESE, COMUNÍQUESE, CÚMPLASE."""
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain; charset=utf-8')
                self.send_header('Content-Disposition', f'attachment; filename="preresolucion_{nupr}.txt"')
                self.end_headers()
                self.wfile.write(contenido.encode('utf-8'))
            else:
                self.send_error(404, "Pre-Resolución no encontrada")
        except Exception as e:
            print(f"Error descargando pre-resolución: {e}")
            self.send_error(500, "Error interno del servidor")

    
    # Endpoints para actualizar registros
    def do_PUT(self):
        content_length = int(self.headers['Content-Length'])
        put_data = self.rfile.read(content_length).decode('utf-8')
        data = urllib.parse.parse_qs(put_data)
        
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path == '/actualizar_administrado':
            success = self.actualizar_administrado(data)
            self.send_json_response({'success': success})
        elif parsed_path.path == '/actualizar_solicitud':
            success = self.actualizar_solicitud(data)
            self.send_json_response({'success': success})
        elif parsed_path.path == '/actualizar_expediente':
            success = self.actualizar_expediente(data)
            self.send_json_response({'success': success})
        elif parsed_path.path == '/actualizar_proveido':
            success = self.actualizar_proveido(data)
            self.send_json_response({'success': success})
        elif parsed_path.path == '/actualizar_preresolucion':
            success = self.actualizar_preresolucion(data)
            self.send_json_response({'success': success})
        else:
            self.send_error(404)

    # Endpoints para eliminar registros  
    def do_DELETE(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path.startswith('/eliminar_administrado/'):
            d_r = parsed_path.path.split('/')[-1]
            success = self.eliminar_administrado(d_r)
            self.send_json_response({'success': success})
        elif parsed_path.path.startswith('/eliminar_solicitud/'):
            nums = parsed_path.path.split('/')[-1]
            success = self.eliminar_solicitud(nums)
            self.send_json_response({'success': success})
        elif parsed_path.path.startswith('/eliminar_expediente/'):
            nuex = parsed_path.path.split('/')[-1]
            success = self.eliminar_expediente(nuex)
            self.send_json_response({'success': success})
        elif parsed_path.path.startswith('/eliminar_proveido/'):
            npro = parsed_path.path.split('/')[-1]
            success = self.eliminar_proveido(npro)
            self.send_json_response({'success': success})
        elif parsed_path.path.startswith('/eliminar_preresolucion/'):
            nupr = parsed_path.path.split('/')[-1]
            success = self.eliminar_preresolucion(nupr)
            self.send_json_response({'success': success})
        else:
            self.send_error(404)

    # Métodos para actualizar
    def actualizar_administrado(self, data):
        try:
            d_r = data.get('d_r', [''])[0]
            noma = data.get('noma', [''])[0]
            dir_d = data.get('dir_d', [''])[0]
            dir_a = data.get('dir_a', [''])[0]
            dir_c = data.get('dir_c', [''])[0]
            dir_n = data.get('dir_n', [''])[0]
            
            nuevos_datos = (noma, dir_d, dir_a, dir_c, dir_n)
            success = self.db.actualizar_administrado(d_r, nuevos_datos)
            return success
        except Exception as e:
            print(f"❌ Error actualizando administrado: {e}")
            return False

    def actualizar_solicitud(self, data):
        try:
            nums = data.get('nums', [''])[0]
            tita = data.get('tita', [''])[0]
            estd = data.get('estd', [''])[0]
            asnt = data.get('asnt', [''])[0]
            codm = data.get('codm', [''])[0]
            d_r = data.get('d_r', [''])[0]
            
            nuevos_datos = (tita, estd, asnt, codm, d_r)
            success = self.db.actualizar_solicitud(nums, nuevos_datos)
            return success
        except Exception as e:
            print(f"❌ Error actualizando solicitud: {e}")
            return False

    def actualizar_expediente(self, data):
        try:
            nuex = data.get('nuex', [''])[0]
            estd = data.get('estd', [''])[0]
            aresp = data.get('aresp', [''])[0]
            asnt = data.get('asnt', [''])[0]
            
            nuevos_datos = (estd, aresp, asnt)
            success = self.db.actualizar_expediente(nuex, nuevos_datos)
            return success
        except Exception as e:
            print(f"❌ Error actualizando expediente: {e}")
            return False

    def actualizar_proveido(self, data):
        try:
            npro = data.get('npro', [''])[0]
            ints = data.get('ints', [''])[0]
            idger = data.get('idger', [''])[0]
            nsub = data.get('nsub', [''])[0]
            
            nuevos_datos = (ints, idger, nsub)
            success = self.db.actualizar_proveido(npro, nuevos_datos)
            return success
        except Exception as e:
            print(f"❌ Error actualizando proveído: {e}")
            return False

    def actualizar_preresolucion(self, data):
        try:
            nupr = data.get('nupr', [''])[0]
            estd = data.get('estd', [''])[0]
            fuhe = data.get('fuhe', [''])[0]
            fude = data.get('fude', [''])[0]
            dnia = data.get('dnia', [''])[0]
            
            nuevos_datos = (estd, fuhe, fude, dnia)
            success = self.db.actualizar_preresolucion(nupr, nuevos_datos)
            return success
        except Exception as e:
            print(f"❌ Error actualizando pre-resolución: {e}")
            return False

    # Métodos para eliminar
    # En handlers.py, modifica los métodos de eliminar
    def eliminar_administrado(self, d_r):
        try:
            # Usar eliminación en cascada
            success = self.db.eliminar_administrado_cascada(d_r)
            
            return {
                'success': success,
                'message': 'Administrado y todos sus registros relacionados eliminados correctamente' if success else 'Error al eliminar',
                'tipo': 'CASCADA'
            }
        except Exception as e:
            print(f"❌ Error eliminando administrado: {e}")
            return {
                'success': False,
                'error': 'EXCEPTION',
                'message': str(e)
            }
        
    # En handlers.py, agrega este endpoint
    

    def eliminar_solicitud(self, nums):
        try:
            # Usar eliminación en cascada
            success = self.db.eliminar_solicitud_cascada(nums)
            
            return {
                'success': success,
                'message': 'Solicitud y todos sus registros relacionados eliminados correctamente' if success else 'Error al eliminar',
                'tipo': 'CASCADA'
            }
        except Exception as e:
            print(f"❌ Error eliminando solicitud: {e}")
            return {
                'success': False,
                'error': 'EXCEPTION',
                'message': str(e)
            }

    def eliminar_expediente(self, nuex):
        try:
            # Usar eliminación en cascada
            success = self.db.eliminar_expediente_cascada(nuex)
            
            return {
                'success': success,
                'message': 'Expediente y todos sus registros relacionados eliminados correctamente' if success else 'Error al eliminar',
                'tipo': 'CASCADA'
            }
        except Exception as e:
            print(f"❌ Error eliminando expediente: {e}")
            return {
                'success': False,
                'error': 'EXCEPTION',
                'message': str(e)
            }

    def eliminar_proveido(self, npro):
        try:
            success = self.db.eliminar_proveido(npro)
            return success
        except Exception as e:
            print(f"❌ Error eliminando proveído: {e}")
            return False

    def eliminar_preresolucion(self, nupr):
        try:
            success = self.db.eliminar_preresolucion(nupr)
            return success
        except Exception as e:
            print(f"❌ Error eliminando pre-resolución: {e}")
            return False
