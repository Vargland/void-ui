---
name: release
description: Creates the release branch and bumps the version in library and/or tokens. Usage: /release <patch|minor|major> [library|tokens|both]
---

# Release

Creates the `chore/release-x.x.x` branch and bumps the semantic version following project rules.

## Usage

```
/release <patch|minor|major> [library|tokens|both]
```

If the package is not specified, ask the user which one to bump.

## Instructions

### 1. Read current versions

```bash
node -p "require('./packages/library/package.json').version"
node -p "require('./packages/tokens/package.json').version"
```

### 2. Calculate new version

Apply the specified bump (`patch` | `minor` | `major`) to the current version of the selected package.

### 3. Verify no uncommitted changes

```bash
git status --short
```

If there are pending changes, stop and notify the user.

### 4. Create the release branch

```bash
git checkout -b chore/release-x.x.x
```

The name uses the new version of the main package being bumped.

### 5. Update package.json

Edit the `"version"` field in:
- `packages/library/package.json` if library changes
- `packages/tokens/package.json` if tokens changes
- If tokens changes, also update the reference in `packages/library/package.json` under `dependencies`

### 6. Report to the user

Show:
- Branch created
- Modified files with old → new version
- Reminder: do NOT commit or push without explicit permission

The user authorizes the commit and push.
