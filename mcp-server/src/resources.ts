import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { COMPONENTS_DATA, TOKENS_DATA } from './data.js'
import type { ComponentMeta } from './types.js'

function formatComponent(c: ComponentMeta): string {
  const propTable = c.props
    .map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.type}${p.default ? ` = ${p.default}` : ''}  // ${p.description}`)
    .join('\n')

  const examples = c.examples
    .map(e => `### ${e.title}\n\`\`\`tsx\n${e.code}\n\`\`\``)
    .join('\n\n')

  return `# ${c.name}

${c.description}

## Props

\`\`\`ts
interface ${c.name}Props {
${propTable}
}
\`\`\`

## Examples

${examples}
`
}

export function registerResources(server: McpServer): void {
  // Resource: full component list
  server.resource(
    'components',
    'void-ui://components',
    async () => ({
      contents: [{
        uri: 'void-ui://components',
        mimeType: 'text/markdown',
        text: [
          '# void-ui Component Library',
          '',
          'Available components:',
          ...COMPONENTS_DATA.map(c => `- **${c.name}** — ${c.description}`),
          '',
          'Import from `@open-void-ui/library`:',
          '```tsx',
          `import { ${COMPONENTS_DATA.map(c => c.name).join(', ')} } from '@open-void-ui/library'`,
          '```',
        ].join('\n'),
      }],
    }),
  )

  // Resource: individual component docs
  for (const component of COMPONENTS_DATA) {
    const slug = component.name.toLowerCase()
    server.resource(
      `component-${slug}`,
      `void-ui://components/${slug}`,
      async () => ({
        contents: [{
          uri: `void-ui://components/${slug}`,
          mimeType: 'text/markdown',
          text: formatComponent(component),
        }],
      }),
    )
  }

  // Resource: design tokens
  server.resource(
    'tokens',
    'void-ui://tokens',
    async () => {
      const byCategory = TOKENS_DATA.reduce<Record<string, typeof TOKENS_DATA>>((acc, t) => {
        acc[t.category] ??= []
        acc[t.category].push(t)
        return acc
      }, {})

      const sections = Object.entries(byCategory).map(([cat, tokens]) => {
        const rows = tokens.map(t => `| \`${t.name}\` | \`${t.value}\` | ${t.description ?? ''} |`).join('\n')
        return `## ${cat}\n\n| Token | Value | Description |\n|-------|-------|-------------|\n${rows}`
      })

      return {
        contents: [{
          uri: 'void-ui://tokens',
          mimeType: 'text/markdown',
          text: `# void-ui Design Tokens\n\nAll tokens are prefixed with \`--void-\` and available as CSS custom properties.\n\n${sections.join('\n\n')}`,
        }],
      }
    },
  )
}
