# PROYECTO-DE-GDI
🏢 Sistema de Gestión de Expedientes Municipales
Sistema web completo para la gestión de expedientes, proveídos y pre-resoluciones en municipalidades distritales.

📋 Características
👥 Gestión de Administrados - Registro y administración de ciudadanos

📁 Gestión de Expedientes - Seguimiento completo de expedientes municipales

📋 Sistema de Proveídos - Generación y gestión de proveídos oficiales

⚖️ Pre-Resoluciones - Elaboración y seguimiento de pre-resoluciones

🔍 Consultas Avanzadas - Múltiples filtros y búsquedas especializadas

📊 Dashboard - Estadísticas y resumen del sistema

🖨️ Exportación - Generación de PDFs para documentos oficiales

ESTRUCTURA DEL PROYECTO
sistema-expedientes/
├── 📁 static/
│ ├── 📁 css/
│ │ └── estilos.css # Estilos principales
│ │
│ ├── 📁 js/
│ │ ├── main.js # Archivo principal de inicialización
│ │ │
│ │ ├── 📁 module/
│ │ │ ├── 📁 api/
│ │ │ │ ├── cache.js # Sistema de caché del cliente
│ │ │ │ └── fetchData.js # Funciones para llamadas a la API
│ │ │ │
│ │ │ ├── 📁 crud/
│ │ │ │ ├── create.js # Crear registros (CREATE)
│ │ │ │ ├── read.js # Cargar y mostrar datos (READ)
│ │ │ │ ├── update.js # Editar registros (UPDATE)
│ │ │ │ └── delete.js # Eliminar registros (DELETE)
│ │ │ │
│ │ │ ├── 📁 ui/
│ │ │ │ ├── tabs.js # Navegación por pestañas
│ │ │ │ ├── modals.js # Sistema de modales
│ │ │ │ └── render.js # Renderizado de tablas y elementos
│ │ │ │
│ │ │ └── 📁 utils/
│ │ │ ├── helpers.js # Funciones auxiliares
│ │ │ ├── filters.js # Filtros y búsquedas
│ │ │ └── exports.js # Exportación de datos e impresión
│ │ │
│ │ └── (otros archivos JS/CSS)
│ │
│ └── (otros recursos estáticos)
│
├── 📁 templates/
│ └── index.html # Plantilla principal HTML
│
├── 🔧 main.py # Servidor Flask principal
├── ⚙️ config.py # Configuración de la aplicación
├── 🖥️ handlers.py # Manejadores de endpoints
├── 🗃️ base_de_datos.py # Modelos y conexión a base de datos
├── 📦 crear_ejecutable.py # Script para crear ejecutable
├── 📋 requisitos.txt # Dependencias del proyecto
├── 💾 script_backup.js # Script monolítico (copia de seguridad)
└── 📖 README.md # Este archivo
