# void-ui — Development Log

Registro completo del proceso de construcción del proyecto: decisiones técnicas, paso a paso y troubleshooting.

---

## Tabla de contenidos

1. [Fase 1 — Monorepo setup](#fase-1--monorepo-setup)
2. [Fase 2 — Button component](#fase-2--button-component)
3. [Fase 3 — Figma integration](#fase-3--figma-integration)
4. [Troubleshooting](#troubleshooting)

---

## Fase 1 — Monorepo setup

### Qué se hizo

Se configuró el monorepo base con npm workspaces y los paquetes `@void-ui/tokens` y `@void-ui/library`.

### Estructura resultante

```
void-ui/
├── packages/
│   ├── tokens/          — @void-ui/tokens (design tokens)
│   └── library/         — @void-ui/library (componentes React)
├── package.json         — workspace root
├── tsconfig.base.json   — TypeScript base config
└── ARCHITECTURE.md      — referencia de arquitectura
```

### Tokens (`@void-ui/tokens`)

Los tokens se dividen en dos capas:

- **`tokens/base.json`** — tokens primitivos (colores raw, espaciado, tipografía, sombras, transiciones, z-index)
- **`tokens/theme.json`** — tokens semánticos que referencian base (ej: `{color.void.600}`)

El build usa **Style Dictionary** (`build.js`) y genera:

```
dist/
├── variables.css    — CSS custom properties (--void-*)
├── tokens.scss      — variables SCSS
├── tokens.js        — ES module
└── tokens.d.ts      — TypeScript declarations
```

Prefijo de todas las custom properties: `--void-*`

### Skeleton de la librería

```
packages/library/src/
├── components/          — un directorio por componente
├── typings/components/  — tipos separados por convención
├── helpers/
│   ├── classnames/      — utilidad cn()
│   ├── constants/       — sizes, variants, versión
│   └── styles/          — _mixins.scss, _functions.scss
├── static/styles/       — reset.css
└── index.ts             — barrel export principal
```

---

## Fase 2 — Button component

### Estructura creada

```
src/components/button/
├── button.tsx           — componente principal
├── button.module.scss   — estilos CSS Modules
├── button.stories.tsx   — stories Storybook
├── button.test.tsx      — 17 tests con Vitest + Testing Library
├── index.ts             — barrel export
├── styles/base.scss     — mapa de tamaños ($button-sizes)
└── docs/button.mdx      — documentación MDX manual

src/typings/components/buttons.ts  — ButtonProps, ButtonVariant, ButtonSize
```

### API del componente

```tsx
<Button
  variant="primary"    // 'primary' | 'secondary' | 'ghost' | 'danger'
  size="md"            // 'sm' | 'md' | 'lg'
  fullWidth={false}    // boolean
  loading={false}      // boolean — muestra spinner, bloquea interacción
  disabled={false}     // boolean
  iconBefore={<Icon/>} // ReactNode — ícono antes del label
  iconAfter={<Icon/>}  // ReactNode — ícono después del label (se oculta en loading)
  as="button"          // ElementType — permite renderizar como <a>, Link, etc.
  data-testid="button" // string
>
  Label
</Button>
```

### Polimorfismo con `as`

El componente acepta cualquier `ElementType` via la prop `as`. Cuando se usa como `<a>`, no se pasa `disabled` (atributo inválido en `<a>`), pero sí `aria-disabled`.

```tsx
<Button as="a" href="/ruta" variant="primary">Enlace</Button>
```

### Accesibilidad

- `aria-disabled="true"` siempre que esté deshabilitado o en loading
- `aria-busy="true"` durante loading
- `disabled` nativo solo cuando `Tag === 'button'`
- `:focus-visible` con outline via mixin `focus-ring`
- Spinner con `aria-hidden="true"`

### Tamaños (definidos en `styles/base.scss`)

| Size | Height | Padding X | Font size | Icon size |
|------|--------|-----------|-----------|-----------|
| sm   | 28px   | 12px      | 13px      | 14px      |
| md   | 36px   | 16px      | 14px      | 16px      |
| lg   | 44px   | 24px      | 16px      | 18px      |

### SCSS — sistema de módulos Dart Sass 3

El proyecto usa el sistema de módulos moderno de Sass (`@use` en lugar de `@import`):

```scss
// button.module.scss
@use 'sass:map';
@use '../../helpers/styles/mixins' as *;
@use './styles/base' as *;

// _mixins.scss
@use 'sass:list';
@use 'sass:map';
// list.append() en lugar de append() global
// map.get() en lugar de map-get() global
```

---

## Fase 3 — Figma integration

Esta fase vive en la branch `feat/figma-integration`.

### Componentes

1. **Scripts de sync** (`figma-sync/`) — bidireccional via Figma REST API
2. **Plugin de Figma** (`figma-plugin/`) — dibuja el Button showcase en el canvas

---

### 3a. Scripts de sync (figma-sync/)

#### Setup

Se creó un `.env` en la raíz del repo:

```
FIGMA_TOKEN=tu_personal_access_token
FIGMA_FILE_KEY=clave_del_archivo_figma
```

El token se obtiene en Figma → Settings → Personal access tokens.
La file key es la parte de la URL: `figma.com/design/FILE_KEY/...`

**Documentado en `.env.example`** (commiteado). El `.env` real está en `.gitignore`.

#### `push-to-figma.js` — código → Figma

Lee `base.json` y `theme.json`, y crea/actualiza **Figma Variables** vía REST API.

Flujo:
1. Aplana los tokens a rutas con `/` (ej: `color/void/500`)
2. Consulta colecciones y variables existentes en Figma
3. Crea colecciones `Primitives` (base) y `Semantic` (theme) si no existen
4. Crea variables nuevas y actualiza valores existentes
5. Resuelve referencias `{color.void.600}` de theme.json a valores reales

```bash
npm run figma:push
```

> ⚠️ La API de Variables de Figma **requiere plan Pro o superior**. En plan gratuito devuelve 403.

#### `pull-from-figma.js` — Figma → código

Lee las Variables de Figma y escribe de vuelta a `base.json` y `theme.json`.

Flujo:
1. Obtiene colecciones y variables de la API
2. Separa `Primitives` → `base.json` y `Semantic` → `theme.json`
3. Convierte tipos Figma (COLOR, FLOAT, STRING) a tipos Style Dictionary
4. Resuelve `VARIABLE_ALIAS` de vuelta a referencias `{dot.notation}`
5. Escribe los archivos

```bash
npm run figma:pull
```

#### `figma:sync` — push + rebuild

```bash
npm run figma:sync
# Equivale a: npm run figma:push && npm run build:tokens
```

---

### 3b. Figma Plugin (`figma-plugin/`)

El plugin **no necesita plan Pro** — opera directamente en el canvas local.

#### Archivos

```
figma-plugin/
├── manifest.json   — metadata del plugin (id, name, main, ui)
├── code.js         — lógica principal (corre en sandbox de Figma)
└── ui.html         — panel de UI mínimo
```

#### Cómo instalar

1. Abrir Figma Desktop
2. `Plugins → Development → Import plugin from manifest…`
3. Seleccionar `figma-plugin/manifest.json`
4. El plugin queda disponible en `Plugins → Development → void-ui Button`

#### Qué dibuja

Genera un frame `🔘 Button` en el canvas con todas las variantes:

- **VARIANTS** — Primary, Secondary, Ghost, Danger
- **SIZES** — Small, Medium, Large
- **STATES** — Default, Disabled, Loading
- **ALL VARIANTS × SIZES** — matriz completa (4 variantes × 3 tamaños + disabled + loading)

#### Fonts utilizadas

| Constante      | Family | Style     |
|----------------|--------|-----------|
| FONT_BOLD      | Inter  | Bold      |
| FONT_SEMIBOLD  | Inter  | Semi Bold |
| FONT_MEDIUM    | Inter  | Medium    |
| FONT_REGULAR   | Inter  | Regular   |

> ⚠️ Las fuentes deben estar instaladas en el sistema o disponibles en Figma. Inter está incluida por defecto en Figma.

---

## Troubleshooting

### Storybook

---

#### ❌ Conflicto autodocs + MDX

**Síntoma:** Storybook muestra error de documentación duplicada o no carga el MDX.

**Causa:** `tags: ['autodocs']` en las stories genera una página de docs automática. Si además existe un `.mdx` manual, hay conflicto.

**Fix:**
1. En `button.stories.tsx`: cambiar `tags: ['autodocs']` → `tags: []`
2. En `.storybook/main.ts`: restringir el glob de MDX a `../src/**/docs/*.mdx`

```ts
// main.ts
stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/docs/*.mdx'],
```

---

#### ❌ Sass: deprecated `map-get()` global

**Síntoma:** Warnings en consola de Storybook:
```
Deprecation Warning: Global built-in functions are deprecated.
Use map.get instead.
```

**Causa:** Sass Dart 3 deprecó las funciones globales. `map-get()`, `map-has-key()`, `append()` ya no se usan.

**Fix en `button.module.scss`:**
```scss
// Antes
@use 'sass:map';
$val: map-get($map, 'key');  // ❌

// Después
$val: map.get($map, 'key');  // ✅
```

**Fix en `_mixins.scss`:**
```scss
// Antes
@mixin transition($props...) {
  $result: ();
  @each $prop in $props {
    $result: append($result, $prop var(--void-transition-normal), comma);  // ❌
  }
}

// Después
@use 'sass:list';
@use 'sass:map';
@mixin transition($props...) {
  $result: ();
  @each $prop in $props {
    $result: list.append($result, $prop var(--void-transition-normal), comma);  // ✅
  }
}
```

---

#### ❌ Button sin colores en Storybook

**Síntoma:** El Button se renderiza sin colores — fondo transparente, sin tokens de color aplicados.

**Causa:** Los tokens CSS (`--void-*`) no se estaban importando en el preview de Storybook.

**Fix en `.storybook/preview.ts`:**
```ts
import '../src/static/styles/reset.css'
import '@void-ui/tokens/css'  // ← agregar esta línea
```

---

### Figma Plugin

---

#### ❌ Solo se ve el título — los botones no aparecen

**Síntoma:** El plugin corre sin error visible, pero en el canvas solo aparece el frame con "Button" y "@void-ui/library". Ninguna sección (VARIANTS, SIZES, etc.) se renderiza.

**Causa raíz:** La Figma Plugin API requiere que los nodos de texto estén **dentro del documento** (appendChild al parent) **antes** de asignar `fontName` o `characters`. El código anterior creaba el nodo, seteaba todas las propiedades y *después* lo añadía al parent. Esto hacía que `characters` fallara silenciosamente.

El mismo problema afectaba a los frames de botón: `resize()` se llamaba antes de `appendChild()`.

**Fix:** Crear helper `makeText()` que:
1. Crea el nodo
2. Lo añade al parent (`appendChild`) **inmediatamente**
3. Setea `fontName`, `fontSize`, `fills`
4. Setea `characters` al final

```js
function makeText(parent, { fontName, fontSize, fills, characters, ... }) {
  const node = figma.createText()
  parent.appendChild(node)      // ← primero en el documento
  node.fontName   = fontName
  node.fontSize   = fontSize
  node.fills      = fills
  node.characters = characters  // ← último
  return node
}
```

---

#### ❌ `The font "Inter SemiBold" could not be loaded`

**Síntoma:** Error en la consola del plugin de Figma (visible en `Plugins → Development → Show/Hide console`).

**Causa:** El nombre del style de la fuente era `'SemiBold'` (sin espacio). El nombre correcto registrado en Figma es `'Semi Bold'` (con espacio).

**Fix:**
```js
// Antes
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }  // ❌

// Después
const FONT_SEMIBOLD = { family: 'Inter', style: 'Semi Bold' } // ✅
```

> 💡 Para verificar el nombre exacto de un estilo de fuente en Figma: crear un text node manualmente, seleccionar Inter, y ver el nombre exacto que aparece en el panel de tipografía.

---

#### ❌ "Plugin missing" — Figma perdió la referencia

**Síntoma:** Al intentar correr el plugin desde `Plugins → Development`, no aparece o dice que no se encuentra.

**Causa:** Figma pierde la referencia al plugin local si se mueve el directorio o se reinicia.

**Fix:** Reimportar el manifest:
1. `Plugins → Development → Import plugin from manifest…`
2. Navegar a `figma-plugin/manifest.json`
3. Confirmar

---

#### ⚠️ Variables API requiere plan Pro

**Síntoma:** `npm run figma:push` devuelve error 403.

**Causa:** La Figma Variables REST API está disponible **solo en plan Pro o superior**. En plan gratuito no es accesible.

**Alternativa:** Usar el plugin local (`figma-plugin/code.js`) que opera directamente en el canvas sin necesidad de API.

---

### Git / Branches

---

#### Política de branches

| Branch                  | Propósito |
|-------------------------|-----------|
| `main`                  | código estable, no se toca sin permiso explícito |
| `feat/figma-integration`| integración Figma (scripts + plugin) |
| `fix/*`                 | fixes específicos, se mergean a su branch base |

**Reglas:**
- No pushear a `main` ni mergear entre branches sin confirmación explícita del lead.
- **Rebase** es la estrategia estándar para mantener las branches actualizadas con su base.
- **Squash merge** es la estrategia estándar al mergear una branch — un commit limpio por feature/fix.
