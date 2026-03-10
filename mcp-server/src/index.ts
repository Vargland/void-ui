#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { SERVER_NAME, SERVER_VERSION, SERVER_DESCRIPTION } from './constants.js'
import { registerResources } from './resources.js'
import { registerTools } from './tools.js'

async function main() {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
    description: SERVER_DESCRIPTION,
  })

  registerResources(server)
  registerTools(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)

  process.stderr.write(`void-ui MCP server v${SERVER_VERSION} running on stdio\n`)
}

main().catch(err => {
  process.stderr.write(`Fatal: ${err.message}\n`)
  process.exit(1)
})
