<!--
Sync Impact Report
Version: unknown (template placeholder) -> 1.0.0
Modified Principles: N/A (filled template placeholders)
Added Sections: Core Principles (filled), Quality Gates, Development Workflow & Review, Governance (filled)
Removed Sections: Principle 5 placeholder slot
Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ⚠ .specify/templates/commands/*.md (directory not found)
- ⚠ Runtime docs (README/docs) not found
Follow-up TODOs: none
-->
# image2blocks Constitution

## Core Principles

### I. Code Quality & Maintainability
All production code MUST be readable, reviewed, and structured for change. Public APIs
MUST be documented, types MUST be explicit and safe, and error handling MUST be
intentional (no silent failures). Refactors MUST preserve behavior and keep modules
small and cohesive to minimize future risk.

### II. Testing Standards (Non-Negotiable)
Every behavior change MUST be backed by tests that would fail without the change.
Bug fixes MUST include regression coverage. Refactors MUST pass the existing test
suite, and new tests MUST be deterministic and fast enough for frequent execution.

### III. User Experience Consistency
User-facing behavior (API shape, naming, defaults, error messages, and output
formats) MUST be consistent across features. Public changes MUST include docs or
examples updates, and any breaking change MUST be explicit and justified.

### IV. Performance Requirements
Performance budgets MUST be defined for critical paths and verified when changes
touch those paths. New features MUST avoid unnecessary memory growth and MUST not
introduce measurable regressions without explicit approval and mitigation.

## Quality Gates

- Every change MUST pass lint/build/test checks.
- Test coverage MUST exist for new behavior; waivers require written justification.
- UX consistency MUST be reviewed for public API or CLI changes.
- Performance validation MUST be recorded for performance-critical changes.

## Development Workflow & Review

- Pull requests MUST include a brief rationale, risk summary, and test evidence.
- Code reviews MUST verify compliance with all core principles.
- Public API changes MUST include versioning notes and migration guidance if needed.

## Governance

- This constitution supersedes local practices and individual preferences.
- Amendments MUST be proposed in writing, reviewed, and recorded with a version bump.
- Versioning follows semantic rules: MAJOR for breaking governance, MINOR for new
  principles or material expansion, PATCH for clarifications.
- Compliance MUST be checked during planning and code review; exceptions require
  explicit approval and a documented mitigation plan.

**Version**: 1.0.0 | **Ratified**: 2026-01-21 | **Last Amended**: 2026-01-21
