import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { COMPONENTS_DATA, TOKENS_DATA } from './data.js'
import { COMPONENTS } from './constants.js'

export function registerTools(server: McpServer): void {
  // ── Tool: get-component ──────────────────────────────────────────────────────
  server.tool(
    'get-component',
    'Get full documentation for a specific void-ui component: props, types and usage examples.',
    { name: z.enum(COMPONENTS).describe('Component name (lowercase)') },
    async ({ name }) => {
      const component = COMPONENTS_DATA.find(c => c.name.toLowerCase() === name)
      if (!component) {
        return { content: [{ type: 'text', text: `Component "${name}" not found.` }] }
      }

      const propLines = component.props.map(p =>
        `- **${p.name}**${p.required ? '' : '?'}: \`${p.type}\`${p.default ? ` *(default: ${p.default})*` : ''} — ${p.description}`
      ).join('\n')

      const exampleLines = component.examples.map(e =>
        `**${e.title}**\n\`\`\`tsx\n${e.code}\n\`\`\``
      ).join('\n\n')

      return {
        content: [{
          type: 'text',
          text: `## ${component.name}\n\n${component.description}\n\n### Props\n${propLines}\n\n### Examples\n\n${exampleLines}`,
        }],
      }
    },
  )

  // ── Tool: list-components ────────────────────────────────────────────────────
  server.tool(
    'list-components',
    'List all available void-ui components with a short description.',
    {},
    async () => {
      const lines = COMPONENTS_DATA.map(c => `- **${c.name}** — ${c.description}`)
      return {
        content: [{
          type: 'text',
          text: `# void-ui Components\n\n${lines.join('\n')}\n\nImport: \`import { ComponentName } from '@open-void-ui/library'\``,
        }],
      }
    },
  )

  // ── Tool: get-tokens ─────────────────────────────────────────────────────────
  server.tool(
    'get-tokens',
    'Get void-ui design tokens, optionally filtered by category.',
    {
      category: z.string().optional().describe(
        'Filter by category: color/action, color/background, color/border, color/text, color/status, radius, spacing, typography'
      ),
    },
    async ({ category }) => {
      const tokens = category
        ? TOKENS_DATA.filter(t => t.category === category)
        : TOKENS_DATA

      if (tokens.length === 0) {
        return { content: [{ type: 'text', text: `No tokens found for category "${category}".` }] }
      }

      const lines = tokens.map(t => `- \`${t.name}\`: \`${t.value}\`${t.description ? ` — ${t.description}` : ''}`)
      return {
        content: [{
          type: 'text',
          text: `# void-ui Tokens${category ? ` — ${category}` : ''}\n\n${lines.join('\n')}`,
        }],
      }
    },
  )

  // ── Tool: generate-usage ─────────────────────────────────────────────────────
  server.tool(
    'generate-usage',
    'Generate a code snippet showing how to use one or more void-ui components together for a given UI pattern.',
    {
      pattern: z.string().describe('Description of the UI pattern to generate, e.g. "login form", "user card with avatar and badge"'),
      components: z.array(z.enum(COMPONENTS)).optional().describe('Specific components to include'),
    },
    async ({ pattern, components: requested }) => {
      const used = requested
        ? COMPONENTS_DATA.filter(c => requested.includes(c.name.toLowerCase() as typeof COMPONENTS[number]))
        : COMPONENTS_DATA

      const importLine = `import { ${used.map(c => c.name).join(', ')} } from '@open-void-ui/library'`

      const hint = used
        .map(c => `// ${c.name}: ${c.props.filter(p => p.required).map(p => p.name).join(', ') || 'no required props'}`)
        .join('\n')

      return {
        content: [{
          type: 'text',
          text: [
            `// Pattern: ${pattern}`,
            importLine,
            '',
            hint,
            '',
            '// Tip: check each component\'s props with the get-component tool.',
          ].join('\n'),
        }],
      }
    },
  )
}
