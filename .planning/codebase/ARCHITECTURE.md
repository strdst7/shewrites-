---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
<!-- refreshed: 2026-11-16 -->
# Architecture

**Analysis Date:** 2026-11-16

## System Overview

```text
index.html -> index.tsx -> LanguageProvider -> App.tsx
                                        |-> components/content/ContentGenerator.tsx
                                        |-> components/image/*.tsx
                                        |-> components/chatbot/ChatBot.tsx
                                        |-> components/audio/AudioTools.tsx
                                                  |
                                                  v
                                       services/geminiService.ts
                                                  |
                                                  v
                                           Google AI API
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Tab selection and layout | `App.tsx` |
| Language provider | Bilingual strings and preference | `LanguageContext.tsx`, `translations.ts` |
| Content studio | Prompt construction and editable output | `components/content/ContentGenerator.tsx` |
| Image tools | Generate, edit, and analyze images | `components/image/` |
| Chat | Stream conversation into UI state | `components/chatbot/ChatBot.tsx` |
| Audio tools | Browser transcription and AI speech playback | `components/audio/AudioTools.tsx` |
| AI service | Construct SDK requests and hold chat instance | `services/geminiService.ts` |

## Pattern Overview

**Overall:** Client-only React single-page application with a shared AI service.

**Key Characteristics:**
- `App.tsx` switches views with `AppView` instead of URL routing.
- Feature components own input, loading, result, and error state through React hooks.
- `services/geminiService.ts` calls the Google AI SDK directly from the browser.

## Layers

**Presentation:**
- Location: `App.tsx`, `components/`, and `LanguageContext.tsx`.
- Depends on: `types.ts`, `translations.ts`, browser APIs, and `services/geminiService.ts`.

**AI integration:**
- Location: `services/geminiService.ts`.
- Contains: model choices, request shapes, response extraction, and module-level chat state.
- Used by: feature components in `components/`.

## Data Flow

### Primary Request Path

1. `index.tsx` mounts the provider and app after `index.html` loads.
2. `App.tsx` renders the selected feature component from `AppView`.
3. `components/content/ContentGenerator.tsx` builds a prompt and calls `geminiService.generateContent`.
4. `services/geminiService.ts` creates a `GoogleGenAI` client and sends the request.
5. `components/content/ContentGenerator.tsx` parses JSON or displays grounded text.

### Image and Audio Flow

1. `components/image/` reads uploads into base64 `ImageFile` values from `types.ts`.
2. `services/geminiService.ts` sends inline image data and returns image data URLs.
3. `components/audio/AudioTools.tsx` decodes base64 PCM speech using Web Audio.

**State Management:**
- Feature state lives in hooks within `components/`.
- Language context lives in `LanguageContext.tsx`; language and theme persist in `localStorage`.
- Chat SDK state lives in a module-level `chatInstance` in `services/geminiService.ts`.

## Key Abstractions

**AppView:**
- `types.ts` defines the six view IDs used by `App.tsx`.

**ImageFile:**
- `types.ts` stores the original `File` and its base64 representation.

**geminiService:**
- `services/geminiService.ts` exposes content, images, analysis, chat, and speech functions.

## Entry Points

**Browser:**
- `index.html` loads `/index.tsx`, styles, fonts, and third-party scripts.
- `index.tsx` mounts `App.tsx` inside `LanguageProvider`.

**Build:**
- `vite.config.ts` configures Vite, asset base, aliases, and env substitution.

## Architectural Constraints

- **Threading:** The browser main thread handles UI, uploads, base64 decoding, and audio conversion.
- **Global state:** `services/geminiService.ts` holds one mutable `chatInstance`.
- **Routing:** `App.tsx` stores the active view locally, so reloads reset the tab.
- **Secrets:** `vite.config.ts` substitutes the Gemini key into client-side output.

## Anti-Patterns

### Client-side credential injection

**What happens:** `vite.config.ts` embeds `GEMINI_API_KEY` for `services/geminiService.ts`.
**Why it matters:** Anyone who receives the built site can extract the key.
**Do this instead:** Place Google AI requests behind an authenticated server endpoint.

### Shared chat instance

**What happens:** `services/geminiService.ts` shares a module-level `chatInstance` across component lifecycles.
**Why it matters:** Concurrent or stale streams can update a restarted conversation.
**Do this instead:** Scope each chat session to its owner in `components/chatbot/ChatBot.tsx`.

## Error Handling

**Strategy:** Feature handlers catch request errors and render localized generic messages.

**Patterns:**
- `components/image/` resets result state before requests and clears loading in `finally`.
- `components/chatbot/ChatBot.tsx` substitutes a translated error message for a failed stream.

## Cross-Cutting Concerns

**Logging:** `console.error` appears in `components/`.
**Validation:** Forms check required inputs locally; uploaded file size and MIME content lack checks.
**Authentication:** No user authentication or server authorization exists.

---

*Architecture analysis: 2026-11-16*
