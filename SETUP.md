# 🚀 GUÍA DE SETUP COMPLETO — Rumbo San Marcos

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **pnpm**
- **PocketBase** (se descarga)
- **Git** (opcional, pero recomendado)

---

## 🛠️ Instalación del Frontend

### Paso 1: Navegar a la carpeta frontend

```bash
cd frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

o si usas pnpm:

```bash
pnpm install
```

### Paso 3: Crear archivo `.env.local`

Copiar `.env.example` a `.env.local` y ajustar valores:

```bash
cp .env.example .env.local
```

Luego editar `.env.local`:

```env
VITE_POCKETBASE_URL=http://localhost:8090
```

### Paso 4: Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Paso 5: Compilar para producción

```bash
npm run build
```

Genera archivos optimizados en `frontend/dist/`

---

## 🗄️ Instalación del Backend (PocketBase)

### Paso 1: Descargar PocketBase

Ve a https://pocketbase.io/docs/ y descarga la versión para tu SO.

**Recomendado:** Poner el ejecutable en la carpeta `backend/`

### Paso 2: Ejecutar PocketBase

```bash
cd backend
./pocketbase serve
```

En Windows:

```bash
pocketbase.exe serve
```

El panel de administración estará en `http://localhost:8090/_/`

### Paso 3: Crear cuenta administrador

1. Ir a http://localhost:8090/\_/
2. Crear email/contraseña para la cuenta admin
3. Guardar credenciales

### Paso 4: Crear colecciones

Dentro del panel admin de PocketBase:

1. **Crear colección `careers`**
   - Campos según docs en `backend/README.md`

2. **Crear colección `questions`**
   - Campos según docs en `backend/README.md`

3. **Crear colección `exam_attempts`**
   - Campos según docs en `backend/README.md`

### Paso 5: Configurar permisos

En el panel de PocketBase, para cada colección:

- `careers`: Lectura pública
- `questions`: Lectura pública
- `exam_attempts`: Crear público, leer con reglas

---

## 🔗 Conectar Frontend + Backend

La conexión es automática si:

- Frontend en `http://localhost:5173`
- Backend en `http://localhost:8090`

Si cambian los puertos, actualizar en `.env.local`

---

## ✅ Verificar que todo funciona

### Frontend

```bash
cd frontend
npm run dev
```

Debería compilar sin errores y abrir el navegador automáticamente.

### Backend

```bash
cd backend
./pocketbase serve
```

Debería mostrar:

```
REST API: http://127.0.0.1:8090
Admin UI: http://127.0.0.1:8090/_/
```

---

## 📱 Prueba de integración

1. Ir a http://localhost:5173
2. Hacer clic en "Comenzar Evaluación"
3. Debería redirigir a `/diagnostico` (en construcción)

Si llega a la página sin errores de red, ¡la integración está funcionando!

---

## 🔐 Configuración de Producción

### Frontend

```bash
npm run build
# Servir contenido de `dist/` con un servidor web (Nginx, Apache, Vercel, Netlify, etc.)
```

### Backend

1. Desplegar PocketBase en un servidor (DigitalOcean, Heroku, AWS, etc.)
2. Actualizar `VITE_POCKETBASE_URL` en `.env.local` a la URL del servidor

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"

```bash
cd frontend
npm install
```

### Error: "CORS error"

- Verificar que PocketBase está corriendo en `http://localhost:8090`
- Verificar `VITE_POCKETBASE_URL` en `.env.local`

### Error: "PocketBase no conecta"

- Verificar que estás en `backend/` y ejecutaste `./pocketbase serve`
- Verificar que el puerto 8090 no está siendo usado

### Puerto ya está en uso

```bash
# Kill proceso en puerto 8090 (Linux/Mac)
lsof -i :8090 | grep LISTEN | awk '{print $2}' | xargs kill -9

# En Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 8090).OwningProcess | Stop-Process
```

---

## 📚 Próximos pasos

1. ✅ Setup completo
2. 🔄 Fase 2: Implementar flujo de registro
3. 🔄 Fase 3: Implementar motor de evaluación
4. 🔄 Fase 4: Implementar panel de resultados
5. 🔄 Fase 5: Panel de administración
6. 📋 Fase 6: Cargar carreras y preguntas

---

## 📞 Ayuda

Si encuentras problemas:

1. Revisar logs en terminal
2. Verificar `.env.local` y credenciales
3. Verificar que ambos servicios están corriendo
