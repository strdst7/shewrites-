---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# Testing Patterns

**Analysis Date:** 2026-11-16

## Test Framework

**Runner:**
- Not detected. `package.json` has no test dependency, test script, or runner config.

**Assertion Library:**
- Not detected in `package.json`.

**Run Commands:**
```bash
npm run lint   # TypeScript check only
npm run build  # Vite build only
```

## Test File Organization

**Location:**
- No test files exist in `components/`, `services/`, or repository root.

**Naming:**
- No `*.test.*` or `*.spec.*` convention exists yet.

**Structure:**
```text
components/ and services/ contain implementation files only.
```

## Test Structure

**Suite Organization:**
- No suites exist. Do not infer a runner-specific pattern from `package.json`.

**Patterns:**
- Setup, teardown, and assertions are not established.

## Mocking

**Framework:**
- None detected in `package.json`.

**Patterns:**
- No mock files exist. A future test runner needs an SDK boundary around `services/geminiService.ts`.

**What to Mock:**
- Mock `@google/genai` requests when testing components that call `services/geminiService.ts`.

**What NOT to Mock:**
- Keep prompt assembly and result state transitions observable in `components/content/ContentGenerator.tsx`.

## Fixtures and Factories

**Test Data:**
- No fixtures exist. Example prompt defaults reside in `components/content/ContentGenerator.tsx`.

**Location:**
- Not established.

## Coverage

**Requirements:**
- None enforced in `.github/workflows/deploy.yml`.

**View Coverage:**
- No coverage command exists in `package.json`.

## Test Types

**Unit Tests:**
- None for `services/geminiService.ts` or `components/`.

**Integration Tests:**
- None for content, chat, images, or audio flows.

**E2E Tests:**
- No E2E framework exists in `package.json`.

## Common Patterns

**Async Testing:**
- No established async tests. Async flows exist in `components/chatbot/ChatBot.tsx` and `components/image/`.

**Error Testing:**
- No established error tests. Error branches exist in `services/geminiService.ts` and feature components.

---

*Testing analysis: 2026-11-16*
