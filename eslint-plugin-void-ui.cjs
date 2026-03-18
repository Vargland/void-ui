/**
 * eslint-plugin-void-ui
 * Local ESLint plugin for void-ui code conventions.
 */

'use strict'

// Rule: block body must not be on a single line
// Bad:  if (!isOpen) { return }
// Good: if (!isOpen) {
//         return
//       }
const noSingleLineBlock = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {
      singleLine: 'Block body must not be on a single line. Use multiple lines.',
    },
  },
  create(context) {
    const src = context.getSourceCode()

    function check(node) {
      const body = node.consequent ?? node.body
      if (!body || body.type !== 'BlockStatement') {
        return
      }

      const open = src.getFirstToken(body)
      const close = src.getLastToken(body)

      if (open.loc.start.line !== close.loc.start.line) {
        return
      }

      context.report({
        node: body,
        messageId: 'singleLine',
        fix(fixer) {
          const inner = src.getTokensBetween(open, close)

          if (inner.length === 0) {
            return null
          }

          const baseIndent = ' '.repeat(open.loc.start.column)
          const bodyIndent = baseIndent + '  '
          const innerText = inner.map(t => t.value).join(' ')

          return fixer.replaceText(body, `{\n${bodyIndent}${innerText}\n${baseIndent}}`)
        },
      })
    }

    return {
      IfStatement: check,
      ForStatement: check,
      ForInStatement: check,
      ForOfStatement: check,
      WhileStatement: check,
    }
  },
}

module.exports = {
  rules: {
    'no-single-line-block': noSingleLineBlock,
  },
}
