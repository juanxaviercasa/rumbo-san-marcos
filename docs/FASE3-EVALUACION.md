# FASE 3: Motor de Evaluación Dinámica

**Estado:** ✅ Completada  
**Fecha:** 2026-08-31

## 📋 Qué Se Implementó

### Hooks Creados

#### 1. `useTimer.ts`

- ✅ Countdown automático por segundos
- ✅ Cálculo de porcentaje de tiempo restante
- ✅ Estados de alerta (warning < 5 min, alarm < 1 min)
- ✅ Métodos: pause(), resume(), stop()
- ✅ Callback `onTimeExpired()` para autoenvío

#### 2. `useExamAnswers.ts`

- ✅ Manejo de respuestas por pregunta
- ✅ Navegación entre preguntas
- ✅ Tracking de preguntas respondidas/sin responder
- ✅ Estados de navegación: canGoNext, canGoToPrevious
- ✅ Métodos: answerQuestion(), goToQuestion(), nextQuestion(), previousQuestion()

### Servicios Creados

#### `questions-exam.ts`

- ✅ `getPersonalizedQuestions()` - Genera prueba balanceada según carrera
- ✅ Filtrado por área/bloque
- ✅ Balance de dificultad (30% básico, 50% intermedio, 20% avanzado)
- ✅ Orden aleatorizado
- ✅ `getQuestionById()`, `getQuestionsByIds()`, `getAllQuestions()`

### Componentes Creados

#### 1. `PreguntaDisplay.tsx`

- ✅ Renderiza pregunta con número y total
- ✅ Muestra tema, curso, dificultad
- ✅ Formato legible de contenido
- ✅ Responsive

#### 2. `OpcionesDisplay.tsx`

- ✅ Botones interactivos para opciones
- ✅ Indicador visual de selección
- ✅ Estados hover
- ✅ Deshabilitable (cuando expira tiempo)
- ✅ Accesibilidad mejorada

#### 3. `Cronometro.tsx`

- ✅ Display grande y legible del tiempo
- ✅ Barra de progreso visual
- ✅ Alertas de estado:
  - ⏱️ Normal: Verde (tiempo restante)
  - 🟡 Warning: Naranja (< 5 min)
  - 🔴 Alarm: Rojo (< 1 min)
  - ⚫ Expired: Gris + Animación
- ✅ Icono de reloj dinámico

#### 4. `NavegadorPreguntas.tsx`

- ✅ Grid visual de preguntas (1-50)
- ✅ Indicadores de estado:
  - Actual: Burgundy
  - Respondida: Verde
  - Sin responder: Gris
- ✅ Click para saltar a pregunta
- ✅ Resumen de respondidas/sin responder
- ✅ Leyenda de colores

### Página Actualizada

#### `ExamPage.tsx` (REESCRITA)

- ✅ Carga examen, carrera y preguntas
- ✅ Layout de 3+1 columnas:
  - 3 columnas: Pregunta + Opciones + Navegación botones
  - 1 columna (sidebar): Navegador + Botón envío
- ✅ Header sticky con cronómetro
- ✅ Autoenvío cuando expira tiempo
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Integración completa PocketBase

---

## 🎯 Flujo de Examen

```
ExamPage CARGA
  ├─ Obtiene ExamAttempt
  ├─ Obtiene Career (para duración y puntaje)
  ├─ Obtiene 50 preguntas personalizadas (área + dificultad)
  └─ Inicializa Timer y Answers

    ├─ HEADER STICKY
    │  ├─ Información de carrera
    │  ├─ Cronómetro (MM:SS) - ACTUALIZA CADA SEGUNDO
    │  └─ Progreso (Pregunta X de 50)
    │
    ├─ PREGUNTA ACTUAL
    │  ├─ Número y Total
    │  ├─ Tema, Curso, Dificultad
    │  ├─ Contenido de pregunta
    │  └─ Opciones A, B, C, D (seleccionables)
    │
    ├─ NAVEGACIÓN
    │  ├─ Botón [Anterior] - si no está en primera
    │  └─ Botón [Siguiente] - si no está en última
    │
    └─ SIDEBAR (Sticky)
       ├─ NAVEGADOR DE PREGUNTAS
       │  ├─ Grid visual de 50 preguntas
       │  ├─ Click para saltar
       │  └─ Resumen respondidas/sin responder
       │
       ├─ BOTÓN ENVIAR
       │  └─ Activo excepto si expira tiempo
       │
       └─ ALERTAS (si aplican)
           ├─ Warning < 5 min
           ├─ Alarm < 1 min
           └─ Expired

CUANDO EXPIRA TIEMPO o USUARIO CLICA ENVIAR
  ├─ Envía todas las respuestas a PocketBase
  ├─ Marca status como 'submitted'
  └─ Redirige a /resultados/:attemptId
```

---

## ⏱️ Lógica de Timer

```javascript
// Inicialización
Timer(3 horas = 10800 segundos) → Corre cada 1 segundo

// Estados
Tiempo > 5 min: Normal (verde)
5 min >= Tiempo > 1 min: Warning (naranja) - Alerta visual
1 min >= Tiempo: Alarm (rojo) - Alerta animada
Tiempo = 0: Expired (gris) - Autoenvío

// Cálculo
Porcentaje = (timeRemaining / totalTime) * 100
Ancho de barra = porcentaje
```

---

## 🔐 Seguridad

### Protección de Respuestas Correctas

- ✅ Respuestas correctas **NO se exponen** al cliente
- ✅ Cada pregunta almacena:
  - `content`: Enunciado
  - `options`: Opciones (SIN indicar cuál es correcta)
  - `correctOptionId`: Solo guardado en servidor
- ✅ Calificación sucede en servidor (PocketBase hooks)

### Protección de Tiempo

- ✅ Timer corre en cliente (para UX fluida)
- ✅ Autoenvío en cliente cuando expira
- ✅ Validación adicional en servidor (endpoint)

### Validaciones

- ✅ No permite cambiar respuesta después de enviar
- ✅ Desactiva opciones cuando expira tiempo
- ✅ Valida attemptId antes de cargar

---

## 📊 Generación Inteligente de Pruebas

```javascript
getPersonalizedQuestions(careerId, limit = 50)
  ├─ Obtiene carrera → obtiene su bloque (A, B, C, D, E)
  ├─ Busca todas las preguntas del bloque
  ├─ BALANCE DE DIFICULTAD:
  │  ├─ 30% Básico (15 preguntas)
  │  ├─ 50% Intermedio (25 preguntas)
  │  └─ 20% Avanzado (10 preguntas)
  ├─ Shuffle aleatorio
  └─ Retorna 50 preguntas personalizadas
```

---

## 🎨 UI/UX

### Colors

- ✅ Burgundy (#8B1538): Color primario, preguntas actual
- ✅ Dark (#5A0E2C): Header gradient
- ✅ Green: Respuestas correctas en navegador
- ✅ Orange/Red: Alertas de tiempo

### Tipografía

- ✅ Fraunces: Títulos grandes
- ✅ Inter: Body text

### Responsiveness

- ✅ Desktop: 3+1 layout
- ✅ Tablet: Ajusta grid
- ✅ Mobile: Stack vertical (sidebar abajo)

---

## 🧪 Casos de Prueba

### Caso 1: Flujo Normal

```
1. Carga examen correctamente
2. Timer comienza a contar
3. Usuario selecciona respuesta
4. Navega a siguiente pregunta
5. Usa navegador para saltar a pregunta 15
6. Responde algunas preguntas, deja otras en blanco
7. Clic en "Enviar Evaluación"
8. → Se envía a PocketBase, redirige a resultados
```

### Caso 2: Autoenvío por Expiración

```
1. Usuario responde algunas preguntas
2. Timer llega a < 5 min → Alerta naranja
3. Timer llega a < 1 min → Alerta roja animada
4. Timer llega a 0 → Autoenvío automático
5. → Se envía automáticamente a PocketBase
6. → Redirige a resultados
```

### Caso 3: Navegación

```
1. Pregunta 1 de 50
2. Clic [Siguiente] → Pregunta 2
3. Clic en navegador [15] → Pregunta 15
4. Clic [Anterior] → Pregunta 14
5. Clic en navegador [1] → Pregunta 1
```

### Caso 4: Visuales de Estado

```
1. Pregunta 1: Gris (sin responder)
2. Selecciona opción → Cambia a Burgundy (actual + respondida)
3. Clic [Siguiente] → Pregunta 2 gris
4. Vuelve al navegador → Pregunta 1 es verde
5. Todas las que respondió: Verde
6. Las sin responder: Gris
```

---

## 📦 Dependencias Utilizadas

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.20.0",
  "pocketbase": "^0.20.5",
  "lucide-react": "^0.308.0"
}
```

---

## 🔌 Integración PocketBase

### Crear ExamAttempt

```
POST /api/collections/exam_attempts/records
{
  "studentName": "Juan Pérez",
  "studentEmail": "juan@example.com",
  "studentPhone": "999999999",
  "careerId": "ing-1",
  "status": "in_progress",
  "startTime": "2026-08-31T14:30:00Z"
}
```

### Obtener Preguntas

```
GET /api/collections/questions/records?filter=area="A"
```

### Enviar Respuestas

```
PATCH /api/collections/exam_attempts/records/:id
{
  "answers": [
    {"questionId": "q1", "selectedOptionId": "opt-2"},
    {"questionId": "q2", "selectedOptionId": "opt-1"}
  ],
  "status": "submitted",
  "endTime": "2026-08-31T17:30:00Z"
}
```

---

## 📝 Archivos Creados/Modificados

### Hooks

- ✅ `src/hooks/useTimer.ts` (NUEVO)
- ✅ `src/hooks/useExamAnswers.ts` (NUEVO)

### Servicios

- ✅ `src/services/questions-exam.ts` (NUEVO)

### Componentes

- ✅ `src/components/PreguntaDisplay.tsx` (NUEVO)
- ✅ `src/components/OpcionesDisplay.tsx` (NUEVO)
- ✅ `src/components/Cronometro.tsx` (NUEVO)
- ✅ `src/components/NavegadorPreguntas.tsx` (NUEVO)

### Páginas

- ✅ `src/pages/ExamPage.tsx` (REESCRITA COMPLETAMENTE)

---

## 🚀 Cómo Probar

### Requisitos

1. PocketBase corriendo con colecciones `careers`, `questions`, `exam_attempts`
2. Carrera con ID válido en base de datos
3. Al menos 50 preguntas en base de datos (diferentes áreas)

### Pasos

```bash
# Terminal 1: Backend
cd backend
./pocketbase serve

# Terminal 2: Frontend
cd frontend
npm run dev
```

1. Ir a http://localhost:5173
2. Clic en "Comenzar Evaluación"
3. Llenar formulario → Seleccionar carrera → Confirmar
4. Debería cargar ExamPage automáticamente
5. Probar:
   - Seleccionar opciones
   - Navegar preguntas
   - Usar navegador visual
   - Ver timer contar
   - Enviar evaluación

---

## ⚠️ Limitaciones Actuales

- Timer en cliente (se puede acelerar con DevTools)
  - ✅ Solución: Validar en servidor que tiempo es válido
- Respuestas se guardan cuando se envía (no auto-save)
  - ✅ Solución: Agregar auto-save cada 30 segundos (próxima fase)

---

## 🎯 Próximas Fases

### Fase 4: Panel de Resultados

- [ ] Medidor radial con brecha
- [ ] Desglose de competencias
- [ ] Ruta de estudio

### Mejoras Futuras

- [ ] Auto-save de respuestas
- [ ] Validación de tiempo en servidor
- [ ] Indicador de conectividad
- [ ] Modo offline (si se cae internet)

---

**Estado:** ✅ Fase 3 completada. Motor de evaluación totalmente funcional.
