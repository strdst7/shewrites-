---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# Coding Conventions

**Analysis Date:** 2026-11-16

## Naming Patterns

**Files:**
- Use PascalCase for React components such as `components/chatbot/ChatBot.tsx`.
- Use camelCase for service files such as `services/geminiService.ts`.

**Functions:**
- Use camelCase event handlers and service functions in `components/image/ImageEditor.tsx`.

**Variables:**
- Use camelCase React state names in `components/content/ContentGenerator.tsx`.

**Types:**
- Use PascalCase interfaces and enums in `types.ts` and `components/content/ContentGenerator.tsx`.

## Code Style

**Formatting:**
- No formatter config exists. Existing files mix single and double quotes.
- Match surrounding indentation and JSX class formatting in the modified file.

**Linting:**
- `npm run lint` invokes `tsc --noEmit` through `package.json`.
- `tsconfig.json` does not enable `strict`; no ESLint config exists.

## Import Organization

**Order:**
1. React imports appear first in `components/image/ImageEditor.tsx`.
2. Local services, shared UI, icons, types, and context follow.
3. No enforced import sorter exists in `package.json`.

**Path Aliases:**
- `@/*` maps to repository root in `tsconfig.json` and `vite.config.ts`.
- Existing components primarily use relative imports.

## Error Handling

**Patterns:**
- Wrap async SDK calls in `try`/`catch`/`finally` in `components/image/`.
- Set a translated generic error and log the original with `console.error`.
- `services/geminiService.ts` throws when the API key or expected media data is missing.

## Logging

**Framework:**
- Browser `console` in `components/chatbot/ChatBot.tsx` and other feature components.

**Patterns:**
- Log request errors at the UI boundary. No structured telemetry exists.

## Comments

**When to Comment:**
- Short notes annotate browser compatibility and UI sections in `components/audio/AudioTools.tsx`.

**JSDoc/TSDoc:**
- Not detected in `services/geminiService.ts` or `components/`.

## Function Design

**Size:**
- Feature files combine event handlers and JSX. `components/content/ContentGenerator.tsx` is 348 lines.

**Parameters:**
- Type React event parameters explicitly, as in `components/image/ImageEditor.tsx`.

**Return Values:**
- Service functions return promises, strings, or SDK response types in `services/geminiService.ts`.

## Module Design

**Exports:**
- Components use default exports. `services/geminiService.ts` exports one named service object.

**Barrel Files:**
- No barrel files exist under `components/`.

---

*Convention analysis: 2026-11-16*
