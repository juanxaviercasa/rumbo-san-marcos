# PocketBase Schema — Rumbo San Marcos

Guía de colecciones y campos a crear en PocketBase para que la aplicación funcione correctamente.

## 1. Colección: `careers`

**Descripción:** Almacena todas las carreras de UNMSM mapeadas por bloques.

**Campos:**

| Campo               | Tipo   | Requerido | Notas                         |
| ------------------- | ------ | --------- | ----------------------------- |
| `code`              | Text   | ✅        | Ej: ING001                    |
| `name`              | Text   | ✅        | Nombre de carrera             |
| `faculty`           | Text   | ✅        | Ej: Ingeniería, Ciencias      |
| `block`             | Select | ✅        | Opciones: A, B, C, D, E       |
| `referentialScore`  | Number | ✅        | Sobre 2000                    |
| `weights`           | Json   | ✅        | Pesos por materia (ver abajo) |
| `estimatedDuration` | Number | ✅        | Minutos del examen            |

**Estructura de `weights` (JSON):**

```json
{
  "mathematics": 1.0,
  "physics": 0.8,
  "chemistry": 0.6,
  "biology": 0.4,
  "spanish": 0.5,
  "history": 0.3,
  "geography": 0.3,
  "civics": 0.2
}
```

**Ejemplo de registro:**

```json
{
  "code": "ING001",
  "name": "Ingeniería Civil",
  "faculty": "Ingeniería",
  "block": "A",
  "referentialScore": 1450,
  "weights": { "mathematics": 1.0, "physics": 0.9, ... },
  "estimatedDuration": 180
}
```

**Permisos:**

- Lectura: ✅ Público
- Crear: 🔒 Admin solo
- Actualizar: 🔒 Admin solo
- Eliminar: 🔒 Admin solo

---

## 2. Colección: `questions`

**Descripción:** Banco de reactivos (preguntas) para las evaluaciones.

**Campos:**

| Campo             | Tipo   | Requerido | Notas                                   |
| ----------------- | ------ | --------- | --------------------------------------- |
| `topic`           | Text   | ✅        | Ej: Límites, Derivadas                  |
| `course`          | Text   | ✅        | Ej: Matemática, Física                  |
| `area`            | Select | ✅        | Opciones: A, B, C, D, E                 |
| `difficulty`      | Select | ✅        | Opciones: basic, intermediate, advanced |
| `content`         | Text   | ✅        | Enunciado de la pregunta                |
| `options`         | Json   | ✅        | Array de opciones (ver abajo)           |
| `correctOptionId` | Text   | ✅        | ID de la opción correcta                |
| `explanation`     | Text   | ✅        | Explicación detallada                   |

**Estructura de `options` (JSON):**

```json
[
  {
    "id": "opt-1",
    "text": "Opción A: Primera respuesta",
    "isCorrect": true
  },
  {
    "id": "opt-2",
    "text": "Opción B: Segunda respuesta",
    "isCorrect": false
  },
  {
    "id": "opt-3",
    "text": "Opción C: Tercera respuesta",
    "isCorrect": false
  },
  {
    "id": "opt-4",
    "text": "Opción D: Cuarta respuesta",
    "isCorrect": false
  }
]
```

**Ejemplo de registro:**

```json
{
  "topic": "Derivadas",
  "course": "Matemática",
  "area": "A",
  "difficulty": "intermediate",
  "content": "Calcular la derivada de f(x) = x² + 3x",
  "options": [...],
  "correctOptionId": "opt-1",
  "explanation": "Usando la regla de la potencia..."
}
```

**Permisos:**

- Lectura: ✅ Público
- Crear: 🔒 Admin solo
- Actualizar: 🔒 Admin solo
- Eliminar: 🔒 Admin solo

---

## 3. Colección: `exam_attempts`

**Descripción:** Registro de intentos de examen y calificaciones.

**Campos:**

| Campo              | Tipo     | Requerido | Notas                                    |
| ------------------ | -------- | --------- | ---------------------------------------- |
| `studentName`      | Text     | ✅        | Nombre completo                          |
| `studentEmail`     | Email    | ✅        | Correo del estudiante                    |
| `studentPhone`     | Text     | ✅        | Teléfono                                 |
| `careerId`         | Relation | ✅        | Referencia a `careers`                   |
| `startTime`        | DateTime | ✅        | Hora de inicio                           |
| `endTime`          | DateTime | ❌        | Hora de fin                              |
| `status`           | Select   | ✅        | Opciones: in_progress, submitted, graded |
| `answers`          | Json     | ✅        | Respuestas del estudiante (ver abajo)    |
| `score`            | Number   | ❌        | Puntaje final (sobre 2000)               |
| `referentialScore` | Number   | ❌        | Puntaje de corte                         |
| `gap`              | Number   | ❌        | Brecha (score - referentialScore)        |

**Estructura de `answers` (JSON):**

```json
[
  {
    "questionId": "que-1",
    "selectedOptionId": "opt-2",
    "isCorrect": true,
    "timeSpent": 45
  },
  {
    "questionId": "que-2",
    "selectedOptionId": "opt-1",
    "isCorrect": false,
    "timeSpent": 120
  }
]
```

**Ejemplo de registro (inicio):**

```json
{
  "studentName": "Juan Pérez",
  "studentEmail": "juan@example.com",
  "studentPhone": "999999999",
  "careerId": "ing-1",
  "startTime": "2026-08-31T14:30:00Z",
  "status": "in_progress",
  "answers": []
}
```

**Ejemplo de registro (después de enviar, con calificación):**

```json
{
  "studentName": "Juan Pérez",
  "studentEmail": "juan@example.com",
  "studentPhone": "999999999",
  "careerId": "ing-1",
  "startTime": "2026-08-31T14:30:00Z",
  "endTime": "2026-08-31T17:30:00Z",
  "status": "submitted",
  "answers": [
    { "questionId": "que-1", "selectedOptionId": "opt-2", "timeSpent": 45 },
    { "questionId": "que-2", "selectedOptionId": "opt-1", "timeSpent": 120 }
  ],
  "score": 32.5,
  "referentialScore": 40,
  "gap": 7.5
}
```

**⚠️ IMPORTANTE - Fase 5 Backend:**

Los campos `score`, `referentialScore` y `gap` se **calculan automáticamente** en el servidor mediante hooks PocketBase.

- ✅ **NO** se envían desde el frontend
- ✅ **SÍ** se calculan en servidor cuando status = "submitted"
- ✅ Fórmula: `score = aciertos(+1) + errores(-0.25) + blancos(0)`
- ✅ Se guarda en BD como valores de referencia

Ver: [SETUP-HOOKS.md](../backend/SETUP-HOOKS.md)

**Permisos:**

- Lectura: 🔒 Solo propietario o admin
- Crear: ✅ Público
- Actualizar: ✅ Público (pero validar en hooks)
- Eliminar: 🔒 Admin solo

---

## 4. Colección: `users` (Opcional)

Si quieres panel de administración con login:

**Campos:**

| Campo      | Tipo     | Requerido |
| ---------- | -------- | --------- |
| `email`    | Email    | ✅        |
| `password` | Password | ✅        |
| `name`     | Text     | ✅        |
| `role`     | Select   | ✅        |

**Roles:** admin, editor

---

## 🔧 Hooks Recomendados (JavaScript en PocketBase)

### Hook 1: `exam_attempts.before.create`

Validar datos al crear un nuevo intento:

```javascript
// Validar que el email es válido
if (!req.data.studentEmail) {
  throw new BadRequest("Email es requerido");
}

// Validar que la carrera existe
const career = $app.dao().findRecordById("careers", req.data.careerId);
if (!career) {
  throw new NotFound("Carrera no encontrada");
}

// Asignar referential score
req.data.referentialScore = career.get("referentialScore");
```

### Hook 2: `exam_attempts.before.update`

Ejecutar calificación cuando status cambia a 'submitted':

```javascript
// Si status cambió a 'submitted', calificar
if (req.data.get("status") === "submitted") {
  const answers = req.data.get("answers") || [];
  let correctCount = 0;
  let incorrectCount = 0;

  // Contar respuestas correctas e incorrectas
  for (const answer of answers) {
    if (answer.isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  // Esquema UNMSM: acierto +1 punto, error -0.25 puntos, blanco 0
  const score = correctCount * 1 - incorrectCount * 0.25;
  const scoreOn2000 = (score / answers.length) * 2000;

  req.data.set("score", Math.round(scoreOn2000));
  req.data.set("status", "graded");
  req.data.set("endTime", new Date().toISOString());

  // Calcular brecha
  const referentialScore = req.data.get("referentialScore") || 1300;
  req.data.set("gap", Math.round(scoreOn2000) - referentialScore);
}
```

---

## ✅ Checklist de Configuración

- [ ] Crear colección `careers`
- [ ] Crear colección `questions`
- [ ] Crear colección `exam_attempts`
- [ ] Configurar permisos de lectura/escritura
- [ ] Crear hooks para validación y calificación
- [ ] Cargar datos iniciales (40 carreras + 67 preguntas)
- [ ] Probar integración con frontend

---

## 🔌 Cómo Crear Colecciones en PocketBase

1. Ir a http://localhost:8090/\_/
2. Hacer login con usuario admin
3. Ir a "Collections"
4. Click en "+" para crear nueva colección
5. Ingresar nombre y campos
6. Configurar permisos
7. Guardar

**O importar JSON** si prefieres: `Settings > Import Collections`

---

## 📞 Notas

- Los puntajes de corte son **referenciales**. Puedes ajustarlos desde admin.
- Las preguntas deben tener 4 opciones cada una
- El campo `weights` es un JSON personalizado por carrera
- Los hooks son opcionales pero recomendados para validación automática
