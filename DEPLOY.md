# Despliegue de Rumbo San Marcos

## 1. Frontend en Vercel

1. Conecta el repositorio GitHub.
2. Selecciona el proyecto y define la carpeta del frontend como `frontend`.
3. Framework: `Vite`.
4. Build command: `npm install && npm run build`
5. Output directory: `dist`
6. Variables de entorno:
   - `VITE_POCKETBASE_URL=https://tu-backend-url.com`

### Recomendación de ruta
- Dominio principal: `https://rumbo-san-marcos.vercel.app`
- Backend: `https://rumbo-san-marcos-pb.onrender.com`

## 2. Backend PocketBase en Render

1. Crea un nuevo servicio `Web Service`.
2. Elige `Docker`.
3. Conecta este repositorio.
4. Usa la ruta del Dockerfile: `./backend/Dockerfile`
5. Expone el puerto `8090`.
6. Configura variables:
   - `PB_ADMIN_EMAIL=admin@rumbosanmarcos.com`
   - `PB_ADMIN_PASSWORD=admin123456`
   - `PB_PORT=8090`

> Importante: PocketBase necesita persistencia de datos. Si usas un plan gratuito, la persistencia puede ser limitada o no disponible según la plataforma. Para producción estable, hay que usar un plan con volumen persistente.

## 3. Configuración del frontend

En [frontend/.env.example](frontend/.env.example) ya está la variable:

```env
VITE_POCKETBASE_URL=http://localhost:8090
```

En producción se reemplaza por la URL real del backend, por ejemplo:

```env
VITE_POCKETBASE_URL=https://rumbo-san-marcos-pb.onrender.com
```

## 4. Importar schema y datos

Una vez el backend esté corriendo:

1. Entrar al panel admin: `https://tu-backend-url.com/_/`
2. Crear el admin si no existe.
3. Importar el schema de [backend/pb_schema.json](backend/pb_schema.json)
4. Ejecutar:

```bash
cd backend
node seed-import.mjs
```

Con estas variables:

```bash
POCKETBASE_URL=https://tu-backend-url.com
PB_ADMIN_EMAIL=admin@rumbosanmarcos.com
PB_ADMIN_PASSWORD=admin123456
```

## 5. Validaciones finales

- Frontend en Vercel debe cargar sin 404 en rutas internas.
- Backend debe responder en `/api/health`.
- Las colecciones `careers`, `questions`, `exam_attempts` deben existir.
- Autenticación admin debe funcionar.
- El flujo desde diagnóstico hasta resultados debe tomar la URL del backend real.

## 6. Recomendación de hosting

### Mejor opción para este proyecto
- Frontend: Vercel
- Backend: Render o Railway

### Si quieres algo más estable para producción
- Frontend: Vercel
- Backend: Railway + volume persistente

## 7. Siguientes tareas del proyecto

- Importar el banco completo de carreras y preguntas.
- Configurar reglas de acceso por colección.
- Validar el hook de calificación en PocketBase.
- Probar flujo de registro, examen y resultados en la URL real.
- Configurar dominio personalizado.
