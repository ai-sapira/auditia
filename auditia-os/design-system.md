# Auditia Design System v2.0
## Inspiración: Legora + Devin — Sobrio, Profesional, Regulado

---

## 1. PRINCIPIOS DE DISEÑO

### 1.1 Filosofía
- **Sobriedad**: El diseño no debe distraer del contenido
- **Claridad**: Cada elemento tiene un propósito claro
- **Confianza**: Transmite estabilidad y profesionalidad
- **Consistencia**: Mismo tratamiento visual en toda la aplicación

### 1.2 Reglas de Oro
1. El blanco es el color principal del fondo
2. El negro es el color principal de texto y acciones
3. Los grises estructuran y separan
4. Los colores de estado son sutiles y funcionales
5. Menos es más: si dudas, quita

---

## 2. PALETA DE COLORES

### 2.1 Colores Base (Neutrales)
```
--color-white:        #FFFFFF    // Fondo principal
--color-gray-25:      #FCFCFC    // Fondo secundario hover
--color-gray-50:      #FAFAFA    // Fondo secundario
--color-gray-100:     #F5F5F5    // Bordes muy sutiles, fondos terciarios
--color-gray-200:     #E5E5E5    // Bordes estándar
--color-gray-300:     #D4D4D4    // Bordes activos, iconos deshabilitados
--color-gray-400:     #A3A3A3    // Texto placeholder, texto terciario
--color-gray-500:     #737373    // Texto secundario
--color-gray-600:     #525252    // Texto secundario importante
--color-gray-700:     #404040    // Texto principal secundario
--color-gray-800:     #262626    // Texto principal
--color-gray-900:     #171717    // Texto principal fuerte
--color-black:        #0A0A0A    // Texto máximo contraste, botones primarios
```

### 2.2 Colores de Estado (Mínimos y Desaturados)
```
// SUCCESS - Verde oliva muy apagado
--color-success-50:   #F7F9F7    // Fondo
--color-success-100:  #E8EDE8    // Fondo hover
--color-success-600:  #4A5D4A    // Texto, iconos
--color-success-700:  #3D4D3D    // Texto hover

// WARNING - Ámbar muy apagado
--color-warning-50:   #FDFAF6    // Fondo
--color-warning-100:  #F5EDE0    // Fondo hover
--color-warning-600:  #8B7355    // Texto, iconos
--color-warning-700:  #6B5A45    // Texto hover

// ERROR - Rojo terracota muy apagado
--color-error-50:     #FBF8F7    // Fondo
--color-error-100:    #F0E8E6    // Fondo hover
--color-error-600:    #8B5A50    // Texto, iconos
--color-error-700:    #6B4A42    // Texto hover

// INFO - Azul gris muy apagado (OPCIONAL, usar con moderación)
--color-info-50:      #F7F9FA    // Fondo
--color-info-100:     #E8EDEF    // Fondo hover
--color-info-600:     #4A5D6A    // Texto, iconos
--color-info-700:     #3D4D5A    // Texto hover
```

### 2.3 Color de Acento Principal
```
// Un solo acento para acciones especiales (muy poco uso)
--color-accent:       #171717    // Negro = acción principal
--color-accent-hover: #0A0A0A    // Negro más intenso
```

---

## 3. TIPOGRAFÍA

### 3.1 Familias Tipográficas
```css
--font-serif: 'Source Serif 4', 'Georgia', serif;     // Títulos, elegancia
--font-sans: 'Inter', 'system-ui', sans-serif;        // Cuerpo, UI
--font-mono: 'JetBrains Mono', 'Consolas', monospace; // Datos, códigos
```

### 3.2 Escala Tipográfica
```
--text-xs:    11px / 1.5    // Etiquetas pequeñas, metadatos
--text-sm:    13px / 1.5    // Texto secundario, descripciones
--text-base:  14px / 1.6    // Texto principal
--text-md:    15px / 1.6    // Texto destacado
--text-lg:    18px / 1.4    // Subtítulos
--text-xl:    22px / 1.3    // Títulos de sección
--text-2xl:   28px / 1.2    // Títulos de página
--text-3xl:   36px / 1.1    // Títulos principales
```

### 3.3 Pesos
```
--font-normal:    400    // Texto base
--font-medium:    500    // Énfasis sutil
--font-semibold:  600    // Títulos, labels importantes
```

### 3.4 Uso de Tipografías
| Elemento | Familia | Tamaño | Peso | Color |
|----------|---------|--------|------|-------|
| Título página | Serif | 2xl/3xl | semibold | gray-900 |
| Título sección | Serif | xl | semibold | gray-900 |
| Subtítulo | Sans | lg | medium | gray-800 |
| Texto principal | Sans | base | normal | gray-700 |
| Texto secundario | Sans | sm | normal | gray-500 |
| Label/Caption | Sans | xs | medium | gray-400 |
| Datos numéricos | Mono | base | normal | gray-800 |
| Código/IDs | Mono | sm | normal | gray-500 |

---

## 4. ESPACIADO

### 4.1 Escala de Espaciado (8px base)
```
--space-0:   0px
--space-1:   4px     // Micro
--space-2:   8px     // Pequeño
--space-3:   12px    // Compacto
--space-4:   16px    // Estándar
--space-5:   20px    // Medio
--space-6:   24px    // Grande
--space-8:   32px    // Extra grande
--space-10:  40px    // Secciones
--space-12:  48px    // Bloques grandes
--space-16:  64px    // Separadores principales
```

### 4.2 Uso de Espaciado
| Contexto | Espaciado |
|----------|-----------|
| Padding interno botón pequeño | 8px 12px |
| Padding interno botón estándar | 10px 16px |
| Padding tarjetas | 20px |
| Gap entre elementos en fila | 12px |
| Gap entre secciones | 32px |
| Margen entre bloques principales | 48px |

---

## 5. COMPONENTES

### 5.1 Botones

#### Primario (Acción Principal)
```css
.btn-primary {
  background: #171717;
  color: #FFFFFF;
  border: 1px solid #171717;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.15s ease;
}
.btn-primary:hover {
  background: #0A0A0A;
  border-color: #0A0A0A;
}
```

#### Secundario (Acción Secundaria)
```css
.btn-secondary {
  background: #FFFFFF;
  color: #171717;
  border: 1px solid #E5E5E5;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
}
.btn-secondary:hover {
  background: #FAFAFA;
  border-color: #D4D4D4;
}
```

#### Ghost (Mínimo)
```css
.btn-ghost {
  background: transparent;
  color: #525252;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
}
.btn-ghost:hover {
  background: #F5F5F5;
  color: #171717;
}
```

### 5.2 Inputs

```css
.input {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  padding: 10px 12px;
  font-size: 14px;
  color: #171717;
  border-radius: 4px;
  transition: border-color 0.15s ease;
}
.input:focus {
  outline: none;
  border-color: #171717;
}
.input::placeholder {
  color: #A3A3A3;
}
```

### 5.3 Tarjetas

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  padding: 20px;
}
.card-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #F5F5F5;
  margin-bottom: 16px;
}
```

### 5.4 Tablas

```css
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #737373;
  background: #FAFAFA;
  border-bottom: 1px solid #E5E5E5;
}
.table td {
  padding: 12px 16px;
  font-size: 13px;
  color: #404040;
  border-bottom: 1px solid #F5F5F5;
}
.table tr:hover td {
  background: #FCFCFC;
}
```

### 5.5 Badges/Tags

#### Status Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
}

.badge-default {
  background: #F5F5F5;
  color: #525252;
}
.badge-success {
  background: #F7F9F7;
  color: #4A5D4A;
}
.badge-warning {
  background: #FDFAF6;
  color: #8B7355;
}
.badge-error {
  background: #FBF8F7;
  color: #8B5A50;
}
```

### 5.6 Estados Interactivos

```
:hover     → Cambio sutil de fondo o borde
:focus     → Borde negro, sin outline azul
:active    → Escala ligeramente (0.98)
:disabled  → Opacidad 0.5, cursor not-allowed
```

---

## 6. ICONOGRAFÍA

### 6.1 Estilo
- Librería: Lucide Icons
- Tamaño base: 16px (w-4 h-4)
- Tamaño grande: 20px (w-5 h-5)
- Stroke width: 1.5px (más fino que default)
- Color: Heredar del texto o gray-400 para decorativos

### 6.2 Uso
- Iconos funcionales: A la izquierda del label
- Iconos de acción: Solos o con label corto
- Iconos decorativos: Solo cuando añaden contexto

---

## 7. LAYOUT Y GRID

### 7.1 Contenedores
```
--max-width-xs:   320px
--max-width-sm:   640px
--max-width-md:   768px
--max-width-lg:   1024px
--max-width-xl:   1280px
--max-width-2xl:  1536px
```

### 7.2 Sidebar
- Ancho colapsado: 64px
- Ancho expandido: 280px
- Fondo: white
- Borde derecho: 1px solid #E5E5E5

### 7.3 Contenido Principal
- Padding horizontal: 32px (desktop), 16px (móvil)
- Padding vertical: 32px
- Max-width para legibilidad: 1200px

---

## 8. ANIMACIONES

### 8.1 Principios
- Sutiles y funcionales
- Duración corta: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### 8.2 Transiciones Estándar
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 9. ANTI-PATTERNS (Lo que NO hacer)

❌ Gradientes de color
❌ Sombras prominentes
❌ Bordes redondeados excesivos (max 6px)
❌ Colores saturados o brillantes
❌ Animaciones llamativas o largas
❌ Múltiples colores de acento
❌ Iconos grandes o decorativos sin función
❌ Texto en mayúsculas excepto para labels pequeños

---

## 10. MAPEO TAILWIND

### Clases a Usar
```
// Fondos
bg-white, bg-neutral-50, bg-neutral-100

// Bordes
border-neutral-200, border-neutral-300

// Texto
text-neutral-900, text-neutral-700, text-neutral-500, text-neutral-400

// Estados Success
bg-[#F7F9F7], text-[#4A5D4A]

// Estados Warning
bg-[#FDFAF6], text-[#8B7355]

// Estados Error
bg-[#FBF8F7], text-[#8B5A50]
```

### Reemplazos
```
emerald-* → Eliminar o usar success custom
amber-*   → Eliminar o usar warning custom
blue-*    → Eliminar o usar info custom
rose-*    → Eliminar o usar error custom
violet-*  → Eliminar
purple-*  → Eliminar
stone-*   → Cambiar a neutral-*
```

