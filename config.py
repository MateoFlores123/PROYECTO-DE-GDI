# config.py
import os
import sys

def get_db_config():
    """Configuración automática de base de datos"""
    
    # Determinar el directorio base
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    else:
        base_dir = os.path.dirname(__file__)
    
    # Intentar conexiones en este orden:
    configs = [
        # PostgreSQL portable (si existe)
        {
            'host': 'localhost',
            'database': 'RESOLUCION', 
            'user': 'postgres',
            'password': 'root',
            'port': 5432,
            'db_type': 'postgresql'
        },
        # SQLite (fallback)
        {
            'db_path': os.path.join(base_dir, 'preresolucion.db'),
            'db_type': 'sqlite'
        }
    ]
    
    return configs

DB_CONFIGS = get_db_config()
