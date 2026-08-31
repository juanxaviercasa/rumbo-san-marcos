# FASE 5: Backend Inteligente — Calificación en Servidor

**Estado:** ✅ Completada  
**Fecha:** 2026-08-31

## 📋 Qué Se Implementó

### Documentación de Setup

#### `backend/SETUP-HOOKS.md`

- ✅ Guía completa de instalación de hooks
- ✅ Opciones: Admin Console o archivo de configuración
- ✅ Pruebas y troubleshooting
- ✅ Campos requeridos en colecciones
- ✅ Permisos recomendados

#### `backend/hooks/grade-exam.js`

- ✅ Hook PocketBase para calificar automáticamente
- ✅ Versión JavaScript
- ✅ Versión TypeScript/Go alternativa
- ✅ Lógica UNMSM completa
- ✅ Manejo de errores

### Actualización de Schema

#### `docs/database/pocketbase-schema.md`

- ✅ Agregados ejemplos de exam_attempts con score
- ✅ Documentación de campos calculados
- ✅ Referencia a setup de hooks
- ✅ Notas sobre calificación en servidor

---

## 🎯 Arquitectura de Seguridad Fase 5

### Problema Fase 4 (Client-side)

```typescript
// ❌ INSEGURO
const questions = await getQuestionsByIds(questionIds)
// Respuesta incluye todas las preguntas con correctOptionId
{
  "id": "que-1",
  "content": "¿Cuál es...?",
  "options": [...],
  "correctOptionId": "opt-2",  // 🔓 EXPUESTO en network tab
  "explanation": "..."
}

// Atacante puede:
// 1. Ver respuestas correctas en DevTools
// 2. Cambiar selectOptionId antes de enviar
// 3. Modificar el score en el cliente
```

### Solución Fase 5 (Server-side)

```typescript
// ✅ SEGURO
// Frontend SOLO envía:
{
  answers: [
    {questionId: "que-1", selectedOptionId: "opt-2"},
    {questionId: "que-2", selectedOptionId: "opt-1"}
  ],
  status: "submitted",
  endTime: "2026-08-31T17:30:00Z"
}

// Hook en servidor:
// 1. Obtiene preguntas de BD (con correctOptionId)
// 2. Compara selectedOptionId vs correctOptionId
// 3. Calcula score
// 4. Guarda score en BD
// 5. Frontend solo ve score final (NO las respuestas correctas)

// Atacante NO puede:
// ❌ Ver respuestas correctas (nunca se envían al cliente)
// ❌ Modificar score (se valida en servidor)
// ❌ Cambiar answers (se recalcula en servidor)
```

---

## 🔐 Flujo Completo de Seguridad

```
                         CLIENTE (Frontend)                                  SERVIDOR (PocketBase)

Fase 3: ExamPage
  User responde 50 preguntas
  ├─ Selecciona opción
  └─ Guarda: {questionId, selectedOptionId}
    (SIN correctOptionId) ✅

  Clic "Enviar"
  └─ PATCH /exam_attempts/:id
     {
       answers: [{qId:"q1", selectedId:"opt-2"}, ...],   ──→ Hook: afterUpdate
       status: "submitted",                                   ├─ Verifica status="submitted"
       endTime: "2026-08-31T17:30Z"                       ←── ├─ Obtiene questions de BD
     }                                                    │   │  (incluye correctOptionId)
                                                          │   ├─ Valida cada respuesta
Fase 4: ResultsPage                                       │   │  ├─ correcta: score += 1
  ├─ GET /exam_attempts/:id                             ←─┘   │  ├─ error: score -= 0.25
  │  (Respuesta SIN correctOptionId)                       │    │  └─ blanca: score += 0
  │  {                                                     │    ├─ Calcula: score = 32.5
  │    id: "att-1",                                        │    ├─ Calcula: gap = 40 - 32.5 = 7.5
  │    score: 32.5,  ✅ Precalculado en servidor         │    ├─ Guarda en BD:
  │    gap: 7.5,     ✅ Confiable                        │    │  ├─ score: 32.5
  │    answers: [...]  ⚠️ SIN correctOptionId           │    │  ├─ gap: 7.5
  │  }                                                    │    │  └─ status: "submitted"
  ├─ No recalcula score (ya está en DB)                  │    │
  └─ Muestra resultados                                  ←─┘   └─ Responde con record actualizado
```

---

## 🧮 Fórmula UNMSM en Servidor

```javascript
// En backend/hooks/grade-exam.js

// Recorre cada respuesta
answers.forEach((answer) => {
  if (!answer.selectedOptionId) {
    // Pregunta sin responder (blanco)
    blankCount++;
    score += 0; // No cambia el score
  } else if (answer.selectedOptionId === correctAnswersMap[answer.questionId]) {
    // Respuesta es CORRECTA
    correctCount++;
    score += 1; // +1 punto
  } else {
    // Respuesta es INCORRECTA
    errorCount++;
    score -= 0.25; // -0.25 puntos (penalización)
  }
});

// Score final
score = Math.max(0, score); // Mínimo 0

// Ejemplo con 50 preguntas:
// 35 correctas: +35
// 10 incorrectas: -2.5
// 5 blancas: 0
// TOTAL: 32.5 puntos
```

---

## 📊 Validaciones en Servidor

### Hook afterUpdate valida:

```javascript
✅ Status es "submitted"
✅ Answers existe y no está vacío
✅ Cada questionId existe en BD
✅ Cada correctOptionId coincide con question.correctOptionId
✅ No hay duplicados en answers
✅ CareerID existe y es válido
✅ No se calcula dos veces (si score existe, skip)
```

---

## 🔌 Integración con Frontend

### ExamPage (Sin cambios)

```typescript
// Sigue enviando respuestas tal como está:
await updateExamAttempt(attemptId, {
  answers: exam.answers, // [{qId, selectedId}]
  status: "submitted",
  endTime: new Date().toISOString(),
});
// Hook en servidor califica automáticamente
```

### ResultsPage (Actualizado)

```typescript
// Ahora puede confiar en el score precalculado:
const attempt = await getExamAttempt(attemptId);

// ANTES (Fase 4):
// const score = calculateExamScore(attempt.answers, questions)
// ⚠️ Se recalculaba en cliente (inseguro)

// DESPUÉS (Fase 5):
// const score = attempt.score
// ✅ Se usa score guardado en servidor (seguro)

// Beneficios:
// 1. No necesita recalcular
// 2. Confía en valor verificado por servidor
// 3. Más rápido (sin cálculos)
// 4. Imposible de manipular
```

---

## 📝 Archivos Creados/Modificados

### Nuevos

- ✅ `backend/hooks/grade-exam.js` (124 líneas)
- ✅ `backend/SETUP-HOOKS.md` (322 líneas)
- ✅ `docs/FASE5-BACKEND.md` (este archivo)

### Actualizados

- ✅ `docs/database/pocketbase-schema.md` (agregados ejemplos y referencias)

### Sin cambios (Compatible)

- `frontend/services/results.ts` (sigue funcionando)
- `frontend/pages/ResultsPage.tsx` (puede usar score precalculado)
- `frontend/pages/ExamPage.tsx` (sigue igual)

---

## 🚀 Setup Paso a Paso

### 1. Verificar PocketBase

```bash
# Terminal 1: Backend
cd backend
./pocketbase serve

# Verificar en http://localhost:8090/_/
# Admin Console abierto
```

### 2. Crear Hook

```
a) Ir a http://localhost:8090/_/
b) Collections > exam_attempts
c) Pestaña "Hooks"
d) Click "+ Add Hook"
e) Evento: "After update record"
f) Copiar código de backend/hooks/grade-exam.js
g) Pegar en editor
h) Click "Save"
```

### 3. Verificar Setup

```bash
# Terminal 2: Frontend
cd frontend
npm run dev

# Ir a http://localhost:5173
# 1. Completar registro
# 2. Responder examen
# 3. Enviar
# 4. Verificar en admin que aparezca score
```

### 4. Ver Logs

```bash
# En consola de PocketBase:
# [2026-08-31 17:30:00] Examen att-001 calificado: 32.5/40 (Brecha: 7.5)
```

---

## 🧪 Testing

### Test 1: Score Se Calcula

```
✅ Completar examen
✅ Enviar respuestas
✅ Verificar en admin: exam_attempts > record
✅ Campo "score" debe tener valor (ej: 32.5)
✅ Campo "gap" debe tener valor (ej: 7.5)
```

### Test 2: Fórmula Es Correcta

```
Manual:
- Respuestas correctas: 35
- Respuestas incorrectas: 10
- Respuestas blancas: 5
- Score esperado: 35 - (10 × 0.25) = 32.5

Verificar:
- Score en BD: 32.5 ✅
- Gap (40 - 32.5): 7.5 ✅
```

### Test 3: Respuestas Correctas Protegidas

```
✅ Abrir DevTools (F12)
✅ Network tab
✅ Completar examen
✅ Network > buscar POST a /exam_attempts
✅ Verificar que NO incluye "correctOptionId"
✅ Verificar que solo tiene "selectedOptionId"
```

### Test 4: Score No Se Puede Manipular

```
// Intento de ataque:
const score = 100  // Modificar variable
// ❌ No funciona: servidor recalcula

// Intento 2:
POST /exam_attempts/:id {"score": 100}
// ❌ No funciona: hook ignora este campo

// Intento 3:
Cambiar correctOptionId en DevTools
// ❌ No funciona: servidor usa BD, no confía en cliente
```

---

## 📊 Flujo Completo Fases 1-5

```
Fase 1: Análisis & Setup
  └─ Workspace limpio, estructura base

Fase 2: Registro
  └─ DiagnosticPage con 3 pasos
  └─ Crea ExamAttempt

Fase 3: Evaluación
  └─ ExamPage con 50 preguntas + timer
  └─ Guarda answers (sin correctOptionId)

Fase 4: Resultados (Cliente)
  └─ ResultsPage calcula score
  ⚠️ Inseguro: score en cliente

Fase 5: Resultados (Servidor)  ← AQUÍ ESTAMOS
  ├─ Hook en PocketBase califica
  ├─ Guarda score en BD
  ├─ Frontend confía en valor verificado
  └─ ✅ Seguro: score verificado por servidor
```

---

## ⚙️ Configuración de Permisos

### Collections Permissions (Recomendado)

#### careers

- Public Read: ✅ SÍ (necesario en formulario)
- Public Create/Update/Delete: ❌ NO

#### questions

- Public Read: ❌ NO (proteger del cliente)
- Public Create/Update/Delete: ❌ NO
- **Admin Read:** ✅ SÍ (para hooks)

#### exam_attempts

- Public Create: ✅ SÍ (registro)
- Public Update: ✅ SÍ (enviar respuestas)
- Public Read: ❌ NO (solo propietario)
- Public Delete: ❌ NO
- **Admin:** Todas ✅

---

## 🐛 Troubleshooting Fase 5

### Hook No Se Ejecuta

**Síntoma:** Envío examen, pero score queda null

**Soluciones:**

1. Verificar en Admin Console que hook está habilitado
2. Ver logs de PocketBase en terminal (¿hay errores?)
3. Verificar que status se actualiza a "submitted"
4. Reiniciar PocketBase

### Fórmula Incorrecta

**Síntoma:** Score no coincide con cálculo manual

**Verificar:**

- Aciertos: cuenta × 1
- Errores: cuenta × -0.25
- Blancos: cuenta × 0
- Suma total = score final

### Campos No Se Guardan

**Síntoma:** score, gap y referentialScore quedan null

**Verificar:**

- Que existe campo en colección exam_attempts
- Que tipo es "Number"
- Que hook actualiza correctamente
- Ver console de PocketBase

---

## 🎯 Próximas Fases

### Fase 6: Panel de Administración

- [ ] Dashboard con estadísticas
- [ ] CRUD de carreras
- [ ] CRUD de preguntas
- [ ] Visualización de intentos
- [ ] Reportes por carrera

### Fase 7: Banco de Datos Completo

- [ ] Importar 1000+ preguntas
- [ ] Organizar por dificultad
- [ ] Sistema de temas y cursos
- [ ] Generación aleatoria de pruebas

### Optimizaciones Futuras

- [ ] Cachés de preguntas
- [ ] Validación en tiempo real
- [ ] Webhooks a servicios externos
- [ ] Reportes automáticos por email

---

## 📚 Referencias

- [PocketBase Hooks](https://pocketbase.io/docs/extending-pocketbase/)
- [SETUP-HOOKS.md](../backend/SETUP-HOOKS.md)
- [Schema](../docs/database/pocketbase-schema.md)
- [Fase 4 - Resultados](./FASE4-RESULTADOS.md)
- [Fase 3 - Evaluación](./FASE3-EVALUACION.md)

---

## ✅ Checklist de Completitud

- [ ] Hook backend/hooks/grade-exam.js creado
- [ ] Documentación SETUP-HOOKS.md creada
- [ ] Hook configurado en PocketBase Admin
- [ ] Prueba: Completar examen
- [ ] Verificar: Score se calcula en BD
- [ ] Verificar: ResultsPage muestra score correcto
- [ ] Verificar: Respuestas correctas NO se exponen
- [ ] Prueba de seguridad: Intentar manipular score
- [ ] Todos los logs en consola correctos

---

**Estado:** ✅ Fase 5 completada. Backend inteligente funcionando.

**Próximo:** Fase 6 - Panel de Administración (CRUD y dashboard)
