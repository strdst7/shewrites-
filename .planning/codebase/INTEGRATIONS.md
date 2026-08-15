# External Integrations

**Analysis Date:** 2026-08-15

## Third-Party Services

**Google Gemini API (via `@google/genai` SDK):**
- Purpose: All AI capabilities — text generation, image generation, image editing, image analysis, conversational chat, text-to-speech
- SDK: `@google/genai` ^1.29.0
- Integration layer: `services/geminiService.ts`
- Auth: API key (`GEMINI_API_KEY`) injected via Vite `define` config from `.env` file
- Custom HTTP header: `User-Agent: aistudio-build` (`services/geminiService.ts:13`)

**Google Gemini API Capabilities Used:**

| Capability | Method | Model(s) | Component |
|-----------|--------|----------|-----------|
| Content generation | `ai.models.generateContent()` | `gemini-3.6-flash`, `gemini-3.1-pro-preview` | `components/content/ContentGenerator.tsx` |
| Structured JSON output | `responseMimeType: "application/json"` + `responseSchema` | `gemini-3.6-flash` | `components/content/ContentGenerator.tsx` |
| Google Search grounding | `config.tools: [{ googleSearch: {} }]` | `gemini-3.6-flash` | `components/content/ContentGenerator.tsx` |
| Thinking mode | `thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }` | `gemini-3.1-pro-preview` | `components/content/ContentGenerator.tsx` |
| Image generation (Imagen) | `ai.models.generateImages()` | `imagen-3.0-generate-001` | `components/image/ImageGenerator.tsx` |
| Image generation (with ref) | `ai.models.generateContent()` with `Modality.IMAGE` | `gemini-3.1-flash-lite-image` | `components/image/ImageGenerator.tsx` |
| Image editing | `ai.models.generateContent()` with `Modality.IMAGE` | `gemini-3.1-flash-lite-image` | `components/image/ImageEditor.tsx` |
| Image analysis | `ai.models.generateContent()` with image part | `gemini-3.6-flash` | `components/image/ImageAnalyzer.tsx` |
| Conversational chat | `ai.chats.create()` + `sendMessageStream()` | `gemini-3.6-flash` | `components/chatbot/ChatBot.tsx` |
| Text-to-speech | `ai.models.generateContent()` with `Modality.AUDIO` | `gemini-3.1-flash-tts-preview` | `components/audio/AudioTools.tsx` |

**Tailwind CSS CDN:**
- Purpose: Utility-first CSS framework
- Integration: `<script src="https://cdn.tailwindcss.com">` in `index.html`
- Custom config inline in `index.html` (brand colors, fonts, dark mode)

**Google Fonts CDN:**
- Purpose: Web fonts (Playfair Display, Montserrat)
- Integration: `<link>` tags in `index.html` with `preconnect` hints

**Fluid Background (krackeddevs.com):**
- Purpose: Animated fluid background effect
- Integration: `<iframe>` embed in `App.tsx:41`
- URL: `https://fluid.krackeddevs.com/#p=...` with configuration parameters
- Note: External dependency with no fallback; if the service is down, the background is blank

**AI Studio CDN (aistudiocdn.com):**
- Purpose: Hosted dependency resolution for the AI Studio environment
- Integration: `<script type="importmap">` in `index.html` maps `react`, `react-dom`, `@google/genai` to `aistudiocdn.com` URLs
- Only applies when running in the AI Studio hosted environment

## External APIs

**Google Gemini API:**
- API name: Google Generative AI API
- Purpose: All AI features (text, image, audio)
- Call patterns:
  - **Synchronous generation**: `ai.models.generateContent()` → `response.text` or `response.candidates`
  - **Image generation**: `ai.models.generateImages()` → `response.generatedImages[0].image.imageBytes` (base64)
  - **Streaming chat**: `ai.chats.create()` → `chatInstance.sendMessageStream()` → `AsyncGenerator` with `chunk.text`
  - **Audio generation**: `ai.models.generateContent()` with `Modality.AUDIO` → `response.candidates[0].content.parts[0].inlineData.data` (base64 PCM)
- Rate limits: Subject to Google Gemini API quotas (not configured in app)
- Authentication: `GEMINI_API_KEY` environment variable

**Web Speech API (Browser-native):**
- Purpose: Speech-to-text transcription
- Integration: `webkitSpeechRecognition` in `components/audio/AudioTools.tsx`
- Language: `ms-MY` (Malay) or `en-US` based on app language setting
- Browser support: Chrome/Edge only (uses `webkitSpeechRecognition` prefix, not standard `SpeechRecognition`)

## Internal Services

**No internal services.** The application is a single-page client-side app with no backend, no microservices, and no service-to-service communication. All server-side logic is handled by the Google Gemini API.

**Shared modules:**
- `services/geminiService.ts` — centralized Gemini API client (singleton pattern with module-level `chatInstance`)
- `LanguageContext.tsx` — React Context for i18n (shared across all components)
- `types.ts` — shared TypeScript types (`AppView` enum, `ImageFile` interface, `ChatMessage` interface)

## Database Integrations

**No database.** The application is stateless and client-side only.

**Persistence:**
- `localStorage` for theme preference (`ThemeSwitcher.tsx`)
- `localStorage` for language preference (`LanguageContext.tsx`)
- No database driver, ORM, or migration tool

**Image data:**
- Uploaded images are read client-side via `FileReader.readAsDataURL()` and sent as base64 to Gemini API
- Generated images are received as base64 from Gemini API and displayed inline (data URIs)
- No image storage or file system persistence

## Authentication & Authorization

**Auth Provider:**
- Google Gemini API key authentication
- No user authentication system — the app is a single-user tool

**API Key Management:**
- Key loaded from environment via Vite's `loadEnv()` in `vite.config.ts`
- Injected as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` at build time
- Validated at module load in `services/geminiService.ts:6-8` — throws if missing

**Token Management:**
- Not applicable — static API key, no token refresh

**Role/Permission System:**
- None — single-user application

## Payment & Billing

**Not applicable.** No payment or billing integration. The app is a free tool.

## Monitoring & Observability

**Logging:**
- `console.error()` calls in component catch blocks for API errors
- No structured logging framework

**Error Tracking:**
- None — no Sentry, LogRocket, or similar service
- Error display is inline UI (red error banners in components)

**APM/Tracing:**
- None

**Analytics:**
- None — no Google Analytics, Mixpanel, or similar service

## Environment Configuration

**Required env vars:**
- `GEMINI_API_KEY` — Google Gemini API key (critical, app fails to start without it)

**Secrets location:**
- `.env` file (not committed to git — `*.local` is in `.gitignore`)
- In AI Studio environment, the key is managed server-side

**Build-time injection:**
- `vite.config.ts` reads `GEMINI_API_KEY` via `loadEnv()` and injects it as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — all communication is request/response to Gemini API

---

*Integration audit: 2026-08-15*
