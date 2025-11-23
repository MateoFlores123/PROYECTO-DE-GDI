# crear_ejecutable.py
import os
import sys
import subprocess
import shutil

def crear_ejecutable():
    print("🔨 Creando ejecutable con Supabase...")
    
    # Verificar estructura de archivos
    required_dirs = ['templates', 'static']
    for dir_name in required_dirs:
        if not os.path.exists(dir_name):
            print(f"❌ Error: No existe la carpeta '{dir_name}'")
            return False
    
    required_files = [
        'templates/index.html',
        'static/style.css', 
        'static/script_backup.js',
        'main.py',
        'handlers.py',
        'database.py',
        'models.py'
    ]
    
    for file in required_files:
        if not os.path.exists(file):
            print(f"❌ Error: No existe el archivo '{file}'")
            return False

    # Comando para PyInstaller
    comando = [
        sys.executable,
        "-m", "PyInstaller",
        "--onefile",
        "--name", "SistemaPreResoluciones",
        "--add-data", "templates;templates",
        "--add-data", "static;static",
        "--hidden-import", "supabase",
        "--hidden-import", "psycopg2",
        "--console",
        "--clean",
        "main.py"
    ]
    
    try:
        print("📦 Ejecutando PyInstaller...")
        result = subprocess.run(comando, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Ejecutable creado exitosamente!")
            
            # Verificar que el ejecutable se creó
            exe_path = "dist/SistemaPreResoluciones.exe"
            if os.path.exists(exe_path):
                print(f"✅ Ejecutable creado: {exe_path}")
                
                # Crear paquete portable
                portable_dir = "SistemaPreResoluciones_Supabase"
                if os.path.exists(portable_dir):
                    shutil.rmtree(portable_dir)
                
                os.makedirs(portable_dir)
                
                # Copiar ejecutable
                shutil.copy2(exe_path, portable_dir)
                
                print(f"📁 Paquete creado en: {portable_dir}")
                print("💡 El ejecutable usa Supabase - Requiere conexión a internet")
                print("🌐 URL: https://ejsrwvgatizygoawwwjg.supabase.co")
                
                return True
            else:
                print("❌ El ejecutable no se creó correctamente")
                return False
        else:
            print(f"❌ Error en PyInstaller: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("   CREADOR DE EJECUTABLE - SUPABASE")
    print("   Sistema de Pre-Resoluciones Municipal")
    print("=" * 60)
    print()
    
    if crear_ejecutable():
        print()
        print("🎉 ¡Proceso completado exitosamente!")
        print("📋 Características:")
        print("   ✅ Usa Supabase como base de datos")
        print("   ✅ No requiere instalación de PostgreSQL")
        print("   ✅ Datos en la nube")
        print("   ✅ Requiere conexión a internet")
    else:
        print()
        print("😞 Ocurrió un error durante la creación")
    
    input("Presiona Enter para salir...")
