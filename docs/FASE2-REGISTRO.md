# FASE 2: Flujo de Registro y Selección de Carrera

**Estado:** ✅ Completada  
**Fecha:** 2026-08-31

## 📋 Qué Se Implementó

### Componentes Creados

#### 1. `FormularioRegistro.tsx`

- ✅ Formulario de datos personales (nombre, email, teléfono)
- ✅ Validaciones en tiempo real
- ✅ Mensajes de error personalizados
- ✅ Estados disabled para loading

#### 2. `SelectorCarrera.tsx`

- ✅ Selector de Facultad (dropdown)
- ✅ Selector de Carrera (dinámico según facultad)
- ✅ Resumen visual de carrera seleccionada
- ✅ Información de puntaje de corte y duración estimada

#### 3. `Stepper.tsx`

- ✅ Indicador visual de progreso
- ✅ Muestra paso actual y completados
- ✅ Responsive design

### Hooks Creados

#### `useRegistrationForm.ts`

- ✅ Manejo de estado del formulario
- ✅ Validación de campos
- ✅ Manejo de errores
- ✅ Métodos para actualizar y resetear datos

### Servicios Actualizados

#### `exams.ts`

- ✅ Función `createExamAttempt()` para crear nuevos intentos
- ✅ Función `submitExamAnswers()` para enviar respuestas

### Páginas Actualizadas

#### `DiagnosticPage.tsx`

- ✅ Flujo de 3 pasos:
  1. Datos personales
  2. Selección de carrera
  3. Confirmación
- ✅ Navegación entre pasos
- ✅ Integración con PocketBase
- ✅ Redirección a página de examen

### Utilidades Creadas

#### `constants.ts`

- ✅ Bloques (A-E)
- ✅ Facultades
- ✅ Carreras por facultad (datos de ejemplo)
- ✅ Descripciones de bloques
- ✅ Duraciones de examen por bloque

### Documentación Creada

#### `pocketbase-schema.md`

- ✅ Schema completo de colecciones
- ✅ Campos y tipos
- ✅ Permisos recomendados
- ✅ Ejemplos de datos
- ✅ Hooks sugeridos
- ✅ Checklist de configuración

---

## 🎯 Flujo de Usuario

```
HomePage
  ↓
  [Clic en "Comenzar Evaluación"]
  ↓
DiagnosticPage (Paso 1: Datos)
  ↓
  [Ingresa nombre, email, teléfono]
  [Clic en "Siguiente"]
  ↓
DiagnosticPage (Paso 2: Carrera)
  ↓
  [Selecciona Facultad → Carrera]
  [Ve resumen con puntaje de corte]
  [Clic en "Siguiente"]
  ↓
DiagnosticPage (Paso 3: Confirmación)
  ↓
  [Revisa datos]
  [Clic en "Comenzar Evaluación"]
  ↓
  [Se crea ExamAttempt en PocketBase]
  ↓
ExamPage (Fase 3)
```

---

## 🔧 Cómo Probar Localmente

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Descargar PocketBase

- Ir a https://pocketbase.io/docs/
- Descargar para tu SO
- Extraer en `backend/`

### 3. Crear colecciones en PocketBase

Seguir la guía en `docs/database/pocketbase-schema.md`:

- Crear colección `careers`
- Crear colección `questions`
- Crear colección `exam_attempts`

### 4. Agregar datos de prueba

En PocketBase, crear al menos:

- 1 carrera en colección `careers`:

```json
{
  "code": "ING001",
  "name": "Ingeniería Civil",
  "faculty": "Ingeniería",
  "block": "A",
  "referentialScore": 1450,
  "weights": {
    "mathematics": 1.0,
    "physics": 0.9,
    "chemistry": 0.5,
    "biology": 0.2,
    "spanish": 0.3,
    "history": 0.2,
    "geography": 0.2,
    "civics": 0.1
  },
  "estimatedDuration": 180
}
```

### 5. Ejecutar en paralelo

**Terminal 1:**

```bash
cd backend
./pocketbase serve
```

→ http://localhost:8090

**Terminal 2:**

```bash
cd frontend
npm run dev
```

→ http://localhost:5173

### 6. Probar el flujo

1. Ir a http://localhost:5173
2. Clic en "Comenzar Evaluación"
3. Llenar formulario (datos válidos)
4. Seleccionar carrera
5. Confirmar datos
6. Clic en "Comenzar Evaluación"
7. Debería crear un record en `exam_attempts` y redirigir a `/examen/:id`

---

## ✅ Validaciones Implementadas

### Datos Personales

- ✅ Nombre: Mínimo 3 caracteres
- ✅ Email: Formato válido
- ✅ Teléfono: Mínimo 7 dígitos

### Carrera

- ✅ Facultad: Requerida
- ✅ Carrera: Requerida

### Confirmación

- ✅ Todos los campos validados antes de enviar
- ✅ Manejo de errores de red
- ✅ Indicador de carga durante creación

---

## 📦 Dependencias Utilizadas

```json
{
  "react-router-dom": "^6.20.0",
  "pocketbase": "^0.20.5",
  "lucide-react": "^0.308.0"
}
```

---

## 🔐 Notas de Seguridad

- ✅ Validación frontend (UX)
- ✅ Validación backend recomendada (hooks en PocketBase)
- ✅ Email validado
- ✅ Teléfono sanitizado
- ✅ Datos almacenados en PocketBase (no en cliente)

---

## 🚀 Próximas Fases

### Fase 3: Motor de Evaluación Dinámica

- [ ] Generación de prueba personalizada según carrera
- [ ] Cronómetro global estricto
- [ ] Navegación entre preguntas
- [ ] Mapa visual de estado de respuestas
- [ ] Autoenvío al expirar tiempo
- [ ] Protección de respuestas correctas (no se exponen al cliente)

### Fase 4: Panel de Resultados

- [ ] Medidor radial con brecha
- [ ] Desglose de competencias por curso
- [ ] Ruta de estudio inteligente
- [ ] Revisión pregunta por pregunta

### Fase 5: Panel de Administración

- [ ] Gestión de preguntas (CRUD)
- [ ] Gestión de puntajes de corte
- [ ] Visualización de intentos
- [ ] Reportes

### Fase 6: Banco de Datos

- [ ] 40 carreras reales mapeadas
- [ ] ~67 preguntas multi-área

---

## 📝 Archivos Modificados/Creados

### Componentes

- ✅ `src/components/FormularioRegistro.tsx` (NUEVO)
- ✅ `src/components/SelectorCarrera.tsx` (NUEVO)
- ✅ `src/components/Stepper.tsx` (NUEVO)

### Hooks

- ✅ `src/hooks/useRegistrationForm.ts` (NUEVO)

### Servicios

- ✅ `src/services/exams.ts` (ACTUALIZADO)

### Páginas

- ✅ `src/pages/DiagnosticPage.tsx` (ACTUALIZADO)

### Utilidades

- ✅ `src/utils/constants.ts` (NUEVO)

### Configuración

- ✅ `.env.local` (NUEVO)

### Documentación

- ✅ `docs/database/pocketbase-schema.md` (NUEVO)

---

## 🎨 Estilos y Diseño

- ✅ Colores Rumbo (burgundy, dark, light, gold)
- ✅ Tipografía (Fraunces + Inter)
- ✅ Componentes responsive
- ✅ Estados de validación visuales
- ✅ Transiciones suaves
- ✅ Accesibilidad mejorada

---

## 🧪 Casos de Prueba

### Caso 1: Flujo Exitoso

```
1. Ingresa datos válidos
2. Selecciona facultad y carrera
3. Confirma y envía
4. → Se crea exam_attempt y redirige a /examen/:id
```

### Caso 2: Validación de Email

```
1. Ingresa email inválido
2. → Muestra error de formato
3. Corrige email
4. → Error desaparece
```

### Caso 3: Navegación Hacia Atrás

```
1. Completa paso 1
2. Va al paso 2
3. Clic en "Anterior"
4. → Vuelve al paso 1 con datos intactos
```

### Caso 4: Carrera Dinámica

```
1. Selecciona "Ingeniería"
2. → Muestra carreras de Ingeniería
3. Selecciona "Ciencias"
4. → Cambia a carreras de Ciencias (carrera anterior se reset)
```

---

## 📊 Estadísticas

| Métrica             | Valor |
| ------------------- | ----- |
| Componentes creados | 3     |
| Hooks creados       | 1     |
| Archivos creados    | 5     |
| Líneas de código    | ~1200 |
| Validaciones        | 6+    |
| Rutas completadas   | 1/5   |

---

**Estado:** ✅ Fase 2 completada. Listo para Fase 3 (Motor de Evaluación).
