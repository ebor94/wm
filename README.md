# Pickapp
 Sistema de Logística Cerámica Italia

Aplicación web para la gestión de logística de los tecnicos de montacarga y almacén de Cerámica Italia, incluyendo funcionalidades de picking, alistamiento y gestión de entregas.

## Características Principales

- Gestión de despachos y alistamiento
- Sistema de picking
- Gestión de órdenes de transporte
- Consulta de ubicaciones y materiales
- Control de entregas y novedades
- Monitoreo de conexión en tiempo real
- Indicador de Despacho
- Consulta de Etiquetas

## Tecnologías Utilizadas

- Vue 3 + Vite
- Pinia para manejo de estado
- Tailwind CSS para estilos
- Axios para peticiones HTTP
- Vue Router para navegación

## Requisitos Previos

- Node.js >= 18
- NPM >= 9
## Estructura del Proyecto
wm/
  - ├── src/
  - │   ├── assets/         # Recursos estáticos
  - │   ├── components/     # Componentes reutilizables
  - │   ├── composables/    # Composables de Vue
  - │   ├── router/         # Configuración de rutas
  - │   ├── services/       # Servicios y APIs
  - │   ├── stores/         # Stores de Pinia
  - │   └── views/          # Vistas principales
  - ├── public/             # Archivos públicos
  - └── scripts/           # Scripts de utilidad

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ebor94/wm.git

# Entrar al directorio
cd wm

# Instalar dependencias
npm install
# Desarrollo
npm run dev

# Compilación para producción
npm run build

# Previsualización de producción
npm run preview
