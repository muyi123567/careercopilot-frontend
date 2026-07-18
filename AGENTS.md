# Repository Agent Contract

## Authority

- Owner controls product priority, architecture approval, merge, release.
- Agents must not merge to or push directly to the default branch.

## Scope

- Work on exactly one task at a time.
- Do not modify unrelated files.

## Git

- Branch format: agent/<task-id>-<short-slug>
- One worktree per active coding task.
- PR + squash merge, Owner clicks merge.

## Repository Commands

- Install: open public/index.html (no build step)
- Run: open public/index.html
- Test: manual browser verification
- Lint: n/a
- Typecheck: n/a
- Smoke: open page, verify API call succeeds
