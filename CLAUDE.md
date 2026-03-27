# void-ui — Claude Code context

> This file is the single source of truth for Claude Code on this project.
> Anyone cloning this repo or running Claude on a new machine starts from here — no extra configuration needed.

---

## Project

void-ui is an open source design system built in React + TypeScript by Germán Román (Frontend Lead, 8+ years).

**Repo:** https://github.com/Vargland/void-ui

---

## Stack

- Monorepo: npm workspaces
- React 18 + TypeScript strict
- CSS Modules + SCSS (Dart Sass 3 — use `@use`, never `@import`)
- Vitest + Testing Library
- Storybook 8 + MDX
- Plop (component generator: `npm run generate`)
- Style Dictionary (token build)
- CI/CD: GitHub Actions (ci + publish + code-review)

---

## Packages

| Package | Path | Status |
|---|---|---|
| `@open-void-ui/library` | `packages/library/` | active |
| `@open-void-ui/tokens` | `packages/tokens/` | active |
| `@open-void-ui/docs` | `apps/docs/` | active (Next.js 14) |
| `@open-void-ui/icons` | `packages/icons/` | pending |
| `@open-void-ui/dates` | `packages/dates/` | pending |
| `mcp-server/` | `mcp-server/` | active |

---

## Roadmap status

- ✅ Phase 1: monorepo setup + tokens + library skeleton
- ✅ Phase 2: components (Button, Badge, Avatar, Typography, Divider, Stack, Spinner, TextField, Checkbox, Select, Modal, Toast, Tooltip, Tabs, Table)
- ✅ Phase 3: Figma plugin + Figma MCP connected
- ✅ Phase 4: mcp-server with 4 tools (list-components, get-component, get-tokens, generate-usage)
- ✅ Phase 5: CI/CD (ci.yml + publish.yml + code-review.yml)
- 🔄 Phase 6: scale components — pending DatePicker (`packages/dates`) and Icons (`packages/icons`)

**Published on npm (last updated 2026-03-27):**
- `@open-void-ui/tokens@0.3.0`
- `@open-void-ui/library@0.4.0`

Before proposing a new component or feature, check if it is already in the completed list above.

---

## Component structure (fixed convention, do NOT change)

```
src/components/button/
├── button.tsx
├── button.module.scss
├── button.stories.tsx
├── button.test.tsx
├── index.ts
├── styles/base.scss
└── docs/button.mdx

src/typings/components/buttons.ts   ← types ALWAYS here, never inside the .tsx
```

### Barrel export pattern

```ts
// components/button/index.ts
export { Button } from './button'
export type { ButtonProps } from '../../typings/components/buttons'

// src/index.ts
export { Button } from './components/button'
export type { ButtonProps } from './typings/components/buttons'
```

---

## Code conventions

| Type | Convention | Example |
|---|---|---|
| Component | kebab-case | `button.tsx` |
| Stories | kebab-case + `.stories` | `button.stories.tsx` |
| Tests | kebab-case + `.test` | `button.test.tsx` |
| Types | kebab-case + plural | `buttons.ts` |
| Hooks | `use-` prefix | `use-toast.ts` |
| SCSS helpers | `_` prefix | `_mixins.scss` |

- One directory per component — never group multiple components together
- Typings ALWAYS in `src/typings/components/`
- Extract to a hook if component logic exceeds 50 lines
- Storybook is the visual source of truth
- Tests required before publishing any component

---

## Tokens

- Base: `packages/tokens/tokens/base.json` (primitives)
- Semantic: `packages/tokens/tokens/theme.json` (references to base)
- Build: `node build.js` → `dist/variables.css`, `dist/tokens.scss`, `dist/tokens.js`
- CSS custom property prefix: `--void-*`

---

## Semantic versioning

| Change | Bump |
|---|---|
| Bug fix, CSS fix | `PATCH` (0.3.0 → 0.3.1) |
| New component, new prop, new feature | `MINOR` (0.3.0 → 0.4.0) |
| Breaking public API change | `MAJOR` (0.x → 1.0.0) |

- When finishing a feature branch, always create `chore/release-x.x.x` with the version bump before closing the task
- If `tokens` changes, bump `tokens` AND update the dependency in `library`
- Only bump the package that changed (library, tokens, or both)

---

## Git flow — MANDATORY

```
branch → commits → PR → explicit approval → squash merge
```

1. Create branch: `git checkout -b feat/name` or `fix/name`
2. Commits on the branch
3. Push: `git push origin feat/name`
4. Create PR: `gh pr create`
5. **WAIT** for explicit user approval
6. Only after approval: squash merge

**Never:**
- Commit or push without explicit permission from the user in the chat
- Push directly to `main`
- Merge without an approved PR
- Skip hooks (`--no-verify`)

**Strategies:**
- Rebase to keep branches up to date
- Squash merge when closing branches

---

## Response style — MANDATORY

- Keep responses short and direct
- No preamble, no trailing summaries ("Done!", "I've completed...", "In summary...")
- Go straight to the action or the relevant point
- If a decision needs user input, state it clearly and briefly
- Do not use emojis unless the user explicitly asks

---

## Useful commands

```bash
npm run dev:docs        # docs site (Next.js)
npm run storybook       # Storybook
npm run test            # Vitest
npm run generate        # Plop — scaffold new component
npm run build:tokens    # Style Dictionary build
npm run figma:push      # tokens → Figma (requires Pro plan)
npm run figma:pull      # Figma → tokens
```

---

## CI/CD — GitHub Actions

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every PR | install → build tokens → test → build library |
| `publish.yml` | Push to main | Publishes to npm if version changed |
| `code-review.yml` | Non-draft PR | Claude reviews diff and posts comment |

Required secrets: `NPM_TOKEN`, `ANTHROPIC_API_KEY`

---

## When creating a file in a directory that has `.gitkeep`

Delete the `.gitkeep` — it's no longer needed.
