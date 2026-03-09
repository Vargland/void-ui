---
name: token-sync
description: Sync design tokens between Figma and the codebase. Supports push (tokens → Figma), pull (Figma → tokens), and full sync.
---

# Token Sync

Manages the bidirectional sync of design tokens between `packages/tokens/` and Figma.

## Usage

The user will invoke this as `/token-sync [direction]` where direction is:
- `push` — send local tokens to Figma (default if no direction given)
- `pull` — pull variables from Figma and update local token files
- `sync` — push then rebuild tokens (full pipeline)

## Instructions

### Before running anything
Check that `.env` exists at the repo root with `FIGMA_TOKEN` and `FIGMA_FILE_KEY`.
If it doesn't exist or vars are missing, stop and tell the user.

### push
```bash
cd E:/Work/void-ui && node figma-sync/push-to-figma.js
```
Then report: how many variables were pushed, any errors.

### pull
```bash
cd E:/Work/void-ui && node figma-sync/pull-from-figma.js
```
After pulling, show a diff summary of what changed in `packages/tokens/tokens/`.

### sync (push + build)
```bash
cd E:/Work/void-ui && node figma-sync/push-to-figma.js && npm run build:tokens
```
Report the result of each step. If push fails, do not run build.

## After each operation
- Summarize what happened (tokens pushed/pulled, files modified)
- If files changed locally, remind the user to commit them
- If there were API errors, show the exact error message
