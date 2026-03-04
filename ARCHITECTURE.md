# void-ui — Architecture Document

Basado en el análisis de void-ui. Este documento es la referencia de cómo está organizado el proyecto, por qué cada decisión existe, y cómo escalar.

---

## Estructura del monorepo

```
void-ui/
├── packages/
│   ├── library/          ← componentes React principales
│   ├── tokens/           ← design tokens (fuente de verdad)
│   ├── icons/            ← iconografía (SVG + font)
│   └── dates/            ← componentes de fecha (paquete separado, opcional)
├── mcp-server/           ← servidor MCP para integración con Claude/Cursor
├── .storybook/           ← config global de Storybook
├── package.json          ← workspace root
└── void-ui.code-workspace
```

### Por qué monorepo

Cada sub-paquete se publica por separado en npm:
- `@void-ui/library` — los componentes
- `@void-ui/tokens` — los tokens (usable sin React)
- `@void-ui/icons` — los íconos
- `@void-ui/dates` — componentes de fecha (opcional, heavy dependency)

Esto permite que un consumidor instale solo lo que necesita.

---

## packages/library — Estructura de un componente

Cada componente vive en su propia carpeta y sigue esta convención **sin excepción**:

```
src/components/button/
├── button.tsx              ← implementación del componente
├── button.module.scss      ← estilos con CSS Modules
├── button.stories.tsx      ← stories de Storybook
├── button.test.tsx         ← tests con Vitest + Testing Library
├── index.ts                ← barrel export
├── styles/
│   └── base.scss           ← estilos base importados por el module
└── docs/
    └── button.mdx          ← documentación en Storybook
```

Y el tipado **siempre separado**:

```
src/typings/components/
└── buttons.ts              ← interfaces y types del componente
```

### Por qué separar typings

- Permite importar solo los tipos sin importar el componente (útil para formularios, validaciones)
- Fuerza a pensar la API del componente antes de implementar
- Más fácil de revisar en PRs — los cambios de API son visibles solos

---

## packages/library — Estructura interna completa

```
src/
├── components/             ← un directorio por componente
├── typings/
│   ├── components/         ← types de cada componente
│   ├── hooks/              ← types de cada hook
│   ├── contexts/           ← types de cada context
│   ├── helpers/            ← types compartidos (colors, shadows, etc.)
│   └── docs/               ← types para el sistema de documentación
├── hooks/                  ← hooks reutilizables (use-toast, use-popper, etc.)
├── contexts/               ← React contexts (toast, tile, etc.)
├── helpers/
│   ├── classnames/         ← utilidades para generar classNames
│   ├── constants/          ← constantes compartidas
│   ├── functions/          ← funciones puras reutilizables
│   ├── hooks/              ← hooks helper internos (no expuestos)
│   └── styles/             ← SCSS helpers (_mixins, _functions, _constants)
├── static/
│   ├── assets/             ← SVGs, logos
│   └── styles/             ← reset.css global
├── templates/              ← stories de patrones completos (form, data-grid, navigation)
├── docs/                   ← páginas de documentación general (changelog, welcome)
└── index.ts                ← barrel export principal de la librería
```

---

## packages/tokens — Design tokens

```
tokens/
├── tokens/
│   ├── base.json           ← colores, espaciado, tipografía (primitivos)
│   └── theme.json          ← tokens semánticos (color.primary, color.error, etc.)
├── build.js                ← script que genera CSS variables, JS, SCSS desde los JSON
├── config.js               ← configuración del build (Style Dictionary)
└── package.json
```

### Flujo de tokens

```
Figma Variables
      ↓
tokens/base.json + theme.json   ← fuente de verdad
      ↓
build.js (Style Dictionary)
      ↓
dist/
  ├── variables.css             ← CSS custom properties
  ├── tokens.js                 ← JS object para uso en React
  └── tokens.scss               ← variables SCSS
```

Cuando se integra Figma MCP, el sync actualiza directamente los `.json`.

---

## packages/icons

```
icons/
├── src/
│   ├── assets/             ← SVGs originales
│   └── icons/
│       ├── fonts/          ← font generada (woff, ttf, svg)
│       ├── icons.css       ← clases CSS para usar los íconos
│       └── selection.json  ← definición de la font (IcoMoon format)
├── build.js                ← genera la icon font desde los SVGs
└── generate-enum.js        ← genera un TypeScript enum con todos los íconos
```

---

## mcp-server — Integración con IA

```
mcp-server/
├── src/
│   ├── index.ts            ← entry point del servidor MCP
│   ├── tools.ts            ← herramientas expuestas a Claude/Cursor
│   ├── resources.ts        ← recursos (componentes, tokens, docs)
│   ├── constants.ts        ← constantes del servidor
│   ├── types.ts            ← types del servidor
│   └── utils.ts            ← utilidades
├── scripts/
│   ├── generate-data.ts    ← genera el snapshot de la librería para el MCP
│   └── sync-version.js     ← sincroniza versiones entre paquetes
└── README.md + SETUP_GUIDE.md
```

El MCP server expone la librería completa como contexto para Claude y Cursor. Cuando Claude "conoce" void-ui, genera código que usa los componentes correctamente en lugar de inventar los suyos.

---

## Convenciones de código

### Nomenclatura de archivos
| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componente | kebab-case | `button.tsx` |
| Stories | kebab-case + `.stories` | `button.stories.tsx` |
| Tests | kebab-case + `.test` | `button.test.tsx` |
| Tipos | kebab-case + plural | `buttons.ts` |
| Hooks | `use-` prefix | `use-toast.ts` |
| SCSS helpers | `_` prefix | `_mixins.scss` |

### Barrel exports
Cada componente tiene su `index.ts` que re-exporta:
```ts
// components/button/index.ts
export { Button } from './button'
export type { ButtonProps } from '../../typings/components/buttons'
```

Y el `src/index.ts` principal re-exporta todo:
```ts
export { Button } from './components/button'
export type { ButtonProps } from './typings/components/buttons'
// ...
```

### Separación de lógica y presentación
Los componentes complejos separan la lógica en un hook propio:
```
combobox/combobox.tsx         ← solo JSX
hooks/use-combobox.ts         ← toda la lógica
typings/hooks/use-combobox.ts ← types del hook
```

---

## Storybook

Cada componente tiene dos tipos de documentación:

**Stories** (`button.stories.tsx`) — casos de uso interactivos
**MDX** (`docs/button.mdx`) — documentación narrativa con la template compartida

La template de docs está en `src/docs/template/` y estandariza cómo se documenta cada componente — misma estructura, mismo formato.

---

## Testing

- **Framework**: Vitest + Testing Library
- **Setup**: `test-config/setup-tests.js`
- **Snapshots**: carpeta `__snapshots__/` dentro de cada componente
- **Convención**: un archivo `.test.tsx` por componente + un archivo `.test.ts` por hook

---

## Plop — generador de componentes

void-ui tiene `plopfile.mjs` con templates para generar un componente completo:

```
plop-templates/new-component/
├── component.hbs       ← component.tsx
├── component.index.hbs ← index.ts
├── component.story.hbs ← stories.tsx
├── component.types.hbs ← typings
├── sass.base.hbs       ← styles/base.scss
└── sass.module.hbs     ← component.module.scss
```

Comando: `npm run generate` → te pregunta el nombre → genera toda la estructura.
**Esto es clave para mantener consistencia a escala.**

---

## Roadmap de implementación para void-ui

```
Fase 1 — Fundación
  ✓ Repo en GitHub
  → Monorepo setup (npm workspaces)
  → packages/tokens (base.json + theme.json + build)
  → packages/library (estructura vacía + config Storybook + Vitest)

Fase 2 — Primer componente completo
  → Button (con toda la estructura: component, types, stories, test, docs)
  → Validar que el pipeline completo funciona antes de agregar más

Fase 3 — Figma sync
  → Conectar Figma Variables con tokens/base.json via MCP

Fase 4 — MCP server
  → mcp-server con tools y resources
  → Validar con Claude Code y Cursor

Fase 5 — CI/CD
  → GitHub Actions: lint + test + build en cada PR
  → AI code review en PRs
  → npm publish automático al mergear a main

Fase 6 — Escalar componentes
  → Plop templates para generar componentes
  → Agregar componentes uno por uno, con calidad
```

---

## Decisiones de diseño que NO cambiar

1. **Un directorio por componente** — nunca agrupar múltiples componentes en una carpeta
2. **Typings separados** — los types nunca viven dentro del `.tsx`
3. **Hooks propios para lógica compleja** — si el componente tiene más de 50 líneas de lógica, va a un hook
4. **Storybook como fuente de verdad visual** — si no está en Storybook, no existe
5. **Tests antes de publicar** — ningún componente se publica sin test
