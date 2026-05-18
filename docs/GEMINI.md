# Gemini CLI Rules

Specific instructions for the **Gemini CLI** agent in the gigBuddy repository.

## Working Context
- Project follows the Jules Dev Standard.
- Tech stack: React + TypeScript + Firebase.
- Focus: Real-time stage dashboard and media control.
- All Firestore changes must be rule-compliant.

## Workflow
1. Research -> 2. Strategy -> 3. Execution (Plan-Act-Validate).
2. Validate UI changes with `npm run dev`.
3. Validate business logic with `npm test` (Vitest).

## Constraints
- Do not introduce large external libraries for minor UI tweaks.
- Maintain strict type-safety in all API integrations.
- Ensure all stage-view components follow the "High Contrast" design rule.
- Update `docs/MEMORY.md` after adding new integrations or reaching milestones.
- Refer to `docs/AGENT.md` for specific operational SOPs.
- Never log user API tokens or sensitive Firebase config.