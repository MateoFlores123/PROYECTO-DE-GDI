# models.py - VERSIÓN OPTIMIZADA
import re
import time
from collections import defaultdict

class ConsultasManager:
    def __init__(self, db):
        self.db = db
        self._datos_cargados = False
        self._datos_combinados = {}
        
    def _cargar_datos_combinados(self):
        """Cargar todos los datos necesarios una sola vez"""
        if self._datos_cargados:
            return self._datos_combinados
            
        start_time = time.time()
        print("🔄 Cargando datos combinados para consultas...")
        
        # Cargar todos los datos necesarios en una sola operación
        self._datos_combinados = {
            'preresoluciones': self.db.get_preresoluciones_supabase(),
            'solicitudes': self.db.get_solicitudes_supabase(),
            'analistas': self.db.get_analistas_supabase(),
            'proveidos': self.db.get_proveidos_supabase(),
            'gerencias': self.db.get_gerencias_supabase(),
            'expedientes': self.db.get_expedientes_supabase(),
            'administrados': self.db.get_administrados_supabase(),
            'mesa_partes': self.db.get_mesa_partes_supabase()
        }
        
        self._datos_cargados = True
        print(f"✅ Datos combinados cargados en {time.time() - start_time:.2f}s")
        return self._datos_combinados

    def get_fecha_preresolucion_numero(self):
        """SELECT nupr, fed || '/' || fem || '/' || fea as fecha FROM pre_Resolucion"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            
            resultados = []
            for pr in preresoluciones[:500]:  # Limitar a 500 resultados
                resultados.append({
                    'nupr': pr.get('nupr', ''),
                    'fecha': pr.get('fecha', '')
                })
            return resultados
        except Exception as e:
            print(f"Error en consulta fecha_preresolucion_numero: {e}")
            return []

    def get_encargados_fecha_preresolucion(self):
        """SELECT pr.nupr, a.noal as analista, pr.fed || '/' || pr.fem || '/' || pr.fea as fecha"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            
            resultados = []
            for pr in preresoluciones[:500]:
                resultados.append({
                    'nupr': pr.get('nupr', ''),
                    'analista': pr.get('analista', 'No asignado'),
                    'fecha': pr.get('fecha', '')
                })
            return resultados
        except Exception as e:
            print(f"Error en consulta encargados_fecha_preresolucion: {e}")
            return []

    def get_fecha_mesa_partes_solicitud(self):
        """SELECT s.nums, s.fpdi || '/' || s.fpme || '/' || s.fpañ as fecha_ingreso, m.resp"""
        try:
            datos = self._cargar_datos_combinados()
            solicitudes = datos['solicitudes']
            
            resultados = []
            for sol in solicitudes[:500]:
                resultados.append({
                    'nums': sol.get('nums', ''),
                    'fecha_ingreso': sol.get('fecha', ''),
                    'resp': sol.get('responsable_mesa', '')
                })
            return resultados
        except Exception as e:
            print(f"Error en consulta fecha_mesa_partes_solicitud: {e}")
            return []

    def get_preresolucion_ordenada_fecha_solicitud(self):
        """Pre-resoluciones ordenadas por fecha de solicitud"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            solicitudes = datos['solicitudes']
            
            # Crear diccionario de expedientes a solicitudes
            expediente_a_solicitud = {}
            for sol in solicitudes:
                if sol.get('expediente'):
                    expediente_a_solicitud[sol['expediente']] = sol
            
            resultados = []
            for pr in preresoluciones[:500]:
                expediente = pr.get('nuex', '')
                solicitud = expediente_a_solicitud.get(expediente, {})
                
                resultados.append({
                    'nupr': pr.get('nupr', ''),
                    'fecha_solicitud': f"{solicitud.get('fpdi', '')}/{solicitud.get('fpme', '')}/{solicitud.get('fpañ', '')}",
                    'estd': pr.get('estd', '')
                })
            
            # Ordenar por fecha de solicitud (más reciente primero)
            resultados.sort(key=lambda x: (
                int(x['fecha_solicitud'].split('/')[2] if x['fecha_solicitud'].count('/') == 2 else 0),
                int(x['fecha_solicitud'].split('/')[1] if x['fecha_solicitud'].count('/') == 2 else 0),
                int(x['fecha_solicitud'].split('/')[0] if x['fecha_solicitud'].count('/') == 2 else 0)
            ), reverse=True)
            
            return resultados
        except Exception as e:
            print(f"Error en consulta preresolucion_ordenada_fecha_solicitud: {e}")
            return []

    def get_preresoluciones_con_gerencia(self):
        """Pre-resoluciones con información de gerencia"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            proveidos = datos['proveidos']
            gerencias = datos['gerencias']
            
            # Crear diccionarios
            proveido_dict = {p['nuex']: p for p in proveidos if p.get('nuex')}
            gerencia_dict = {g['idger']: g['nomg'] for g in gerencias}
            
            resultados = []
            for pr in preresoluciones[:500]:
                expediente = pr.get('nuex', '')
                proveido = proveido_dict.get(expediente, {})
                id_gerencia = proveido.get('idger')
                gerencia_nombre = gerencia_dict.get(id_gerencia, 'No asignada')
                
                if gerencia_nombre != 'No asignada':
                    resultados.append({
                        'nupr': pr.get('nupr', ''),
                        'gerencia': gerencia_nombre,
                        'estd': pr.get('estd', '')
                    })
            
            return resultados
        except Exception as e:
            print(f"Error en consulta preresoluciones_con_gerencia: {e}")
            return []

    def get_solicitudes_estado_analista(self):
        """Solicitudes con estado y analista"""
        try:
            datos = self._cargar_datos_combinados()
            solicitudes = datos['solicitudes']
            preresoluciones = datos['preresoluciones']
            analistas = datos['analistas']
            
            # Crear diccionarios
            expediente_a_pr = {pr['nuex']: pr for pr in preresoluciones if pr.get('nuex')}
            analista_dict = {a['dnia']: a['noal'] for a in analistas}
            
            resultados = []
            for sol in solicitudes[:500]:
                expediente = sol.get('expediente', '')
                pr = expediente_a_pr.get(expediente, {})
                analista_nombre = analista_dict.get(pr.get('dnia', ''), 'No asignado')
                
                resultados.append({
                    'nums': sol.get('nums', ''),
                    'tita': sol.get('tita', ''),
                    'estado': 'Activa' if sol.get('estd') else 'Inactiva',
                    'nuex': expediente,
                    'analista': analista_nombre
                })
            
            return resultados
        except Exception as e:
            print(f"Error en consulta solicitudes_estado_analista: {e}")
            return []

    def get_solicitudes_por_mesa_partes(self):
        """Cantidad de solicitudes por mesa de partes"""
        try:
            datos = self._cargar_datos_combinados()
            solicitudes = datos['solicitudes']
            mesa_partes = datos['mesa_partes']
            
            # Crear diccionario de mesas
            mesa_dict = {mp['codm']: mp['resp'] for mp in mesa_partes}
            
            # Contar solicitudes por mesa
            contador = defaultdict(int)
            for sol in solicitudes:
                codm = sol.get('codm')
                if codm:
                    responsable = mesa_dict.get(codm, f'Mesa {codm}')
                    contador[responsable] += 1
            
            # Convertir a formato de resultados
            resultados = [{'resp': resp, 'cantidad_solicitudes': count} 
                         for resp, count in contador.items()]
            
            # Ordenar por cantidad descendente
            resultados.sort(key=lambda x: x['cantidad_solicitudes'], reverse=True)
            
            return resultados[:100]  # Limitar a 100 resultados
        except Exception as e:
            print(f"Error en consulta solicitudes_por_mesa_partes: {e}")
            return []

    def get_preresoluciones_por_normativa(self):
        """Pre-resoluciones por normativa (simplificado)"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            
            # Esta consulta asume que no hay tabla de normativas en Supabase
            # Retornamos datos básicos
            resultados = []
            for pr in preresoluciones[:500]:
                resultados.append({
                    'nupr': pr.get('nupr', ''),
                    'normativa': 'Normativa General',  # Placeholder
                    'estd': pr.get('estd', '')
                })
            
            return resultados
        except Exception as e:
            print(f"Error en consulta preresoluciones_por_normativa: {e}")
            return []

    def get_preresoluciones_por_mes_anio(self):
        """Pre-resoluciones agrupadas por mes y año"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            
            # Agrupar por mes y año
            contador = defaultdict(int)
            for pr in preresoluciones:
                mes = pr.get('fem', 0)
                anio = pr.get('fea', 0)
                if mes and anio:
                    contador[(mes, anio)] += 1
            
            # Convertir a resultados
            resultados = []
            for (mes, anio), cantidad in contador.items():
                resultados.append({
                    'mes': mes,
                    'año': anio,
                    'cantidad': cantidad
                })
            
            # Ordenar por año y mes descendente
            resultados.sort(key=lambda x: (x['año'], x['mes']), reverse=True)
            
            return resultados[:100]  # Limitar a 100 resultados
        except Exception as e:
            print(f"Error en consulta preresoluciones_por_mes_anio: {e}")
            return []

    def get_preresoluciones_pendientes_por_analista(self):
        """Pre-resoluciones pendientes por analista"""
        try:
            datos = self._cargar_datos_combinados()
            preresoluciones = datos['preresoluciones']
            analistas = datos['analistas']
            
            # Crear diccionario de analistas
            analista_dict = {a['dnia']: a['noal'] for a in analistas}
            
            # Contar pendientes por analista
            contador = defaultdict(int)
            for pr in preresoluciones:
                if pr.get('estd', '').lower() == 'pendiente':
                    dnia = pr.get('dnia', '')
                    if dnia:
                        analista_nombre = analista_dict.get(dnia, 'Desconocido')
                        contador[analista_nombre] += 1
            
            # Convertir a resultados
            resultados = [{'analista': analista, 'pendientes': count} 
                         for analista, count in contador.items() if count > 0]
            
            # Ordenar por cantidad descendente
            resultados.sort(key=lambda x: x['pendientes'], reverse=True)
            
            return resultados[:100]  # Limitar a 100 resultados
        except Exception as e:
            print(f"Error en consulta preresoluciones_pendientes_por_analista: {e}")
            return []
