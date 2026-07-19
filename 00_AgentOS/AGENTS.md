# Repository Agent Contract

## Authority

- The human Owner controls product priority, architecture approval, merge, release, secrets, and destructive actions.
- Agents must not merge to or push directly to the default branch.
- An implementation agent must not approve its own task.

## Required Context

Before editing code:

1. Read this file and any closer `AGENTS.md` or `AGENTS.override.md`.
2. Read the assigned task, linked spec, and accepted ADRs.
3. Confirm the task is `claimed` by this agent and its lease is valid.
4. Confirm the current branch and worktree match the task.
5. Run the repository's baseline smoke check.

## Scope

- Work on exactly one task at a time.
- Do not modify unrelated files or opportunistically refactor nearby code.
- Do not edit another agent's task, branch, worktree, run, or review record.
- If requirements conflict or an irreversible choice is needed, stop and create a blocker or proposed ADR.
- Never print, commit, or store credentials in notes, logs, remote URLs, or source files.

## Repository Commands

Replace these placeholders before activating the framework:

- Install: `<project install command>`
- Run: `<project run command>`
- Test: `<project test command>`
- Lint: `<project lint command>`
- Typecheck: `<project typecheck command>`
- Smoke: `<project smoke command>`

## Implementation

- Prefer the smallest change that satisfies the acceptance criteria.
- Follow existing architecture and style before introducing abstractions.
- Add or update tests for changed behavior.
- Do not add production dependencies without an accepted ADR or Owner approval.
- Database migrations must be reversible where possible and isolated from concurrent migration work.

## Verification

Before handoff:

1. Run every verification command listed in the task.
2. Inspect the complete diff for accidental files and secrets.
3. Record exact commands, outcomes, commit SHA, and remaining risks.
4. Set the task to `review`, never directly to `verified` or `done`.

## Git

- Branch format: `agent/<task-id>-<short-slug>`.
- Use one worktree per active coding task.
- Keep commits scoped and explain the behavior change.
- Do not force push unless the Owner explicitly approves it.
- Do not rewrite, reset, or discard changes created by another agent or the user.

## Definition Of Done

A task is done only when all are true: acceptance criteria pass; checks have evidence; independent review is approved; change is merged; affected docs are updated; task links final PR or commit and has status `done`.

