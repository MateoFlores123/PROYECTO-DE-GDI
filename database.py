# database.py - CON SINGLETON PATTERN
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys
import time
import threading
from datetime import datetime

class DatabaseManager:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseManager, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance
    
    def __init__(self):
        # Evitar inicialización múltiple
        if self._initialized:
            return
            
        self.db_type = 'postgresql'
        self.connection = None
        self._cache = {}
        self._cache_timeout = 300  # 5 minutos de caché
        self._all_data_loaded = False
        self._initialized = True
        
        self.connect()
        self.precargar_todos_los_datos()
        
    def connect(self):
        """Conectar a Render.com una sola vez"""
        try:
            print("🚀 Conectando a Render.com...")
            
            # TU CONNECTION STRING DE RENDER.COM
            DATABASE_URL = "postgresql://gdi_rhrs_user:w6eB0wOSHmT8q5f1HzpJ6IHuflhWREKQ@dpg-d4h4p81r0fns73a13mjg-a.oregon-postgres.render.com/gdi_rhrs"
            
            # Conectar usando el connection string completo
            self.connection = psycopg2.connect(
                DATABASE_URL,
                cursor_factory=RealDictCursor
            )
            
            print("✅ Conectado a Render.com correctamente")
            
        except Exception as e:
            print(f"❌ Error conectando a Render.com: {e}")
            raise

    def precargar_todos_los_datos(self):
        """Precargar TODOS los datos al inicio - UNA SOLA VEZ"""
        if self._all_data_loaded:
            print("✅ Datos ya precargados, usando caché...")
            return
            
        print("🔄 Precargando todos los datos...")
        start_time = time.time()
        
        try:
            # Precargar todo PERO SIN LIMPIAR CACHÉ EXISTENTE
            expedientes = self._cargar_expedientes()
            solicitudes = self._cargar_solicitudes()
            proveidos = self._cargar_proveidos()
            preresoluciones = self._cargar_preresoluciones()
            administrados = self._cargar_administrados()
            gerencias = self._cargar_gerencias()
            subgerencias = self._cargar_subgerencias()
            analistas = self._cargar_analistas()
            mesa_partes = self._cargar_mesa_partes()
            
            self._all_data_loaded = True
            elapsed_time = time.time() - start_time
            print(f"✅ Todos los datos precargados en {elapsed_time:.2f} segundos")
            
            # Mostrar resumen
            self.mostrar_resumen_precarga()
            
        except Exception as e:
            print(f"❌ Error en precarga: {e}")
            # Si hay error en precarga, marcar como no cargado para reintentar
            self._all_data_loaded = False

    def _cargar_expedientes(self):
        """Cargar expedientes una sola vez"""
        try:
            query = """
                SELECT nuex, fad, fam, fan, estd, aresp, asnt, nums,
                       fad || '/' || fam || '/' || fan as fecha
                FROM expediente 
                ORDER BY fan DESC, fam DESC, fad DESC
                LIMIT 500
            """
            results = self.execute_query(query)
            self._set_cached_data('expedientes', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando expedientes: {e}")
            return []

    def _cargar_solicitudes(self):
        """Cargar solicitudes una sola vez"""
        try:
            query = """
                SELECT s.nums, s.tita, s.estd, s.fpdi, s.fpme, s.fpañ, s.asnt, 
                       s.codm, s.d_r, a.noma as nombre_admin, m.resp as responsable_mesa,
                       e.nuex as expediente,
                       s.fpdi || '/' || s.fpme || '/' || s.fpañ as fecha
                FROM solicitud s
                LEFT JOIN administrado a ON s.d_r = a.d_r
                LEFT JOIN mesa_de_partes m ON s.codm = m.codm
                LEFT JOIN expediente e ON s.nums = e.nums
                ORDER BY s.fpañ DESC, s.fpme DESC, s.fpdi DESC
                LIMIT 500
            """
            results = self.execute_query(query)
            self._set_cached_data('solicitudes', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando solicitudes: {e}")
            return []

    def _cargar_proveidos(self):
        """Cargar proveídos una sola vez"""
        try:
            query = """
                SELECT npro, fed, fem, fea, ints, nuex, idger, nsub,
                       fed || '/' || fem || '/' || fea as fecha
                FROM proveido 
                ORDER BY fea DESC, fem DESC, fed DESC
                LIMIT 500
            """
            results = self.execute_query(query)
            self._set_cached_data('proveidos', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando proveídos: {e}")
            return []

    def _cargar_preresoluciones(self):
        """Cargar pre-resoluciones una sola vez"""
        try:
            query = """
                SELECT pr.nupr, pr.fed, pr.fem, pr.fea, pr.estd, pr.fuhe, pr.fude, 
                       pr.nuex, pr.dnia, a.noal as analista,
                       pr.fed || '/' || pr.fem || '/' || pr.fea as fecha
                FROM pre_resolucion pr
                LEFT JOIN analista a ON pr.dnia = a.dnia
                ORDER BY pr.fea DESC, pr.fem DESC, pr.fed DESC
                LIMIT 500
            """
            results = self.execute_query(query)
            self._set_cached_data('preresoluciones', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando pre-resoluciones: {e}")
            return []

    def _cargar_administrados(self):
        """Cargar administrados una sola vez"""
        try:
            query = "SELECT d_r, noma, dir_d, dir_a, dir_c, dir_n FROM administrado ORDER BY noma LIMIT 500"
            results = self.execute_query(query)
            self._set_cached_data('administrados', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando administrados: {e}")
            return []

    def _cargar_gerencias(self):
        try:
            query = "SELECT idger, nomg FROM gerencia ORDER BY nomg"
            results = self.execute_query(query)
            self._set_cached_data('gerencias', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando gerencias: {e}")
            return []

    def _cargar_subgerencias(self):
        try:
            query = "SELECT nsub, arsg FROM subgerencia ORDER BY arsg"
            results = self.execute_query(query)
            self._set_cached_data('subgerencias', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando subgerencias: {e}")
            return []

    def _cargar_analistas(self):
        try:
            query = "SELECT dnia, noal FROM analista ORDER BY noal"
            results = self.execute_query(query)
            self._set_cached_data('analistas', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando analistas: {e}")
            return []

    def _cargar_mesa_partes(self):
        try:
            query = "SELECT codm, resp FROM mesa_de_partes ORDER BY resp"
            results = self.execute_query(query)
            self._set_cached_data('mesa_partes', results)
            return results
        except Exception as e:
            print(f"❌ Error cargando mesa de partes: {e}")
            return []

    def mostrar_resumen_precarga(self):
        """Mostrar resumen de datos cargados"""
        expedientes = self._get_cached_data('expedientes') or []
        solicitudes = self._get_cached_data('solicitudes') or []
        proveidos = self._get_cached_data('proveidos') or []
        preresoluciones = self._get_cached_data('preresoluciones') or []
        administrados = self._get_cached_data('administrados') or []
        gerencias = self._get_cached_data('gerencias') or []
        subgerencias = self._get_cached_data('subgerencias') or []
        analistas = self._get_cached_data('analistas') or []
        mesa_partes = self._get_cached_data('mesa_partes') or []
        
        print("\n📊 RESUMEN DE DATOS PRECARGADOS:")
        print(f"   📂 Expedientes: {len(expedientes)}")
        print(f"   📄 Solicitudes: {len(solicitudes)}")
        print(f"   📋 Proveídos: {len(proveidos)}")
        print(f"   ⚖️ Pre-resoluciones: {len(preresoluciones)}")
        print(f"   👥 Administrados: {len(administrados)}")
        print(f"   🏢 Gerencias: {len(gerencias)}")
        print(f"   🏛️ Subgerencias: {len(subgerencias)}")
        print(f"   👤 Analistas: {len(analistas)}")
        print(f"   📦 Mesa de partes: {len(mesa_partes)}")
        print()

    def _get_cached_data(self, key):
        """Obtener datos del caché - VERSIÓN CORREGIDA"""
        with self._lock:
            if key in self._cache:
                data, timestamp = self._cache[key]
                # Siempre devolver los datos si existen, ignorar timeout temporalmente
                if data is not None:
                    print(f"✅ [CACHE] {key}: {len(data)} registros desde caché")
                    return data
                else:
                    print(f"⚠️ [CACHE] {key}: datos son None")
            else:
                print(f"❌ [CACHE] {key}: no encontrado en caché")
            return None
        
    def recargar_todos_los_datos(self):
        """Forzar recarga completa de todos los datos"""
        print("🔄 FORZANDO RECARGA COMPLETA DE DATOS...")
        
        with self._lock:
            # Limpiar caché completamente
            self._cache = {}
            self._all_data_loaded = False
        
        # Recargar todo
        self.precargar_todos_los_datos()
        print("✅ Recarga completa terminada")
            
    def _recargar_datos_expirados(self, key):
        """Recargar datos específicos cuando expiran"""
        try:
            if key == 'expedientes':
                data = self._cargar_expedientes()
            elif key == 'solicitudes':
                data = self._cargar_solicitudes()
            elif key == 'proveidos':
                data = self._cargar_proveidos()
            elif key == 'preresoluciones':
                data = self._cargar_preresoluciones()
            elif key == 'administrados':
                data = self._cargar_administrados()
            elif key == 'gerencias':
                data = self._cargar_gerencias()
            elif key == 'subgerencias':
                data = self._cargar_subgerencias()
            elif key == 'analistas':
                data = self._cargar_analistas()
            elif key == 'mesa_partes':
                data = self._cargar_mesa_partes()
            else:
                data = []
            
            self._set_cached_data(key, data)
            print(f"✅ {key} recargados: {len(data)} registros")
        except Exception as e:
            print(f"❌ Error recargando {key}: {e}")

    def _set_cached_data(self, key, data):
        """Guardar datos en caché"""
        with self._lock:
            self._cache[key] = (data, time.time())

    def clear_cache(self):
        """Limpiar caché de forma selectiva después de inserciones"""
        with self._lock:
            # Mantener los datos en caché pero marcar como necesitando actualización
            # No limpiar todo, solo forzar recarga en el próximo acceso
            for key in list(self._cache.keys()):
                # Mantener el timestamp muy viejo para forzar recarga
                if key in self._cache:
                    data, _ = self._cache[key]
                    self._cache[key] = (data, 0)  # timestamp 0 = necesita recarga
        
        print("🔄 Caché marcado para recarga...")

    # MÉTODOS PARA OBTENER DATOS - SOLO CACHÉ
    def get_expedientes_supabase(self):
        """Método corregido para expedientes"""
        try:
            print("🔄 [DB] Solicitando expedientes...")
            data = self._get_cached_data('expedientes')
            
            if data is None:
                print("⚠️ [DB] Cache vacío, recargando expedientes...")
                data = self._cargar_expedientes()
                
            print(f"✅ [DB] Expedientes devueltos: {len(data) if data else 0} registros")
            return data or []  # Asegurar que siempre devuelve lista
            
        except Exception as e:
            print(f"❌ [DB] Error en get_expedientes_supabase: {e}")
            return []

    def get_solicitudes_supabase(self):
        return self._get_cached_data('solicitudes') or []

    def get_proveidos_supabase(self):
        return self._get_cached_data('proveidos') or []

    def get_preresoluciones_supabase(self):
        return self._get_cached_data('preresoluciones') or []

    def get_administrados_supabase(self):
        try:
            print("🔄 [DB] Solicitando administrados...")
            data = self._get_cached_data('administrados')
            
            if data is None:
                print("⚠️ [DB] Cache vacío, recargando administrados...")
                data = self._cargar_administrados()
                
            print(f"✅ [DB] Administrados devueltos: {len(data) if data else 0} registros")
            return data or []
            
        except Exception as e:
            print(f"❌ [DB] Error en get_administrados_supabase: {e}")
            return []

    def get_gerencias_supabase(self):
        return self._get_cached_data('gerencias') or []

    def get_subgerencias_supabase(self):
        return self._get_cached_data('subgerencias') or []

    def get_analistas_supabase(self):
        return self._get_cached_data('analistas') or []

    def get_mesa_partes_supabase(self):
        return self._get_cached_data('mesa_partes') or []

    # MÉTODOS DE COMPATIBILIDAD
    def execute_query(self, query, params=None):
        """Ejecutar consulta SELECT"""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params or ())
                results = cursor.fetchall()
                return [dict(row) for row in results]
        except Exception as e:
            print(f"❌ Error en consulta SQL: {e}")
            return []

    def execute_update(self, query, params=None):
        """Ejecutar INSERT, UPDATE, DELETE"""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params or ())
                self.connection.commit()
                # Limpiar caché después de actualizaciones
                self.actualizar_cache_selectivo()
                return True
        except Exception as e:
            print(f"❌ Error en actualización: {e}")
            self.connection.rollback()
            return False

    def actualizar_cache_selectivo(self):
        """Actualizar solo las tablas afectadas por inserciones"""
        print("🔄 Actualizando caché de forma selectiva...")
        
        # No limpiar todo, solo recargar datos esenciales
        try:
            nuevos_proveidos = self._cargar_proveidos()
            self._set_cached_data('proveidos', nuevos_proveidos)
            print(f"✅ Proveídos actualizados: {len(nuevos_proveidos)} registros")
            
            nuevas_preresoluciones = self._cargar_preresoluciones()
            self._set_cached_data('preresoluciones', nuevas_preresoluciones)
            print(f"✅ Pre-resoluciones actualizadas: {len(nuevas_preresoluciones)} registros")
            
            # Recargar administrados si es necesario
            if 'administrados' in self._cache:
                nuevos_administrados = self._cargar_administrados()
                self._set_cached_data('administrados', nuevos_administrados)
                print(f"✅ Administrados actualizados: {len(nuevos_administrados)}")
            
            # Recargar solicitudes si es necesario  
            if 'solicitudes' in self._cache:
                nuevas_solicitudes = self._cargar_solicitudes()
                self._set_cached_data('solicitudes', nuevas_solicitudes)
                print(f"✅ Solicitudes actualizadas: {len(nuevas_solicitudes)}")
                
            # Recargar expedientes si es necesario
            if 'expedientes' in self._cache:
                nuevos_expedientes = self._cargar_expedientes()
                self._set_cached_data('expedientes', nuevos_expedientes)
                print(f"✅ Expedientes actualizados: {len(nuevos_expedientes)}")
                
        except Exception as e:
            print(f"⚠️ Error en actualización selectiva: {e}")
            
    # MÉTODOS PARA AGREGAR DATOS (igual que antes)
    def agregar_administrado_supabase(self, datos):
        try:
            d_r, noma, dir_d, dir_a, dir_c, dir_n = datos
            query = "INSERT INTO administrado (d_r, noma, dir_d, dir_a, dir_c, dir_n) VALUES (%s, %s, %s, %s, %s, %s)"
            success = self.execute_update(query, datos)
            if success:
                # Actualizar solo administrados
                nuevos_administrados = self._cargar_administrados()
                self._set_cached_data('administrados', nuevos_administrados)
            return success
        except Exception as e:
            print(f"❌ Error agregando administrado: {e}")
            return False

    def agregar_solicitud_supabase(self, datos):
        try:
            nums, tita, estd, fpdi, fpme, fpañ, asnt, codm, d_r = datos
            
            print(f"📋 Insertando solicitud en BD:")
            print(f"   nums: {nums} (longitud: {len(nums)})")
            print(f"   tita: {tita}")
            print(f"   asnt: {asnt[:50]}...")  # Mostrar solo primeros 50 chars
            
            query = """
                INSERT INTO solicitud (nums, tita, estd, fpdi, fpme, fpañ, asnt, codm, d_r) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            success = self.execute_update(query, datos)
            
            if success:
                print("✅ Solicitud agregada correctamente a la BD")
                # Actualizar solo solicitudes en caché
                nuevas_solicitudes = self._cargar_solicitudes()
                self._set_cached_data('solicitudes', nuevas_solicitudes)
            else:
                print("❌ Error al agregar solicitud en la BD")
                
            return success
        except Exception as e:
            print(f"❌ Error agregando solicitud: {e}")
            import traceback
            traceback.print_exc()
            return False

    def agregar_expediente_supabase(self, datos):
        try:
            nuex, fad, fam, fan, estd, aresp, asnt, nums = datos
            query = "INSERT INTO expediente (nuex, fad, fam, fan, estd, aresp, asnt, nums) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            return self.execute_update(query, datos)
        except Exception as e:
            print(f"❌ Error agregando expediente: {e}")
            return False

    def agregar_proveido_supabase(self, datos):
        try:
            npro, fed, fem, fea, ints, nuex, idger, nsub = datos
            query = """
                INSERT INTO proveido (npro, fed, fem, fea, ints, nuex, idger, nsub) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            success = self.execute_update(query, datos)
            if success:
                print("✅ Proveído agregado correctamente a la BD")
                # Forzar actualización del caché
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error agregando proveído: {e}")
            return False

    def agregar_preresolucion_supabase(self, datos):
        try:
            nupr, estd, fuhe, fude, fed, fem, fea, nuex, dnia = datos
            query = """
                INSERT INTO pre_resolucion (nupr, estd, fuhe, fude, fed, fem, fea, nuex, dnia) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            success = self.execute_update(query, datos)
            if success:
                print("✅ Pre-resolución agregada correctamente a la BD")
                # Forzar actualización del caché
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error agregando pre-resolución: {e}")
            return False

    def agregar_administrado(self, datos):
        return self.agregar_administrado_supabase(datos)

    def agregar_solicitud(self, datos):
        return self.agregar_solicitud_supabase(datos)

    def generar_expediente(self, nums, datos_expediente):
        try:
            fad, fam, fan, estd, aresp, asnt = datos_expediente
            nuex = f"EXP{fan:04d}{fam:02d}{fad:02d}_{nums}"
            datos = (nuex, fad, fam, fan, estd, aresp, asnt, nums)
            success = self.agregar_expediente_supabase(datos)
            return success, nuex
        except Exception as e:
            print(f"❌ Error generando expediente: {e}")
            return False, None

    # MÉTODOS GET PARA COMPATIBILIDAD
    def get_expedientes(self): return self.get_expedientes_supabase()
    def get_gerencias(self): return self.get_gerencias_supabase()
    def get_subgerencias(self): return self.get_subgerencias_supabase()
    def get_analistas(self): return self.get_analistas_supabase()
    def get_proveidos(self): return self.get_proveidos_supabase()
    def get_preresoluciones(self): return self.get_preresoluciones_supabase()
    def get_administrados(self): return self.get_administrados_supabase()
    def get_mesa_partes(self): return self.get_mesa_partes_supabase()
    def get_solicitudes(self): return self.get_solicitudes_supabase()

    # MÉTODOS PARA ACTUALIZAR REGISTROS
    def actualizar_administrado(self, d_r, nuevos_datos):
        try:
            noma, dir_d, dir_a, dir_c, dir_n = nuevos_datos
            query = """
                UPDATE administrado 
                SET noma = %s, dir_d = %s, dir_a = %s, dir_c = %s, dir_n = %s 
                WHERE d_r = %s
            """
            success = self.execute_update(query, (noma, dir_d, dir_a, dir_c, dir_n, d_r))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error actualizando administrado: {e}")
            return False

    def actualizar_solicitud(self, nums, nuevos_datos):
        try:
            tita, estd, asnt, codm, d_r = nuevos_datos
            query = """
                UPDATE solicitud 
                SET tita = %s, estd = %s, asnt = %s, codm = %s, d_r = %s 
                WHERE nums = %s
            """
            success = self.execute_update(query, (tita, estd, asnt, codm, d_r, nums))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error actualizando solicitud: {e}")
            return False

    def actualizar_expediente(self, nuex, nuevos_datos):
        try:
            estd, aresp, asnt = nuevos_datos
            query = """
                UPDATE expediente 
                SET estd = %s, aresp = %s, asnt = %s 
                WHERE nuex = %s
            """
            success = self.execute_update(query, (estd, aresp, asnt, nuex))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error actualizando expediente: {e}")
            return False

    def actualizar_proveido(self, npro, nuevos_datos):
        try:
            ints, idger, nsub = nuevos_datos
            query = """
                UPDATE proveido 
                SET ints = %s, idger = %s, nsub = %s 
                WHERE npro = %s
            """
            success = self.execute_update(query, (ints, idger, nsub, npro))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error actualizando proveído: {e}")
            return False

    def actualizar_preresolucion(self, nupr, nuevos_datos):
        try:
            estd, fuhe, fude, dnia = nuevos_datos
            query = """
                UPDATE pre_resolucion 
                SET estd = %s, fuhe = %s, fude = %s, dnia = %s 
                WHERE nupr = %s
            """
            success = self.execute_update(query, (estd, fuhe, fude, dnia, nupr))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error actualizando pre-resolución: {e}")
            return False
    
    # Agrega estos métodos en database.py antes de los métodos de eliminación

    def verificar_dependencias_administrado(self, d_r):
        """Verificar si el administrado tiene registros relacionados"""
        try:
            # Verificar solicitudes
            query_solicitudes = "SELECT COUNT(*) as count FROM solicitud WHERE d_r = %s"
            solicitudes = self.execute_query(query_solicitudes, (d_r,))
            count_solicitudes = solicitudes[0]['count'] if solicitudes else 0
            
            return {
                'solicitudes': count_solicitudes,
                'puede_eliminar': count_solicitudes == 0,
                'mensaje': f'Tiene {count_solicitudes} solicitud(es) asociada(s)' if count_solicitudes > 0 else 'Puede ser eliminado'
            }
        except Exception as e:
            print(f"❌ Error verificando dependencias: {e}")
            return {'solicitudes': 0, 'puede_eliminar': False, 'mensaje': f'Error: {e}'}

    def verificar_dependencias_solicitud(self, nums):
        """Verificar si la solicitud tiene registros relacionados"""
        try:
            # Verificar expedientes
            query_expedientes = "SELECT COUNT(*) as count FROM expediente WHERE nums = %s"
            expedientes = self.execute_query(query_expedientes, (nums,))
            count_expedientes = expedientes[0]['count'] if expedientes else 0
            
            return {
                'expedientes': count_expedientes,
                'puede_eliminar': count_expedientes == 0,
                'mensaje': f'Tiene {count_expedientes} expediente(s) asociado(s)' if count_expedientes > 0 else 'Puede ser eliminada'
            }
        except Exception as e:
            print(f"❌ Error verificando dependencias: {e}")
            return {'expedientes': 0, 'puede_eliminar': False, 'mensaje': f'Error: {e}'}

    def verificar_dependencias_expediente(self, nuex):
        """Verificar si el expediente tiene registros relacionados"""
        try:
            # Verificar proveídos
            query_proveidos = "SELECT COUNT(*) as count FROM proveido WHERE nuex = %s"
            proveidos = self.execute_query(query_proveidos, (nuex,))
            count_proveidos = proveidos[0]['count'] if proveidos else 0
            
            # Verificar pre-resoluciones
            query_preresoluciones = "SELECT COUNT(*) as count FROM pre_resolucion WHERE nuex = %s"
            preresoluciones = self.execute_query(query_preresoluciones, (nuex,))
            count_preresoluciones = preresoluciones[0]['count'] if preresoluciones else 0
            
            total = count_proveidos + count_preresoluciones
            
            return {
                'proveidos': count_proveidos,
                'preresoluciones': count_preresoluciones,
                'puede_eliminar': total == 0,
                'mensaje': f'Tiene {count_proveidos} proveído(s) y {count_preresoluciones} pre-resolución(es) asociados' if total > 0 else 'Puede ser eliminado'
            }
        except Exception as e:
            print(f"❌ Error verificando dependencias: {e}")
            return {'proveidos': 0, 'preresoluciones': 0, 'puede_eliminar': False, 'mensaje': f'Error: {e}'}

    # MÉTODOS PARA ELIMINAR REGISTROS
    def eliminar_administrado(self, d_r):
        try:
            query = "DELETE FROM administrado WHERE d_r = %s"
            success = self.execute_update(query, (d_r,))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error eliminando administrado: {e}")
            return False

    def eliminar_solicitud(self, nums):
        try:
            query = "DELETE FROM solicitud WHERE nums = %s"
            success = self.execute_update(query, (nums,))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error eliminando solicitud: {e}")
            return False

    def eliminar_expediente(self, nuex):
        try:
            query = "DELETE FROM expediente WHERE nuex = %s"
            success = self.execute_update(query, (nuex,))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error eliminando expediente: {e}")
            return False


    # MÉTODOS PARA OBTENER UN SOLO REGISTRO
    def obtener_administrado(self, d_r):
        try:
            query = "SELECT * FROM administrado WHERE d_r = %s"
            resultados = self.execute_query(query, (d_r,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo administrado: {e}")
            return None

    def obtener_solicitud(self, nums):
        try:
            query = "SELECT * FROM solicitud WHERE nums = %s"
            resultados = self.execute_query(query, (nums,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo solicitud: {e}")
            return None

    def obtener_expediente(self, nuex):
        try:
            query = "SELECT * FROM expediente WHERE nuex = %s"
            resultados = self.execute_query(query, (nuex,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo expediente: {e}")
            return None

    def obtener_proveido(self, npro):
        try:
            query = "SELECT * FROM proveido WHERE npro = %s"
            resultados = self.execute_query(query, (npro,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo proveído: {e}")
            return None

    def obtener_preresolucion(self, nupr):
        try:
            query = "SELECT * FROM pre_resolucion WHERE nupr = %s"
            resultados = self.execute_query(query, (nupr,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo pre-resolución: {e}")
            return None
    
    # MÉTODOS MEJORADOS PARA ELIMINACIÓN EN CASCADA
    def eliminar_administrado_cascada(self, d_r):
        """Eliminar administrado y todos sus registros relacionados"""
        try:
            print(f"🔧 Iniciando eliminación en cascada para administrado: {d_r}")
            
            # 1. Primero obtener todas las solicitudes de este administrado
            query_solicitudes = "SELECT nums FROM solicitud WHERE d_r = %s"
            solicitudes = self.execute_query(query_solicitudes, (d_r,))
            print(f"📋 Encontradas {len(solicitudes)} solicitudes para eliminar")
            
            # 2. Para cada solicitud, eliminar en cascada
            for solicitud in solicitudes:
                self.eliminar_solicitud_cascada(solicitud['nums'])
            
            # 3. Finalmente eliminar el administrado
            query = "DELETE FROM administrado WHERE d_r = %s"
            success = self.execute_update(query, (d_r,))
            
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Administrado {d_r} eliminado en cascada correctamente")
            else:
                print(f"❌ Error eliminando administrado {d_r}")
            
            return success
        except Exception as e:
            print(f"❌ Error en eliminación en cascada de administrado: {e}")
            import traceback
            traceback.print_exc()
            return False

    def eliminar_solicitud_cascada(self, nums):
        """Eliminar solicitud y todos sus registros relacionados"""
        try:
            print(f"🔧 Iniciando eliminación en cascada para solicitud: {nums}")
            
            # 1. Primero eliminar el expediente relacionado (si existe)
            query_expediente = "SELECT nuex FROM expediente WHERE nums = %s"
            expedientes = self.execute_query(query_expediente, (nums,))
            print(f"📁 Encontrados {len(expedientes)} expedientes para eliminar")
            
            for expediente in expedientes:
                self.eliminar_expediente_cascada(expediente['nuex'])
            
            # 2. Eliminar la solicitud
            query = "DELETE FROM solicitud WHERE nums = %s"
            success = self.execute_update(query, (nums,))
            
            if success:
                print(f"✅ Solicitud {nums} eliminada en cascada correctamente")
            else:
                print(f"❌ Error eliminando solicitud {nums}")
            
            return success
        except Exception as e:
            print(f"❌ Error en eliminación en cascada de solicitud: {e}")
            import traceback
            traceback.print_exc()
            return False

    def eliminar_expediente_cascada(self, nuex):
        """Eliminar expediente y todos sus registros relacionados"""
        try:
            print(f"🔧 Iniciando eliminación en cascada para expediente: {nuex}")
            
            # 1. Primero eliminar proveídos relacionados
            query_proveidos = "DELETE FROM proveido WHERE nuex = %s"
            result_proveidos = self.execute_update(query_proveidos, (nuex,))
            print(f"📋 Proveídos eliminados: {result_proveidos}")
            
            # 2. Eliminar pre-resoluciones relacionadas
            query_preresoluciones = "DELETE FROM pre_resolucion WHERE nuex = %s"
            result_preresoluciones = self.execute_update(query_preresoluciones, (nuex,))
            print(f"⚖️ Pre-resoluciones eliminadas: {result_preresoluciones}")
            
            # 3. Finalmente eliminar el expediente
            query = "DELETE FROM expediente WHERE nuex = %s"
            success = self.execute_update(query, (nuex,))
            
            if success:
                print(f"✅ Expediente {nuex} eliminado en cascada correctamente")
                self.actualizar_cache_selectivo()
            else:
                print(f"❌ Error eliminando expediente {nuex}")
            
            return success
        except Exception as e:
            print(f"❌ Error en eliminación en cascada de expediente: {e}")
            import traceback
            traceback.print_exc()
            return False
        
    def eliminar_proveido(self, npro):
        """Eliminar proveído (no tiene dependencias)"""
        try:
            query = "DELETE FROM proveido WHERE npro = %s"
            success = self.execute_update(query, (npro,))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error eliminando proveído: {e}")
            return False

    def eliminar_preresolucion(self, nupr):
        """Eliminar pre-resolución (no tiene dependencias)"""
        try:
            query = "DELETE FROM pre_resolucion WHERE nupr = %s"
            success = self.execute_update(query, (nupr,))
            if success:
                self.actualizar_cache_selectivo()
            return success
        except Exception as e:
            print(f"❌ Error eliminando pre-resolución: {e}")
            return False
    
    # MÉTODOS PARA OBTENER REGISTROS INDIVIDUALES - COMPLETOS
    def obtener_administrado_por_id(self, d_r):
        """Obtener un administrado específico por DNI/RUC"""
        try:
            query = "SELECT * FROM administrado WHERE d_r = %s"
            resultados = self.execute_query(query, (d_r,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo administrado: {e}")
            return None

    def obtener_solicitud_por_id(self, nums):
        """Obtener una solicitud específica por número"""
        try:
            query = """
                SELECT s.*, a.noma as nombre_admin, m.resp as responsable_mesa
                FROM solicitud s
                LEFT JOIN administrado a ON s.d_r = a.d_r
                LEFT JOIN mesa_de_partes m ON s.codm = m.codm
                WHERE s.nums = %s
            """
            resultados = self.execute_query(query, (nums,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo solicitud: {e}")
            return None

    def obtener_expediente_por_id(self, nuex):
        """Obtener un expediente específico por número"""
        try:
            query = """
                SELECT e.*, s.tita as titulo_solicitud
                FROM expediente e
                LEFT JOIN solicitud s ON e.nums = s.nums
                WHERE e.nuex = %s
            """
            resultados = self.execute_query(query, (nuex,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo expediente: {e}")
            return None

    def obtener_proveido_por_id(self, npro):
        """Obtener un proveído específico por número"""
        try:
            query = """
                SELECT p.*, g.nomg as nombre_gerencia, s.arsg as nombre_subgerencia
                FROM proveido p
                LEFT JOIN gerencia g ON p.idger = g.idger
                LEFT JOIN subgerencia s ON p.nsub = s.nsub
                WHERE p.npro = %s
            """
            resultados = self.execute_query(query, (npro,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo proveído: {e}")
            return None

    def obtener_preresolucion_por_id(self, nupr):
        """Obtener una pre-resolución específica por número"""
        try:
            query = """
                SELECT pr.*, a.noal as nombre_analista
                FROM pre_resolucion pr
                LEFT JOIN analista a ON pr.dnia = a.dnia
                WHERE pr.nupr = %s
            """
            resultados = self.execute_query(query, (nupr,))
            return resultados[0] if resultados else None
        except Exception as e:
            print(f"❌ Error obteniendo pre-resolución: {e}")
            return None

    # MÉTODOS PARA ACTUALIZAR REGISTROS - MEJORADOS
    def actualizar_administrado(self, d_r, nuevos_datos):
        """Actualizar administrado (no permite cambiar DNI/RUC - PK)"""
        try:
            noma, dir_d, dir_a, dir_c, dir_n = nuevos_datos
            query = """
                UPDATE administrado 
                SET noma = %s, dir_d = %s, dir_a = %s, dir_c = %s, dir_n = %s 
                WHERE d_r = %s
            """
            success = self.execute_update(query, (noma, dir_d, dir_a, dir_c, dir_n, d_r))
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Administrado {d_r} actualizado correctamente")
            return success
        except Exception as e:
            print(f"❌ Error actualizando administrado: {e}")
            return False

    def actualizar_solicitud(self, nums, nuevos_datos):
        """Actualizar solicitud (no permite cambiar número - PK)"""
        try:
            tita, estd, asnt, codm, d_r = nuevos_datos
            query = """
                UPDATE solicitud 
                SET tita = %s, estd = %s, asnt = %s, codm = %s, d_r = %s 
                WHERE nums = %s
            """
            success = self.execute_update(query, (tita, estd, asnt, codm, d_r, nums))
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Solicitud {nums} actualizada correctamente")
            return success
        except Exception as e:
            print(f"❌ Error actualizando solicitud: {e}")
            return False

    def actualizar_expediente(self, nuex, nuevos_datos):
        """Actualizar expediente (no permite cambiar número - PK)"""
        try:
            estd, aresp, asnt = nuevos_datos
            query = """
                UPDATE expediente 
                SET estd = %s, aresp = %s, asnt = %s 
                WHERE nuex = %s
            """
            success = self.execute_update(query, (estd, aresp, asnt, nuex))
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Expediente {nuex} actualizado correctamente")
            return success
        except Exception as e:
            print(f"❌ Error actualizando expediente: {e}")
            return False

    def actualizar_proveido(self, npro, nuevos_datos):
        """Actualizar proveído (no permite cambiar número - PK)"""
        try:
            ints, idger, nsub = nuevos_datos
            query = """
                UPDATE proveido 
                SET ints = %s, idger = %s, nsub = %s 
                WHERE npro = %s
            """
            success = self.execute_update(query, (ints, idger, nsub, npro))
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Proveído {npro} actualizado correctamente")
            return success
        except Exception as e:
            print(f"❌ Error actualizando proveído: {e}")
            return False

    def actualizar_preresolucion(self, nupr, nuevos_datos):
        """Actualizar pre-resolución (no permite cambiar número - PK)"""
        try:
            estd, fuhe, fude, dnia = nuevos_datos
            query = """
                UPDATE pre_resolucion 
                SET estd = %s, fuhe = %s, fude = %s, dnia = %s 
                WHERE nupr = %s
            """
            success = self.execute_update(query, (estd, fuhe, fude, dnia, nupr))
            if success:
                self.actualizar_cache_selectivo()
                print(f"✅ Pre-resolución {nupr} actualizada correctamente")
            return success
        except Exception as e:
            print(f"❌ Error actualizando pre-resolución: {e}")
        return False
