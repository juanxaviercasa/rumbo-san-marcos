# PocketBase Backend — Rumbo San Marcos

Servidor backend que gestiona:

- Colecciones de datos (carreras, preguntas, intentos de examen)
- Autenticación (si es necesaria)
- Lógica de calificación (hooks)
- Validaciones

## 📋 Colecciones Requeridas

### 1. `careers`

Almacena todas las carreras de UNMSM mapeadas por bloques.

**Campos:**

- `id` (ID)
- `code` (text) - Código de carrera
- `name` (text) - Nombre de carrera
- `faculty` (text) - Facultad
- `block` (select: A, B, C, D, E) - Bloque
- `referentialScore` (number) - Puntaje de corte referencial
- `weights` (json) - Pesos por materia
- `estimatedDuration` (number) - Duración estimada (minutos)

### 2. `questions`

Banco de reactivos para las evaluaciones.

**Campos:**

- `id` (ID)
- `topic` (text) - Tema
- `course` (text) - Curso
- `area` (select: A, B, C, D, E) - Área
- `difficulty` (select: basic, intermediate, advanced) - Dificultad
- `content` (text) - Enunciado de la pregunta
- `options` (json) - Array de opciones
- `correctOptionId` (text) - ID de la opción correcta
- `explanation` (text) - Explicación de la respuesta

### 3. `exam_attempts`

Registro de intentos de examen y calificaciones.

**Campos:**

- `id` (ID)
- `studentName` (text) - Nombre del estudiante
- `studentEmail` (email) - Correo
- `studentPhone` (text) - Teléfono
- `careerId` (relation) - Carrera seleccionada
- `startTime` (datetime) - Hora de inicio
- `endTime` (datetime) - Hora de fin
- `status` (select: in_progress, submitted, graded) - Estado
- `answers` (json) - Respuestas del estudiante
- `score` (number) - Puntaje final (sobre 2000)
- `referentialScore` (number) - Puntaje de corte
- `gap` (number) - Brecha (score - referentialScore)

## 🔧 Hooks Requeridos

### `exam_attempts.before.create`

- Validar datos del estudiante
- Crear timestamp de inicio

### `exam_attempts.before.update`

- Validar que el status sea valid
- Si status es 'submitted', ejecutar calificación

### `exam_attempts.after.update`

- Si fue calificado, enviar correo de confirmación

## 🔐 Permisos

- **Lectura:** Público para `careers` y `questions`
- **Creación:** Público para `exam_attempts` (crear nuevos intentos)
- **Modificación:** Admin o hooks automáticos
- **Eliminación:** Admin solo

## 📝 Configuración Inicial

1. Crear colecciones según schema arriba
2. Cargar 40 carreras (próxima fase)
3. Cargar ~67 preguntas (próxima fase)
4. Configurar hooks de calificación

## 🚀 Inicio

```bash
# Descargar PocketBase desde https://pocketbase.io
./pocketbase serve

# Acceder a http://localhost:8090
# Crear cuenta administrador
# Crear colecciones manualmente o importar schema
```

## 📞 Variables de Entorno

Crear archivo `.env` en la carpeta backend:

```env
PB_PORT=8090
ADMIN_EMAIL=admin@rumbosanmarcos.com
```
