# UP Campus - Sistema de Ubicación del Personal

Sistema web para visualizar y administrar la ubicación actual del personal sobre un mapa 3D del campus de la Universidad Panamericana, Campus Guadalajara.

## Características

Visualización del campus en 3D con Three.js  
Arrastrar y soltar personas a ubicaciones  
Múltiples personas por ubicación  
Panel lateral con lista de personal disponible  
Panel derecho con personas en zona seleccionada  
Sincronización con MongoDB en tiempo real  
Notificaciones de acciones  
Interfaz responsiva y moderna

## 🛠️ Stack Tecnológico

**Frontend:**

- React 18
- Vite
- Three.js + @react-three/fiber + @react-three/drei
- CSS moderno

**Backend:**

- Express.js
- Mongoose
- MongoDB Atlas
- CORS

## Requisitos Previos

- Node.js 16+
- npm o yarn
- Cuenta MongoDB Atlas con database "MenInBlue" y colección "CAU"

## Instalación

### 1. Clonar y configurar el proyecto

```bash
cd up-campus
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Configurar variables de entorno

Crear `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/MenInBlue?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Instalar dependencias del frontend

```bash
cd src
npm install
```

### 5. Configurar frontend

Crear `src/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## Ejecutar el proyecto

### Terminal 1: Backend

```bash
npm run dev:server
```

El servidor estará disponible en: `http://localhost:5001`

```
✓ GET http://localhost:5001/api/health
✓ GET http://localhost:5001/api/persons
✓ GET http://localhost:5001/api/assignments/by-date/2024-01-15
```

### Terminal 2: Frontend

```bash
npm run dev:client
```

La aplicación estará disponible en: `http://localhost:5173`

## Estructura del Proyecto

```
up-campus/
├── server/
│   ├── models/
│   │   ├── Person.js         # Modelo Mongoose de Person
│   │   └── Assignment.js      # Modelo de asignaciones
│   ├── routes/
│   │   ├── persons.routes.js  # Rutas de personas
│   │   └── assignments.routes.js # Rutas de asignaciones
│   └── server.js             # Servidor Express
│
├── src/
│   ├── components/
│   │   ├── Campus/
│   │   │   ├── Campus.jsx    # Orquestador del mapa 3D
│   │   │   ├── Building.jsx  # Edificios 3D
│   │   │   ├── Ground.jsx    # Terreno
│   │   │   └── Spot.jsx      # Ubicaciones (spots)
│   │   ├── People/
│   │   │   ├── PersonList.jsx    # Lista de personas
│   │   │   └── PersonMarker.jsx  # Marcadores 3D
│   │   └── UI/
│   │       ├── ZoneDetail.jsx    # Detalles de zona
│   │       └── Toast.jsx         # Notificaciones
│   ├── data/
│   │   ├── buildings.js      # Datos de edificios
│   │   └── spots.js          # Datos de spots
│   ├── hooks/
│   │   ├── usePersons.js     # Hook para personas
│   │   ├── useAssignments.js # Hook para asignaciones
│   │   └── useToast.js       # Hook para notificaciones
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos
│   └── main.jsx              # Punto de entrada
│
├── .env.example
├── package.json
└── README.md
```

## Cómo Usar

### 1. Visualizar el Campus

- El mapa 3D carga automáticamente
- Usa el mouse para rotar, zoom y navegar
- Click derecho + arrastrar para rotación libre

### 2. Asignar Personas

1. **Selecciona una persona** del panel izquierdo
2. **Arrastra** hacia el mapa 3D
3. **Suelta** cerca de un spot (distancia ≤ 2 unidades)
4. Verás una notificación de confirmación

### 3. Ver Personas en una Zona

1. **Haz clic** en un edificio o spot en el mapa
2. El panel derecho mostrará:
   - Nombre del edificio/spot
   - Supervisión (si aplica)
   - Lista de personas asignadas

### 4. Cambiar Persona de Ubicación

- Haz clic en una persona en una zona
- Arrástrala a otro spot para moverla

## API Endpoints

### Personas

```
GET /api/persons
Obtiene todas las personas desde MongoDB
```

### Asignaciones

```
GET /api/assignments/by-date/:fecha
Obtiene asignaciones para una fecha específica (YYYY-MM-DD)

POST /api/assignments
Crea o actualiza una asignación
Body: { personaId, zonaId, fecha }

PUT /api/assignments/:id
Actualiza una asignación

DELETE /api/assignments/:id
Elimina una asignación
```

## Configuración de Spots

Los spots se definen en `src/data/spots.js`. Formato:

```javascript
{
  id: "SPOT_BUILDING_01",
  nombre: "Nombre descriptivo",
  position: [x, 0.3, z],  // Coordenadas 3D
  buildingId: "BUILDING_ID"
}
```

## Personalizacion de Edificios

Los edificios se definen en `src/data/buildings.js`. Formato:

```javascript
{
  id: "BUILDING_ID",
  nombre: "Nombre del Edificio",
  supervision: "M-21",  // M-21, M-20, o Poliforum
  position: [x, y, z],
  size: [width, height, depth],
  rotation: [rotX, rotY, rotZ]
}
```

## Troubleshooting

### "Cannot GET /api/persons"

- Verifica que el backend esté corriendo en puerto 5001
- Revisa la variable `MONGO_URI` en `.env`
- Asegúrate de que MongoDB Atlas está accesible

### Personas no aparecen

- Verifica la conexión a MongoDB
- Confirma que la colección "CAU" tiene datos
- Abre la consola del navegador y busca errores

### Drag no funciona

- Asegúrate de que OrbitControls se desactiva durante drag
- Verifica que el Raycaster intersecta correctamente
- Revisa la consola para errores de Three.js

### Spots no se resaltan

- Verifica la distancia en `SNAP_DISTANCE` (2 unidades por defecto)
- Asegúrate de que los spots están dentro del rango visible
- Revisa que el cálculo de distancia es correcto

## 📝 Notas Importantes

- No se guarda el historial de posiciones (solo ubicación actual)
- Cada persona puede estar en un solo lugar por día
- Múltiples personas pueden compartir un spot
- Las fotos de personas se cachean en memoria

## Contribuir

Para reportar issues o sugerencias, abre un ticket en el repositorio.

## Licencia

MIT License - Universidad Panamericana 2024
