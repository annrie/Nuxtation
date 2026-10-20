---
name: commit-message
description: Git commit message conventions with Semantic Versioning prefix. Use when creating commits, reviewing commit messages, or preparing releases. Ensures consistent commit format with type prefix (feat/fix/refactor/etc.) for automated changelog generation.
---

# Commit Message

## Format

```
<type>(<scope>): <emoji> <subject>

<body>

Co-Authored-By: Codex Opus 4.5 <noreply@anthropic.com>
```

## Types (Semantic Versioning)

| Type | Version Bump | Description |
|------|--------------|-------------|
| `feat` | MINOR | New feature for the user |
| `fix` | PATCH | Bug fix |
| `refactor` | PATCH | Code change (no feature/fix) |
| `perf` | PATCH | Performance improvement |
| `style` | - | Formatting, whitespace |
| `docs` | - | Documentation only |
| `test` | - | Adding/updating tests |
| `build` | - | Build system, dependencies |
| `ci` | - | CI configuration |
| `chore` | - | Maintenance tasks |

**Breaking Changes**: Append `!` after type → `feat!:` triggers MAJOR bump

## Emoji Reference

| Emoji | Usage |
|-------|-------|
| ✨ | New feature (feat) |
| 🐛 | Bug fix (fix) |
| ♻️ | Refactoring (refactor) |
| ⚡ | Performance (perf) |
| 📝 | Documentation (docs) |
| 🔧 | Configuration (chore) |
| ⬆️ | Dependency upgrade |
| 🏹 | Release |

## Examples

```bash
# Feature
feat(auth): ✨ add OAuth2 login support

# Bug fix
fix(api): 🐛 resolve null pointer in user service

# Refactoring
refactor(components): ♻️ unify BaseTag root element

# Release
chore(release): 🏹 4.0.6

# Breaking change
feat!(api): ✨ redesign authentication flow

BREAKING CHANGE: Auth tokens now use JWT format
```

## Rules

1. Use imperative mood: "add feature" not "added feature"
2. Keep subject under 72 characters
3. Scope is optional but recommended for clarity
4. Body explains "why" not "what"
5. Reference issues: `Fixes #123` or `Closes #456`
6. Always include Co-Authored-By for AI-assisted commits
