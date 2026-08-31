# ANÁLISIS DE ARCHIVOS - Rumbo San Marcos

## 📊 CLASIFICACIÓN DE ARCHIVOS

### 🗑️ ELIMINAR (100% Inútiles)

#### **Builds Compilados** (6 carpetas)

```
build_1784626766175_v1.24.1/
build_1785138748813_v1.26.0/
build_1785826413117_v1.26.0/
build_1786970093959_v1.29.0/
build_1787297788605_v1.30.1/
build_1787913275780_v1.30.1/
```

**Por qué:** Son archivos compilados/minificados. No son editable. El código fuente se reconstruirá desde cero.

#### **Archivos de Caché y Datos de Chat**

```
chat (archivo)
chat_siteid_*.coderick.net (5 archivos)
index_hash_* (19+ archivos)
index_siteid_*_hash_* (6 archivos)
```

**Por qué:** Son datos de sesiones de Coderick AI, no contienen información del proyecto.

#### **Traducciones Genéricas**

```
_external/spa-translations.siteground.com/
```

**Por qué:** Son traducciones del SiteGround Web Builder, no específicas de Rumbo San Marcos.

#### **Assets/Fuentes Genéricas**

```
_external/spa-packages.siteground.com/styleguide-assets/
_external/fonts.gstatic.com/
_external/fonts.googleapis.com/
```

**Por qué:** Assets del sistema SiteGround, no del proyecto. Las fuentes se descargarán desde CDN en la nueva app.

#### **Scripts de Tracking/Analytics**

```
_external/script.crazyegg.com/
_external/tracking.crazyegg.com/
```

**Por qué:** Código de tracking de Siteground, no relevante.

#### **Otros CDN Cache**

```
_external/d1rozh26tys225.cloudfront.net/
_external/i.pravatar.cc/
_external/storage.googleapis.com/
_external/uapi.siteground.com/
_external/www.google.com.pe/
_external/preview-vc*.coderick.net/
```

**Por qué:** Caché de recursos externos, no necesarios para desarrollo.

---

### ✅ MANTENER (Referencia Útil)

#### **index.html**

**Por qué:** Documentación de cómo la IA compiló el proyecto. Útil como referencia arquitectónica.

#### **\_external/spa-packages.siteground.com/styleguide-assets/svg/ (SVG icons)**

**Por qué:** Podrían contener iconos reutilizables. Revisar si hay algo aplicable a Rumbo San Marcos.

---

## 📋 RESUMEN DE LIMPIEZA

| Categoría              | Acción      | Cantidad     | Tamaño\*      |
| ---------------------- | ----------- | ------------ | ------------- |
| Builds                 | 🗑️ Eliminar | 6 carpetas   | ~8-9 MB       |
| Caché/Chat             | 🗑️ Eliminar | 30+ archivos | ~5-10 MB      |
| Traducciones genéricas | 🗑️ Eliminar | 1 carpeta    | ~500 KB       |
| Assets SiteGround      | 🗑️ Eliminar | 7+ carpetas  | ~10-15 MB     |
| **TOTAL A ELIMINAR**   |             |              | **~25-35 MB** |

| Categoría            | Acción      | Cantidad     |
| -------------------- | ----------- | ------------ |
| index.html           | ✅ Mantener | 1 archivo    |
| SVG Assets           | ✅ Revisar  | 10+ archivos |
| **TOTAL A MANTENER** |             | **Mínimo**   |

---

## 🎯 ESTRUCTURA DEL WORKSPACE DESPUÉS DE LIMPIEZA

```
Rumbo_San_Marcos/
├── 📄 index.html              (referencia)
├── 📄 ANALISIS_LIMPIEZA.md    (este archivo)
├── 📂 assets/                 (NUEVO - SVG y recursos del proyecto)
└── 📂 _external/              (opcional - si queremos conservar algunos SVG)
```

---

## ⚠️ ACCIONES RECOMENDADAS

1. **Fase 1 - Limpieza** ✂️
   - [ ] Eliminar todas las 6 carpetas de builds
   - [ ] Eliminar todos los archivos de caché/chat
   - [ ] Eliminar \_external COMPLETO (opcional: guardar solo SVG)
   - [ ] Conservar index.html como referencia

2. **Fase 2 - Restructuración**
   - [ ] Crear carpetas: src/, backend/, docs/, assets/
   - [ ] Crear estructura de proyecto React nuevo
   - [ ] Extraer SVG útiles a assets/

3. **Fase 3 - Desarrollo**
   - [ ] Setup de React + TypeScript + Vite
   - [ ] Setup de PocketBase backend
   - [ ] Implementación de flujos

---

## 🔍 REVISIÓN DE SVG ASSETS

**Ubicación:** `_external/spa-packages.siteground.com/styleguide-assets/svg/`

**Contenido:**

- `animated/` → Animaciones (loading, thinking, etc.) - POSIBLEMENTE ÚTILES
- `material/` → Material Design icons - REUTILIZABLES
- Icons varios - REVISAR

**Decisión:**

- Si algunos SVG son del brand Rumbo (guinda), MANTENER
- Si son todos genéricos SiteGround, ELIMINAR

---

## 📝 NOTA IMPORTANTE

El archivo `index.html` es un SPA compilado de Coderick AI. Lo guardamos como **referencia de la arquitectura**, pero en desarrollo usaremos:

- Nuevo `index.html` generado por Vite
- Nuevo `src/main.tsx` con React + TypeScript
- Nueva configuración completa
