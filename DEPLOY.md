# Despliegue de Rumbo San Marcos

## 1. Frontend en Vercel

1. Conecta el repositorio GitHub.
2. En Vercel, selecciona el proyecto y define la carpeta del frontend como `frontend`.
3. Framework: `Vite`.
4. Build command: `npm install && npm run build`
5. Output directory: `dist`
6. Variables de entorno:
   - `VITE_SUPABASE_URL=https://tu-proyecto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=tu-anon-key`
   - `VITE_ADMIN_EMAIL=admin@rumbosanmarcos.com`

### Recomendación de ruta

- Dominio principal: `https://rumbo-san-marcos.vercel.app`
- Base de datos: Supabase

## 2. Base de datos en Supabase

1. Crea un nuevo proyecto en Supabase.
2. Abre SQL Editor.
3. Ejecuta el contenido de [supabase/schema.sql](supabase/schema.sql).
4. Revisa Storage y Authentication si quieres agregar administración más adelante.

### Variables que necesitas

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## 3. Configuración del frontend

En [frontend/.env.example](frontend/.env.example) ya está el template actualizado:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Copia este archivo a `.env.local` dentro de la carpeta `frontend` y reemplaza los valores reales del proyecto.

## 4. Importar datos iniciales

Después de crear la base de datos:

1. Abre la base en Supabase.
2. Inserta las carreras y preguntas.
3. Verifica que las tablas `careers`, `questions`, `exam_attempts` y `audit_logs` existan.

Puedes usar el JSON base que ya está en la raíz del proyecto si necesitas cargar contenido de prueba.

## 5. Validaciones finales

- El frontend en Vercel debe cargar sin 404 en rutas internas.
- La app debe leer las carreras y preguntas desde Supabase.
- El flujo de diagnóstico y examen debe calcular el resultado correctamente.
- La edición del reporte con WhatsApp y descarga debe funcionar.

## 6. Recomendación de hosting

### Mejor opción para este proyecto

- Frontend: Vercel
- Base de datos: Supabase

Esto elimina la dependencia de PocketBase y sigue una arquitectura más moderna y estable para producción.

## 7. Siguientes tareas del proyecto

- Cargar el banco completo de carreras y preguntas.
- Probar el flujo real desde registro hasta resultados.
- Configurar dominio personalizado en Vercel.
- Enlazar notificaciones por WhatsApp o email cuando la app esté viva.
