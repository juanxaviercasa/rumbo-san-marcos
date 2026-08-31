# Rumbo San Marcos — Plataforma de Diagnóstico Adaptativo

Plataforma web completa de evaluación diagnóstica personalizada para postulantes de la Universidad Nacional Mayor de San Marcos (UNMSM).

## 🎯 Características Principales

### 1. Registro y Mapeo Automático de Carreras

- Selección de Facultad y Carrera Profesional
- Mapeo automático a bloques (A–E) según pesos de materias
- Visualización de puntajes de corte referenciales

### 2. Motor de Evaluación Dinámica

- Prueba personalizada por carrera
- Filtrado inteligente: área, curso, tema, dificultad
- Cronómetro global estricto con autoenvío
- Navegación intuitiva entre preguntas
- Protección: respuestas correctas no se exponen al navegador

### 3. Calibración y Análisis Predictivo

- Calificación con esquema tipo UNMSM
- Cálculo de brecha de puntaje vs. corte referencial
- Medidor radial visual (gesto de firma del diseño)

### 4. Ruta de Estudio Inteligente

- Desglose de competencias por curso
- Identificación de fortalezas y debilidades
- Priorización por peso en la carrera
- Revisión pregunta por pregunta con explicaciones
- CTA de inscripción directo a correo de la academia

## 📁 Estructura del Proyecto

```
Rumbo_San_Marcos/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas principales
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Servicios API y PocketBase
│   │   ├── types/              # Tipos TypeScript
│   │   ├── utils/              # Utilidades
│   │   ├── styles/             # CSS y Tailwind
│   │   ├── main.tsx            # Entry point
│   │   └── App.tsx             # Root component
│   ├── public/                 # Assets estáticos
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                     # PocketBase
│   ├── collections/            # Esquema de colecciones
│   ├── migrations/             # Scripts de migración
│   ├── hooks/                  # Lógica backend (calificación)
│   ├── config/                 # Configuración
│   └── pb_schema.json          # Schema de PocketBase
│
├── docs/                        # Documentación
│   ├── api/                    # Documentación de API
│   ├── database/               # Esquema de BD
│   └── deployment/             # Guías de despliegue
│
├── assets/                      # Recursos del proyecto
│   ├── icons/
│   ├── images/
│   └── fonts/
│
└── .github/                     # GitHub workflows (CI/CD)
```

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- PocketBase
- npm o pnpm

### Instalación Frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Instalación Backend

```bash
cd backend
# Descargar PocketBase: https://pocketbase.io
# Crear colecciones según schema en docs/database/
```

## 📋 Fases de Desarrollo

### ✅ Fase 1: Limpieza y Setup (COMPLETADA)

- Análisis y limpieza de archivos exportados
- Estructura de carpetas

### 🔄 Fase 2: Frontend Base

- Setup React + TypeScript + Vite
- Configuración Tailwind CSS
- Componentes base

### 🔄 Fase 3: Backend Setup

- Configuración PocketBase
- Creación de colecciones
- Lógica de calificación

### 🔄 Fase 4: Flujos Principales

- Página de registro
- Motor de evaluación
- Panel de resultados

### 🔄 Fase 5: Panel de Administración

- Gestión de preguntas
- Gestión de puntajes de corte
- Visualización de intentos

### 📋 Fase 6: Banco de Datos

- Carreras (40 reales mapeadas)
- Reactivos (~67 preguntas)

## 🎨 Diseño

**Identidad Visual:**

- Colores: Guinda/Granate sanmarquino
- Tipografía: Fraunces (títulos) + Inter (body)
- Componente central: Medidor de brecha radial

## 🔐 Seguridad

- Validación en servidor (calificación)
- Respuestas correctas nunca se exponen al cliente
- Captcha en formulario de inscripción
- Autenticación PocketBase

## 📞 Contacto y Soporte

Correo de administración: admin@rumbosanmarcos.com (configurable)

## 📝 Notas Importantes

- Los puntajes de corte están etiquetados como **referenciales**
- Son ajustables desde la administración
- El sistema está listo para personalización

---

**Estado:** En reconstrucción desde cero  
**Última actualización:** 2026-08-31
