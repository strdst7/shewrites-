# Testing

**Analysis Date:** 2026-08-15

## Testing Framework

**Runner:**
- **None configured.** No test runner is installed or configured.
- No `jest`, `vitest`, `mocha`, or any test framework in `package.json` dependencies or devDependencies.
- No test configuration files found (`jest.config.*`, `vitest.config.*`, `cypress.config.*`, etc.).

**Assertion Library:**
- None installed.

**Test Configuration:**
- No test scripts in `package.json` (only `dev`, `build`, `preview`, `lint`).

## Test Organization

**Test File Location Convention:**
- **No test files exist.** No `*.test.*` or `*.spec.*` files found anywhere in the codebase.
- No `__tests__/` directories exist.
- No `test/` or `tests/` directories exist.

**Test File Naming Convention:**
- Not established. When adding tests, follow the co-location pattern with `.test.tsx` / `.test.ts` suffix (e.g., `Button.test.tsx` alongside `Button.tsx`).

**Test Directory Structure:**
- Not applicable — no test structure exists.

## Test Types

**Unit Tests:**
- **None.** No unit tests exist for any component, service, or utility.
- Critical untested areas:
  - `services/geminiService.ts` — all API interaction methods (generateContent, generateImage, editImage, analyzeImage, streamChatMessage, textToSpeech)
  - `LanguageContext.tsx` — context provider, useLanguage hook
  - `components/common/Button.tsx` — isLoading behavior, disabled state
  - `components/common/Select.tsx` — rendering, onChange handling
  - `components/common/ThemeSwitcher.tsx` — dark/light toggle, localStorage persistence
  - `components/common/LanguageSwitcher.tsx` — language toggle
  - `components/TabButton.tsx` — active/inactive states
  - `types.ts` — enum and interface definitions

**Integration Tests:**
- **None.** No integration tests exist.
- Key integration scenarios that should be tested:
  - Content generation flow: form submission → service call → result display
  - Image generation flow: form submission → service call → image display
  - Chat flow: message input → streaming response → history update
  - Audio tools: recording → transcription, text → speech playback
  - Language switching: toggle language → all UI text updates
  - Theme switching: toggle theme → dark mode applied → persisted

**E2E Tests:**
- **None.** No E2E testing framework (Cypress, Playwright, etc.) is installed or configured.

**Snapshot Tests:**
- **None.** No snapshot tests exist.

## Test Patterns

**Common Setup/Teardown:**
- Not applicable — no test infrastructure exists.

**Mocking Strategies:**
- Not applicable — no test infrastructure exists.
- When adding tests, the following will need mocking:
  - `@google/genai` SDK — mock the `GoogleGenAI` constructor and all model methods
  - `localStorage` — mock for `LanguageContext` and `ThemeSwitcher` tests
  - `window.webkitSpeechRecognition` — mock for `AudioTools` tests
  - `AudioContext` — mock for TTS playback tests
  - `navigator.clipboard` — mock for `CopyButton` tests
  - `FileReader` — mock for image upload tests

**Fixture Factories:**
- Not applicable — no test infrastructure exists.
- When adding tests, consider creating test data factories for:
  - `ChatMessage` objects (from `types.ts`)
  - `ImageFile` objects (from `types.ts`)
  - `FormData` objects (from `ContentGenerator.tsx`)
  - `Result` objects (from `ContentGenerator.tsx`)
  - Mock Gemini API responses

**Test Data Management:**
- Not applicable — no test infrastructure exists.

## Coverage

**Coverage Tool:**
- None configured.

**Current Coverage Levels:**
- **0%** — no tests exist.

**Coverage Configuration:**
- None. When adding a test framework, configure coverage thresholds in the test config.

**Coverage Enforcement:**
- None. No CI/CD pipeline to enforce coverage.

## CI/CD Testing

**Test Commands in CI:**
- No CI/CD pipeline exists.
- No test commands in `package.json`.

**Test Parallelization:**
- Not applicable.

**Test Environment Setup:**
- Not applicable. When adding CI, the following environment setup will be needed:
  - `GEMINI_API_KEY` environment variable (or mock for tests)
  - Node.js environment matching `tsconfig.json` target (`ES2022`)
  - Vite build verification

## Running Tests

**How to Run All Tests:**
- Not applicable — no test runner configured.

**How to Run Specific Tests:**
- Not applicable.

**How to Run Tests in Watch Mode:**
- Not applicable.

**Debugging Tests:**
- Not applicable.

## Recommended Test Setup

Given the current stack (React 19 + Vite + TypeScript), the recommended test framework is **Vitest** with **React Testing Library**:

**Installation:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Vitest Configuration** (add to `vite.config.ts`):
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    css: true,
  },
  // ... existing config
});
```

**Test Script** (add to `package.json`):
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Test File Convention:**
- Co-locate test files with source files: `Button.test.tsx` alongside `Button.tsx`
- For service tests: `geminiService.test.ts` alongside `geminiService.ts`

**Priority Test Targets:**
1. `services/geminiService.ts` — all API methods (highest risk, most complex)
2. `LanguageContext.tsx` — context provider and hook (used by all components)
3. `components/common/Button.tsx` — reusable UI component
4. `components/common/Select.tsx` — reusable UI component
5. `components/content/ContentGenerator.tsx` — most complex feature component

---

*Testing analysis: 2026-08-15*
