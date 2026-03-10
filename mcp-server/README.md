# @open-void-ui/mcp-server

MCP (Model Context Protocol) server for [open-void-ui](https://github.com/Vargland/void-ui).

Exposes the full component library as context for Claude and Cursor — props, variants, sizes, tokens and code examples for every component. When connected, the AI generates correct void-ui code on the first try without hallucinating props or inventing tokens.

---

## Setup

### 1. Build the server

```sh
# From the repo root
npm run mcp:build

# Or directly
cd mcp-server && npm run build
```

The compiled server is output to `mcp-server/dist/index.js`.

### 2. Connect to Claude Code

```sh
claude mcp add void-ui node /absolute/path/to/void-ui/mcp-server/dist/index.js
```

Or add manually to `.claude/mcp.json` in your project:

```json
{
  "mcpServers": {
    "void-ui": {
      "command": "node",
      "args": ["/absolute/path/to/void-ui/mcp-server/dist/index.js"]
    }
  }
}
```

### 3. Connect to Cursor

Add to `.cursor/mcp.json` at the root of your project:

```json
{
  "mcpServers": {
    "void-ui": {
      "command": "node",
      "args": ["/absolute/path/to/void-ui/mcp-server/dist/index.js"]
    }
  }
}
```

Restart Cursor after saving.

---

## Available tools

### `list-components`

Returns all components in the library with a short description.

```
No parameters required.
```

### `get-component`

Returns full documentation for a specific component: all props with types and defaults, available variants, sizes, and usage examples.

```
Parameters:
  name: string   — component name (e.g. "Button", "TextField", "Checkbox")
```

### `get-tokens`

Returns all 38 design tokens with their resolved values and usage context.

```
No parameters required.
```

### `generate-usage`

Generates a ready-to-use code snippet for a component with the specified configuration.

```
Parameters:
  component: string   — component name
  props?:    object   — props to apply (e.g. { variant: "primary", size: "md" })
```

---

## Available resources

The server also exposes MCP resources that can be read directly:

| Resource URI | Description |
|-------------|-------------|
| `void-ui://components/{name}` | Full component metadata |
| `void-ui://tokens` | All design tokens |

---

## Example prompts

Once connected, you can ask Claude or Cursor:

> *"Generate a login form using void-ui components"*

> *"What props does the TextField component accept?"*

> *"Create a user card with Avatar, Typography and a Badge showing online status"*

> *"What's the correct way to apply the mars planet theme to a section?"*

> *"Show me all the available color tokens"*

---

## Server structure

```
mcp-server/
├── src/
│   ├── index.ts       ← entry point, stdio transport
│   ├── tools.ts       ← 4 MCP tools
│   ├── resources.ts   ← MCP resources (components + tokens)
│   ├── data.ts        ← component props + token values
│   ├── constants.ts   ← component name tuple
│   └── types.ts       ← ComponentMeta, TokenMeta, LibrarySnapshot
├── dist/              ← compiled output (after npm run build)
├── package.json
└── tsconfig.json
```

---

## Test the server

```sh
# Verify the server starts and returns tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node mcp-server/dist/index.js
```

Expected output includes the 4 tool names: `list-components`, `get-component`, `get-tokens`, `generate-usage`.

---

## License

MIT © [Germán Román](https://github.com/Vargland)
