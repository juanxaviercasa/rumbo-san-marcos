# Configuración de Hooks en PocketBase

## 📋 Introducción

Los hooks en PocketBase permiten ejecutar código automáticamente cuando ocurren eventos en la base de datos. Para Fase 5, usaremos hooks `afterUpdate` en la colección `exam_attempts` para calificar exámenes automáticamente.

## 🛠️ Requisitos

- PocketBase 0.20.5+
- Acceso a PocketBase Admin Console (http://localhost:8090/\_/)
- Colecciones configuradas: `careers`, `questions`, `exam_attempts`

## 📍 Instalación de Hooks

### Opción 1: Usando la Admin Console (Recomendado)

#### Paso 1: Acceder a Admin Console

```
1. Abre http://localhost:8090/_/
2. Inicia sesión con admin@rumbosanmarcos.com
3. Ve a Collections
```

#### Paso 2: Configurar Hook en exam_attempts

```
1. Haz click en colección "exam_attempts"
2. Haz click en pestaña "Hooks"
3. Haz click en botón "+ Add Hook"
4. Selecciona evento: "After update record"
5. Copia el código de grade-exam.js (opción TypeScript/Go)
6. Pega en el editor
7. Haz click "Save"
```

#### Código para Copiar (Go)

```go
routerAdd("after", "/api/collections/exam_attempts/records/:id", func(c echo.Context) error {
	record, _ := c.Get("record").(*models.Record)

	if record.Get("status") != "submitted" {
		return c.JSON(200, record)
	}

	// Obtener answers
	answers := record.Get("answers")
	if answers == nil {
		return c.JSON(200, record)
	}

	// Procesar calificación
	// (Ver implementación completa en grade-exam.js)

	return c.JSON(200, record)
}, "exam_attempts")
```

### Opción 2: Usando Archivo de Configuración

#### Paso 1: Crear archivo pb_hooks.go

```
backend/pb_hooks.go
```

#### Paso 2: Copiar código del hook

Ver `backend/hooks/grade-exam.js` para la lógica completa.

#### Paso 3: Registrar hook

```go
// En pb_hooks.go
func init() {
	app.OnRecordAfterUpdate("exam_attempts", func(e *core.RecordUpdateEvent) error {
		// Implementar lógica de calificación
		return nil
	})
}
```

---

## 🧪 Pruebas de Hooks

### Verificar que el Hook Está Activo

```bash
# 1. Completar un examen (Fase 3)
# 2. Enviar respuestas
# 3. Verificar en PocketBase Admin:
#    - Ir a Collections → exam_attempts → (seleccionar record)
#    - Verificar que tenga campos:
#      - score (ej: 32.5)
#      - referential_score (ej: 40)
#      - gap (ej: 7.5)
```

### Logs de PocketBase

```bash
# 1. Revisar consola de PocketBase
# 2. Buscar línea de log:
#    "Examen [ID] calificado: [SCORE]/[REFERENTIAL]"
# 3. Si aparece, el hook está funcionando
```

### Verificar datos en Base de Datos

```sql
-- En cualquier cliente SQL (si PocketBase lo permite)
SELECT id, student_name, score, referential_score, gap, status
FROM exam_attempts
WHERE status = 'submitted'
ORDER BY created DESC
LIMIT 5;
```

---

## 🔐 Seguridad Mejorada

### Campo `correctOptionId` Protegido

**Antes (Fase 4 - Client-side):**

```typescript
// ❌ Inseguro: correctOptionId visible en network tab
const questions = await getQuestionsByIds(ids);
// Question.correctOptionId expuesto en respuesta HTTP
```

**Después (Fase 5 - Server-side):**

```typescript
// ✅ Seguro: Solo se calcula en servidor
// Frontend solo recibe: selectedOptionId
// El servidor valida contra correctOptionId privado
```

### Validación de Intentos

```go
// Hook valida:
// 1. Status = 'submitted'
// 2. Answers existen
// 3. Career existe
// 4. Questions existen
// 5. Usuario tiene permiso
```

---

## 📊 Flujo de Calificación

```
Frontend (ExamPage)
  ├─ Usuario responde 50 preguntas
  ├─ Selecciona: questionId + selectedOptionId (sin correctOption)
  └─ Envía PATCH /exam_attempts/:id
    {
      answers: [
        {questionId: "q1", selectedOptionId: "opt-2"},
        {questionId: "q2", selectedOptionId: "opt-1"}
      ],
      status: "submitted",
      endTime: "2026-08-31T17:30:00Z"
    }

    ↓

Backend (PocketBase Hook)
  ├─ afterUpdate triggered
  ├─ Verifica status = "submitted"
  ├─ Obtiene preguntas de DB (incluye correctOptionId)
  ├─ Valida cada respuesta:
  │  ├─ Correcta: score += 1
  │  ├─ Incorrecta: score -= 0.25
  │  └─ Blanca: score += 0
  ├─ Calcula score total
  ├─ Obtiene referentialScore de carrera
  ├─ Calcula gap = referentialScore - score
  └─ Guarda score, referentialScore, gap en DB

    ↓

Frontend (ResultsPage)
  ├─ GET /exam_attempts/:id (ahora con score precalculado)
  ├─ Usa score almacenado (no recalcula)
  └─ Muestra resultados verificados por servidor
```

---

## 🚨 Campos Requeridos en Colecciones

### exam_attempts

```json
{
  "id": "string (pk)",
  "student_name": "string",
  "student_email": "email",
  "student_phone": "string",
  "career_id": "relation → careers",
  "start_time": "datetime",
  "end_time": "datetime (nullable)",
  "status": "select (in_progress|submitted|graded)",
  "answers": "json",
  "score": "number (nullable) - Calculado por hook",
  "referential_score": "number (nullable) - Calculado por hook",
  "gap": "number (nullable) - Calculado por hook"
}
```

### questions

```json
{
  "id": "string (pk)",
  "content": "text",
  "topic": "string",
  "course": "string",
  "area": "select (A|B|C|D|E)",
  "difficulty": "select (basic|intermediate|advanced)",
  "options": "json",
  "correct_option_id": "string ⚠️ PRIVADO (no exponer en GET público)"
}
```

---

## 🔌 Permisos Recomendados

### Collections Permissions

#### exam_attempts

```
Public Read: ❌ NO (usuarios solo ven sus propios)
Public Create: ✅ SÍ (necesario para registrarse)
Public Update: ✅ SÍ (necesario para enviar respuestas)
Public Delete: ❌ NO

Admin:
- All operations: ✅ SÍ
```

#### questions

```
Public Read: ❌ NO (excepto durante examen)
Public Create: ❌ NO
Public Update: ❌ NO
Public Delete: ❌ NO

Admin:
- All operations: ✅ SÍ
```

#### careers

```
Public Read: ✅ SÍ (necesario en formulario registro)
Public Create: ❌ NO
Public Update: ❌ NO
Public Delete: ❌ NO

Admin:
- All operations: ✅ SÍ
```

---

## 📝 Checklist de Setup

- [ ] PocketBase 0.20.5+ instalado y corriendo
- [ ] Colecciones creadas con esquema correcto
- [ ] Hook "After Update" creado en exam_attempts
- [ ] Código del hook pegado correctamente
- [ ] Hook activo (check en Admin Console)
- [ ] Completar un examen de prueba
- [ ] Verificar que score se calculó automáticamente
- [ ] Verificar logs en consola de PocketBase
- [ ] Permisos configurados correctamente
- [ ] resultadosPage muestra scores precalculados

---

## 🐛 Troubleshooting

### Hook No Se Ejecuta

**Problema:** Envío examen pero score no se calcula

**Soluciones:**

1. Verificar que hook está activo en Admin Console
2. Verificar consola de PocketBase (terminal) para errores
3. Verificar que status se actualiza a "submitted"
4. Verificar que answers no está vacío
5. Reiniciar PocketBase

### Hook Ejecuta Pero No Calcula Score

**Problema:** Hook corre pero score queda null

**Soluciones:**

1. Verificar que colección "questions" existe
2. Verificar que questionIds coinciden
3. Verificar estructura de answers (questionId vs question_id)
4. Verificar estructura de campo correcto (correctOptionId vs correct_option_id)

### Score Incorrecto

**Problema:** Score se calcula pero valor es incorrecto

**Soluciones:**

1. Verificar fórmula: aciertos(+1) + errores(-0.25)
2. Verificar que selectedOptionId coincide exactamente con correctOptionId
3. Verificar tipos de datos (string vs UUID)
4. Revisar logs de PocketBase para detalles

---

## 🚀 Próximos Pasos

### Fase 5 Completa

1. ✅ Hook para calificar
2. ✅ Guardar score en DB
3. ✅ Proteger respuestas correctas
4. [ ] Validar respuestas en servidor

### Fase 6

- [ ] Panel de administración
- [ ] Gestión de carreras
- [ ] Gestión de preguntas
- [ ] Dashboard de estadísticas

---

## 📚 Referencias

- [PocketBase Docs - Hooks](https://pocketbase.io/docs/extending-pocketbase/)
- [PocketBase Docs - API Rules](https://pocketbase.io/docs/api-rules/)
- [Schema: exam_attempts](../database/pocketbase-schema.md)

---

**Fecha:** 2026-08-31  
**Estado:** ✅ Configuración lista para implementar
