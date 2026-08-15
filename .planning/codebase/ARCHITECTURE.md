<!-- refreshed: 2026-08-15 -->
# Architecture

**Analysis Date:** 2026-08-15

## System Overview

SheWrites! is a single-page React application — an AI content studio for women entrepreneurs in Malaysia. It is a client-side-only monolith with no backend server; all AI capabilities are provided by the Google Gemini API, called directly from the browser using an API key injected at build time.

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                            │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│ Content  │  Image   │  Image   │  Image   │  AI      │  Audio   │
│Generator │Generator │  Editor  │Analyzer  │  Coach   │  Tools   │
│`comp/    │`comp/    │`comp/    │`comp/    │`comp/    │`comp/    │
│ content/ │ image/   │ image/   │ image/   │ chatbot/ │ audio/   │
│ Content- │ Image-   │ Image-   │ Image-   │ Chat-    │ Audio-   │
│ Generator│Generator │Editor.tsx│Analyzer  │ Bot.tsx  │ Tools.tsx│
│ .tsx     │.tsx      │          │.tsx      │          │          │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘
     │          │          │          │          │          │
     ▼          ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Gemini Service Layer                          │
│               `services/geminiService.ts`                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  GoogleGenAI SDK (@google/genai)                          │  │
│  │  - generateContent()  - generateImage()  - editImage()   │  │
│  │  - analyzeImage()     - startChat()     - streamChat()   │  │
│  │  - textToSpeech()                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Google Gemini API (External)                    │
│  Models used:                                                   │
│  - gemini-3.6-flash (content, analysis, chat)                  │
│  - gemini-3.1-pro-preview (pro content with thinking)          │
│  - imagen-3.0-generate-001 (image generation)                  │
│  - gemini-3.1-flash-lite-image (image editing/ref-based gen)   │
│  - gemini-3.1-flash-tts-preview (text-to-speech)               │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Root component; view routing via `AppView` enum | `App.tsx` |
| Header | App title, language switcher, theme switcher | `components/Header.tsx` |
| TabButton | Tab navigation button with active/inactive styling | `components/TabButton.tsx` |
| ContentGenerator | Form-driven Threads content generation with structured JSON output | `components/content/ContentGenerator.tsx` |
| ImageGenerator | AI image generation with optional reference image and overlay text | `components/image/ImageGenerator.tsx` |
| ImageEditor | AI-powered image editing via prompt + source image | `components/image/ImageEditor.tsx` |
| ImageAnalyzer | Image analysis for aesthetic/content ideas | `components/image/ImageAnalyzer.tsx` |
| ChatBot | Streaming conversational AI coach with persistent chat session | `components/chatbot/ChatBot.tsx` |
| AudioTools | Speech-to-text (Web Speech API) and text-to-speech (Gemini TTS) | `components/audio/AudioTools.tsx` |
| LanguageContext | i18n provider (Malay/English) with localStorage persistence | `LanguageContext.tsx` |
| geminiService | Singleton service wrapping all Gemini API calls | `services/geminiService.ts` |
| Icons | Inline SVG icon components | `components/Icons.tsx` |
| Button | Reusable button with loading spinner | `components/common/Button.tsx` |
| Select | Reusable select dropdown with label | `components/common/Select.tsx` |
| Skeleton | Loading skeleton components (ContentSkeleton, ImageSkeleton) | `components/common/Skeleton.tsx` |
| Spinner | Simple spinning loader | `components/common/Spinner.tsx` |
| ThemeSwitcher | Dark/light mode toggle with localStorage persistence | `components/common/ThemeSwitcher.tsx` |
| LanguageSwitcher | MS/EN toggle buttons | `components/common/LanguageSwitcher.tsx` |

## Pattern Overview

**Overall:** Flat SPA with feature-based component grouping and a single service layer

**Key Characteristics:**
- **No routing library** — view switching is done via `useState<AppView>` in `App.tsx` with a switch statement
- **No global state management** — state is local to components via `useState`; only i18n is shared via React Context
- **Single service layer** — `geminiService.ts` is the sole data access layer; all components call it directly
- **No backend** — API key is injected at build time via Vite's `define` config; all API calls are client-side

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI and handle user interaction
- Location: `components/`
- Contains: React functional components organized by feature (content, image, chatbot, audio, common)
- Depends on: `services/geminiService.ts`, `LanguageContext.tsx`, `types.ts`
- Used by: `App.tsx` (assembles them)

**Service Layer:**
- Purpose: Abstract all Gemini API interactions
- Location: `services/geminiService.ts`
- Contains: `geminiService` object with async methods for each AI capability
- Depends on: `@google/genai` SDK, `types.ts`
- Used by: All feature components

**Internationalization Layer:**
- Purpose: Provide Malay/English translations to all components
- Location: `LanguageContext.tsx` (provider + hook), `translations.ts` (data)
- Contains: React Context provider, `useLanguage()` hook, translation objects
- Depends on: Nothing external
- Used by: All components that display text

**Type Definitions:**
- Purpose: Shared TypeScript types and enums
- Location: `types.ts`
- Contains: `AppView` enum, `ImageFile` interface, `ChatMessage` interface
- Depends on: Nothing
- Used by: `App.tsx`, `geminiService.ts`, feature components

## Data Flow

### Content Generation Flow

1. User fills form in `ContentGenerator` (`components/content/ContentGenerator.tsx:170`)
2. `handleSubmit` builds a prompt string from form data (`ContentGenerator.tsx:198`)
3. `geminiService.generateContent(prompt, usePro, useSearch)` is called (`services/geminiService.ts:41`)
4. Gemini API returns structured JSON or plain text depending on `useSearch` flag
5. Response is parsed and displayed in `EditableResult` components with copy/stats

### Image Generation Flow

1. User enters prompt and optional reference image in `ImageGenerator` (`components/image/ImageGenerator.tsx:10`)
2. `geminiService.generateImage(prompt, aspectRatio, sourceImage?)` is called (`services/geminiService.ts:63`)
3. If reference image provided → uses `gemini-3.1-flash-lite-image` with `Modality.IMAGE`
4. If no reference → uses `imagen-3.0-generate-001` via `generateImages()`
5. Base64 image data is returned as data URI and displayed

### Chat (AI Coach) Flow

1. `ChatBot` component calls `geminiService.startChat()` on mount (`components/chatbot/ChatBot.tsx:15`)
2. This creates a `Chat` instance with system instruction (`services/geminiService.ts:119`)
3. User sends message → `geminiService.streamChatMessage(message)` is called (`services/geminiService.ts:129`)
4. Response is streamed via `for await` loop, updating `history` state incrementally (`ChatBot.tsx:37`)
5. Chat instance persists across messages (module-level `chatInstance` variable)

**State Management:**
- All state is component-local via `useState`
- Language preference persisted in `localStorage` via `LanguageContext`
- Theme preference persisted in `localStorage` via `ThemeSwitcher`
- Chat session state is held in module-level `chatInstance` variable in `geminiService.ts`
- No Redux, Zustand, or other state management library

## Key Abstractions

**geminiService (Singleton Object):**
- Purpose: Centralize all Gemini API interactions behind a single exported object
- Example: `services/geminiService.ts`
- Pattern: Plain object with async methods; no class instantiation; module-level `ai` and `chatInstance` variables

**useLanguage Hook:**
- Purpose: Provide i18n access to any component
- Example: `LanguageContext.tsx:35`
- Pattern: React Context + custom hook; `t` object provides typed translations

**AppView Enum:**
- Purpose: Type-safe view routing without a router
- Example: `types.ts:2`
- Pattern: String enum used as state value in `App.tsx`

## Entry Points

**Application Entry:**
- Location: `index.tsx`
- Triggers: Browser loads `index.html` which loads `/index.tsx` as module
- Responsibilities: Mounts React root with `StrictMode` and `LanguageProvider` wrapper

**HTML Entry:**
- Location: `index.html`
- Triggers: Vite dev server or built output
- Responsibilities: Loads Tailwind CSS CDN, Google Fonts, import map for CDN dependencies, and `index.css`

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop; streaming chat uses `for await` async iteration
- **Global state:** Module-level `chatInstance` in `services/geminiService.ts:18` — mutable singleton shared across renders; no cleanup mechanism
- **Circular imports:** None detected; dependency graph is unidirectional (components → services → SDK)
- **API key exposure:** `GEMINI_API_KEY` is injected via Vite's `define` and accessible in client bundle (`vite.config.ts:14-15`). This is a client-side-only app; the key is exposed to end users.
- **No routing:** View switching is purely state-based; no URL-based navigation or deep linking
- **CDN dependencies:** React, React DOM, and `@google/genai` are loaded via import map from `aistudiocdn.com` (`index.html:41-49`), not from `node_modules`

## Anti-Patterns

### Module-Level Mutable Singleton for Chat

**What happens:** `chatInstance` is a module-level `let` variable in `services/geminiService.ts:18` that holds the chat session. It's never reset except by calling `startChat()` again.
**Why it's wrong:** If the component unmounts and remounts, the stale chat instance persists. Language changes call `startChat()` again (from `ChatBot.tsx:17`), but there's no explicit cleanup on unmount.
**Do this instead:** Use `useRef` inside the `ChatBot` component to hold the chat instance, or add a `resetChat()` method and call it in a `useEffect` cleanup.

### Inline Tailwind CDN Instead of Build Integration

**What happens:** Tailwind CSS is loaded via `<script src="https://cdn.tailwindcss.com">` in `index.html:8` with inline config, rather than as a PostCSS plugin in the Vite build pipeline.
**Why it's wrong:** The CDN script is intended for development only; it adds runtime overhead and doesn't support tree-shaking or purging unused styles. Custom colors defined in the inline config are not available to the Tailwind build if one were added.
**Do this instead:** Install `tailwindcss` as a dev dependency and configure it via `tailwind.config.js` + `postcss.config.js` in the Vite pipeline.

### API Key in Client Bundle

**What happens:** `GEMINI_API_KEY` is injected via Vite's `define` into `process.env.API_KEY` / `process.env.GEMINI_API_KEY` (`vite.config.ts:13-15`), making it readable in the browser bundle.
**Why it's wrong:** Anyone using the app can extract the API key from the JavaScript source. This is a security concern for production use.
**Do this instead:** Proxy API calls through a minimal backend that holds the key server-side, or use Google AI Studio's built-in deployment mechanism which handles key security.

## Error Handling Strategy

**Strategy:** Try-catch with local error state per component

**Patterns:**
- Each feature component has its own `const [error, setError] = useState<string | null>(null)`
- Errors are caught in `try/catch` blocks around `geminiService` calls
- Error messages come from the translation system (`t.common.error`)
- Errors are displayed as styled `<div>` elements with red styling
- `console.error(err)` is used for debugging in every catch block
- No global error boundary; no error reporting service

## Cross-Cutting Concerns

**Logging:** `console.error()` only — no structured logging library. Used in catch blocks across all feature components.

**Validation:** Minimal — form inputs are required at the HTML level (`if (!prompt || !imageFile) return`), but no schema validation library. The `ContentGenerator` uses a JSON schema (`contentGenerationSchema` in `geminiService.ts:29`) for structured Gemini output, but the parsed result is not validated on the client side.

**Authentication:** None — the app is publicly accessible. The Gemini API key is the sole authentication mechanism (to the Gemini API, not to the app itself).

**Internationalization:** Bilingual (Malay/English) via `LanguageContext` + `translations.ts`. All user-facing strings are translated. The default language is Malay (`ms`), persisted in `localStorage`.

**Theming:** Dark/light mode via Tailwind's `class` strategy. `ThemeSwitcher` toggles the `dark` class on `<html>`. Preference persisted in `localStorage`. All components use `dark:` Tailwind variants.

---

*Architecture analysis: 2026-08-15*
