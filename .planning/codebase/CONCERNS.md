# Codebase Concerns

**Analysis Date:** 2026-08-15

## Technical Debt

**API key exposed to client bundle:**
- Issue: The `GEMINI_API_KEY` is injected into the client-side bundle via Vite's `define` config, making it readable by anyone who inspects the JavaScript. This is a fundamental architectural shortcut — the app is a pure client-side SPA with no backend proxy.
- Files: `vite.config.ts:14-15`, `services/geminiService.ts:4`
- Impact: Any user can extract the API key from the built bundle and use it independently. No rate limiting or access control on the Gemini API key.
- Fix approach: Add a lightweight backend (e.g., Vite server middleware or a separate API server) that proxies Gemini requests and keeps the API key server-side only.

**No test coverage:**
- Issue: Zero test files exist in the entire codebase. No test framework is configured, no test scripts in `package.json`.
- Files: `package.json` (no test script, no test devDependencies)
- Impact: Any refactoring or feature addition risks regressions. No automated verification of correctness.
- Fix approach: Add Vitest (consistent with Vite stack), configure in `package.json`, and write unit tests for `services/geminiService.ts` and component tests for key UI components.

**Hardcoded Bahasa Melayu strings in UI code:**
- Issue: Several components contain hardcoded Malay text that is not routed through the translation system (`translations.ts`), creating inconsistent i18n coverage.
- Files: `components/common/Skeleton.tsx:5-9` (loading tips array), `components/common/Skeleton.tsx:31,84` (hardcoded "Sedang Menjana Kandungan...", "Mereka Visual AI..."), `components/image/ImageGenerator.tsx:161` (broken language check `t.ms ? 'Muat Turun' : 'Download'`)
- Impact: When language is switched to English, these strings remain in Malay. The `t.ms` check in ImageGenerator is a bug — `t.ms` is undefined (t is the translation object, not the language).
- Fix approach: Move all user-facing strings into `translations.ts` under both `ms` and `en` keys, and use `t.*` references exclusively.

**`overlayText` state collected but never used in generation:**
- Issue: `ImageGenerator` has an `overlayText` state and input field, but the text is only rendered as a CSS overlay on the client — it is never sent to the Gemini API as part of the prompt.
- Files: `components/image/ImageGenerator.tsx:14,128-137,147-153`
- Impact: The overlay text appears to be a feature that renders text on top of the generated image via HTML/CSS, but it does not get baked into the image for download. The downloaded image will NOT contain the overlay text.
- Fix approach: Either (a) use Canvas API to composite the text onto the image before download, or (b) include the overlay text in the Gemini prompt so the AI generates it as part of the image.

**Global mutable chat instance:**
- Issue: `chatInstance` is a module-level mutable variable in `geminiService.ts`. It is not tied to React component lifecycle and can persist across re-renders or language changes unpredictably.
- Files: `services/geminiService.ts:18`
- Impact: When language changes, `ChatBot` calls `startChat()` again (line 15-17 of ChatBot.tsx), but the old instance is simply overwritten. No cleanup of the previous instance.
- Fix approach: Move chat instance management into the `ChatBot` component using `useRef`, or provide a proper `resetChat()` method in the service.

**`experimentalDecorators` and `useDefineForClassFields: false` in tsconfig without usage:**
- Issue: `tsconfig.json` enables `experimentalDecorators` and disables `useDefineForClassFields`, but no decorators are used anywhere in the codebase.
- Files: `tsconfig.json:4-5`
- Impact: Unnecessary compiler options that may cause confusion.
- Fix approach: Remove both options unless decorators are planned for future use.

## Security Concerns

**CRITICAL: API key exposed in client-side JavaScript bundle:**
- Risk: The Gemini API key is embedded in the Vite build output via `define` replacements. Anyone can extract it by viewing the source or opening DevTools.
- Files: `vite.config.ts:14-15`, `services/geminiService.ts:4`
- Current mitigation: None. The key is replaced at build time and shipped to every client.
- Recommendations: Implement a server-side proxy for all Gemini API calls. The client should never see or handle the API key directly.

**No input sanitization on user prompts:**
- Risk: User-provided text (prompts, chat messages, constraints) is sent directly to the Gemini API without any sanitization or validation. While the Gemini API is not vulnerable to injection in the traditional sense, there is no protection against prompt injection attacks that could manipulate the AI's output.
- Files: `components/content/ContentGenerator.tsx:204-218`, `components/chatbot/ChatBot.tsx:27-34`, `components/image/ImageGenerator.tsx:42-57`
- Current mitigation: None.
- Recommendations: Add input length limits, content filtering, and rate limiting. Consider adding a system prompt guardrail for the chatbot.

**No rate limiting or abuse prevention:**
- Risk: Each user can make unlimited API calls (content generation, image generation, TTS, chat), which could lead to quota exhaustion or billing spikes on the Gemini API.
- Files: `services/geminiService.ts` (all methods)
- Current mitigation: None.
- Recommendations: Implement client-side throttling (debounce, max requests per session) and server-side rate limiting.

**External iframe loads unvetted third-party content:**
- Risk: The app loads a fluid background animation from `https://fluid.krackeddevs.com/` in an iframe. This third-party service could serve malicious content, track users, or go offline.
- Files: `App.tsx:40-46`
- Current mitigation: The iframe has `pointerEvents: 'none'` and `zIndex: -1`.
- Recommendations: Consider self-hosting the animation or replacing with a CSS-only alternative to eliminate the third-party dependency.

**No Content Security Policy (CSP):**
- Risk: No CSP headers are defined, leaving the app vulnerable to XSS and injection attacks.
- Files: `index.html`
- Current mitigation: None.
- Recommendations: Add CSP headers to restrict script sources, connect destinations, and frame ancestors.

**`window as any` type casting bypasses TypeScript safety:**
- Risk: Using `window as any` to access `webkitSpeechRecognition` and `webkitAudioContext` suppresses TypeScript's type checking, potentially hiding runtime errors.
- Files: `components/audio/AudioTools.tsx:30,72`
- Current mitigation: None.
- Recommendations: Add proper type declarations for WebKit-prefixed APIs in a `.d.ts` file.

## Performance Concerns

**Large base64 images stored in React state:**
- Problem: Generated images are stored as base64 data URIs in React state. For high-resolution images, this can be several megabytes of string data held in memory.
- Files: `components/image/ImageGenerator.tsx:16`, `components/image/ImageEditor.tsx:13`
- Cause: The Gemini API returns base64 image data, and it's stored directly in component state.
- Improvement path: Use `URL.createObjectURL()` with Blob conversion for generated images, or store only a reference and use the browser cache.

**Object URLs never revoked:**
- Problem: `URL.createObjectURL()` is called for uploaded images in three components, but `URL.revokeObjectURL()` is never called, causing memory leaks.
- Files: `components/image/ImageGenerator.tsx:117`, `components/image/ImageAnalyzer.tsx:77`, `components/image/ImageEditor.tsx:90`
- Cause: Each object URL persists in browser memory until the page is unloaded.
- Improvement path: Call `URL.revokeObjectURL()` in a `useEffect` cleanup when the component unmounts or when the image changes.

**Tailwind CSS loaded via CDN in production:**
- Problem: `index.html` loads Tailwind CSS via `<script src="https://cdn.tailwindcss.com">` — this is the development-only JIT compiler, not a production build. It adds ~300KB of JavaScript and processes styles at runtime.
- Files: `index.html:8`
- Cause: No PostCSS/Tailwind build pipeline configured.
- Improvement path: Install Tailwind CSS as a dev dependency with PostCSS and generate a static CSS file during build. Remove the CDN script.

**No loading states or cancellation for long-running API calls:**
- Problem: There is no way to cancel in-flight API requests. If a user clicks "Generate" and then switches tabs, the request continues in the background. The `AbortController` pattern is not used.
- Files: `services/geminiService.ts` (all async methods)
- Cause: No `AbortSignal` integration with the Gemini SDK.
- Improvement path: Pass `AbortSignal` to API calls and cancel on component unmount or user action.

**Chat streaming causes excessive re-renders:**
- Problem: The `ChatBot` component updates state on every streamed chunk, causing a re-render for each token received.
- Files: `components/chatbot/ChatBot.tsx:37-42`
- Cause: `setHistory(prev => {...})` is called for every chunk in the `for await` loop.
- Improvement path: Batch updates using `requestAnimationFrame` or `setTimeout(fn, 0)`, or use `useRef` for the streaming buffer and only update state at intervals.

**Audio decoding done manually instead of using Web Audio API properly:**
- Problem: The TTS audio decoding in `AudioTools.tsx` manually converts base64 to Int16Array and then to Float32Array. This is fragile and assumes a specific audio format (PCM 16-bit, 24000 Hz).
- Files: `components/audio/AudioTools.tsx:72-93`
- Cause: The Gemini TTS API returns raw PCM data, and there's no built-in decoder for this format.
- Improvement path: If the API returns audio in a standard format (e.g., MP3, WAV), use `AudioContext.decodeAudioData()` instead. Otherwise, add validation and error handling for the assumed format.

## Scalability Concerns

**No backend — all logic runs client-side:**
- Problem: The app is a pure client-side SPA with no server. All API calls go directly from the browser to the Gemini API. This means the API key must be exposed, there is no shared state, and no centralized rate limiting.
- Files: `vite.config.ts`, `services/geminiService.ts`
- Limit: Cannot support user accounts, usage tracking, or collaborative features.
- Scaling path: Add a backend API layer (Node.js/Express, or serverless functions) that proxies Gemini requests and manages authentication and rate limiting.

**Single chat instance shared across all users:**
- Problem: The `chatInstance` variable in `geminiService.ts` is a module-level singleton. In a server-side rendering context, this would be shared across all users.
- Files: `services/geminiService.ts:18`
- Limit: Currently client-side only, so each browser has its own instance. But this pattern is not portable to SSR.
- Scaling path: Move chat session management to a per-user context, not a module-level variable.

**No data persistence:**
- Problem: All generated content, chat history, and image edits are stored in React state and lost on page refresh. There is no local storage, IndexedDB, or database persistence.
- Files: All component files (state is `useState` only)
- Limit: Users cannot save their work, revisit past generations, or maintain a content library.
- Scaling path: Add local storage persistence for generated content, or integrate with a backend database for user accounts.

## Maintainability Concerns

**Hardcoded default values in Malay:**
- Issue: Default form values, prompts, and placeholder text are hardcoded in Bahasa Melayu throughout the components, not pulled from the translation system.
- Files: `components/content/ContentGenerator.tsx:172-183` (formData defaults), `components/image/ImageGenerator.tsx:12-13` (prompt/overlayText defaults), `components/image/ImageEditor.tsx:11` (prompt default), `components/image/ImageAnalyzer.tsx:10` (prompt default), `components/audio/AudioTools.tsx:23` (ttsText default)
- Impact: When language is switched to English, the form fields still show Malay text. The prompts sent to Gemini are always in Malay regardless of UI language.

**Duplicated image upload logic:**
- Issue: The `handleImageUpload` function (converting `File` to `ImageFile` with base64) is duplicated across three components with nearly identical code.
- Files: `components/image/ImageGenerator.tsx:20-32`, `components/image/ImageAnalyzer.tsx:16-28`, `components/image/ImageEditor.tsx:17-29`
- Impact: Any change to the upload logic must be made in three places.
- Fix approach: Extract a shared `useImageUpload` hook into `components/common/` that returns `[imageFile, setImageFile, handleUpload, clearImage]`.

**Duplicated download logic:**
- Issue: The `handleDownload` function (creating a temporary anchor element) is duplicated in `ImageGenerator.tsx` and `ImageEditor.tsx`.
- Files: `components/image/ImageGenerator.tsx:60-68`, `components/image/ImageEditor.tsx:50-58`
- Impact: Any change to download behavior must be made in two places.
- Fix approach: Extract a shared `useDownload` utility or `downloadDataUrl` function.

**Large component files:**
- Issue: `ContentGenerator.tsx` is 348 lines with multiple sub-components (`FormattingToolbar`, `EditableResult`, `CopyButton`, `Stats`) defined in the same file. This makes the file hard to navigate.
- Files: `components/content/ContentGenerator.tsx`
- Impact: Difficult to test individual sub-components, harder to understand the file structure.
- Fix approach: Extract `FormattingToolbar`, `EditableResult`, `CopyButton`, and `Stats` into separate files under `components/content/`.

**`translations.ts` is a 204-line flat object:**
- Issue: The entire translation file is a single flat object with deep nesting. As the app grows, this will become unwieldy.
- Files: `translations.ts`
- Impact: Hard to find specific translations, easy to miss keys when adding new features.
- Fix approach: Split into namespaced files (e.g., `translations/ms/contentGenerator.ts`, `translations/en/contentGenerator.ts`) and compose them.

**Inconsistent error handling:**
- Issue: Some components display errors to the user, some just log to console. The `geminiService.ts` throws errors, but the `ChatBot` catches them and replaces the message with a generic error string. Other components use `setError(t.common.error)`.
- Files: `components/chatbot/ChatBot.tsx:44-49`, `components/content/ContentGenerator.tsx:229-231`, `components/image/ImageGenerator.tsx:52-54`
- Impact: No structured error handling. Users see generic messages with no actionable information.
- Fix approach: Create a shared error handling utility that maps Gemini API errors to user-friendly messages, and use a consistent error display pattern.

**No TypeScript strict mode:**
- Issue: `tsconfig.json` does not enable `strict: true`. Several `any` types are used throughout the code.
- Files: `tsconfig.json`, `services/geminiService.ts:43`, `components/audio/AudioTools.tsx:12,30,72`
- Impact: Type safety is not enforced, leading to potential runtime errors that TypeScript could catch.
- Fix approach: Enable `strict: true` in `tsconfig.json` and resolve all resulting type errors.

## Dependency Concerns

**Tailwind CSS via CDN (development-only build):**
- Risk: The `cdn.tailwindcss.com` script is the development JIT compiler, not meant for production. It adds significant bundle size and runtime overhead.
- Impact: Slow page load, poor Core Web Vitals, non-deterministic styles.
- Migration plan: Install `tailwindcss`, `postcss`, `autoprefixer` as dev dependencies. Create `tailwind.config.ts` and `postcss.config.js`. Generate static CSS during build.

**No lockfile present:**
- Risk: No `package-lock.json` or `yarn.lock` found in the repository. This means `npm install` could produce different results on different machines.
- Impact: Non-reproducible builds, potential version drift.
- Migration plan: Run `npm install` to generate `package-lock.json` and commit it.

**Only 3 runtime dependencies, minimal but fragile:**
- Risk: The app depends on `react`, `react-dom`, and `@google/genai`. The `@google/genai` package is a relatively new SDK with a rapidly evolving API.
- Impact: Breaking changes in `@google/genai` could break the app without warning.
- Migration plan: Pin the `@google/genai` version exactly (remove the `^` prefix) and test thoroughly before upgrading.

**No ESLint or Prettier configured:**
- Risk: No linting or formatting tools are configured. Code style is enforced only by convention.
- Impact: Inconsistent code style, potential bugs that linters could catch.
- Migration plan: Add `eslint` and `prettier` with appropriate React/TypeScript configs.

## Missing Features / Gaps

**Missing error boundaries:**
- Problem: No React error boundaries are defined. If any component throws during rendering, the entire app will crash with a white screen.
- Priority: High

**Missing loading error recovery:**
- Problem: When API calls fail, the error state is set but there is no "Retry" button. The user must re-submit the form.
- Priority: Medium

**Missing keyboard accessibility:**
- Problem: The `ChatBot` uses `onKeyPress` (deprecated) instead of `onKeyDown`. Other interactive elements lack proper ARIA attributes.
- Files: `components/chatbot/ChatBot.tsx:76`
- Priority: Medium

**Missing form validation:**
- Problem: No client-side validation on form inputs. The content generator allows empty required fields, and the image generator allows empty prompts (though the `if (!prompt) return` guard prevents submission).
- Priority: Medium

**Missing responsive design testing:**
- Problem: The app uses Tailwind responsive classes (`md:`, `lg:`) but the viewport meta tag has a typo: `initial-scale-1.0` instead of `initial-scale=1.0`.
- Files: `index.html:6`
- Impact: The viewport meta tag may not be parsed correctly by browsers, causing mobile rendering issues.
- Priority: High

**Missing logging/monitoring:**
- Problem: No structured logging, error tracking, or analytics. Only `console.error` calls exist.
- Priority: Low (for a small app)

**Missing CI/CD pipeline:**
- Problem: No GitHub Actions, no build verification, no automated deployment.
- Priority: Medium

**Missing privacy policy / data handling notice:**
- Problem: User data (prompts, images, chat messages) is sent to Google's Gemini API. No privacy notice or consent mechanism exists.
- Priority: High (legal requirement in many jurisdictions)

## Priority Recommendations

### Top 5 Issues to Address First

1. **SECURITY: API key exposed in client bundle** — Critical security issue. Add a backend proxy or serverless function to handle Gemini API calls. This is the single most important fix.
   - Effort: Large (requires new infrastructure)
   - Files: `vite.config.ts`, `services/geminiService.ts`

2. **BUG: Viewport meta tag typo** — `initial-scale-1.0` should be `initial-scale=1.0`. This may break mobile rendering.
   - Effort: Quick win (1 character fix)
   - Files: `index.html:6`

3. **BUG: Broken language check in ImageGenerator download button** — `t.ms ? 'Muat Turun' : 'Download'` is incorrect; `t.ms` is undefined. Should use the `language` variable from `useLanguage()`.
   - Effort: Quick win (2-line fix)
   - Files: `components/image/ImageGenerator.tsx:161`

4. **PERFORMANCE: Tailwind CDN in production** — Replace the CDN script with a proper build-time Tailwind setup. This will significantly improve load performance.
   - Effort: Medium (requires build config changes)
   - Files: `index.html:8`, `package.json`, new config files

5. **TECH DEBT: Add test infrastructure** — Set up Vitest and write initial tests for `geminiService.ts` and key components. Without tests, every change is risky.
   - Effort: Medium
   - Files: `package.json`, new test files

### Quick Wins (< 1 hour each)
- Fix viewport meta tag typo in `index.html:6`
- Fix `t.ms` bug in `components/image/ImageGenerator.tsx:161`
- Add `URL.revokeObjectURL()` calls in image components
- Remove unused `experimentalDecorators` and `useDefineForClassFields` from `tsconfig.json`
- Add `package-lock.json` to the repository

### Long-Term Investments
- Add backend API proxy for Gemini calls (eliminates API key exposure)
- Set up proper Tailwind CSS build pipeline (replaces CDN)
- Implement i18n properly with all strings in translations
- Add error boundaries and structured error handling
- Add test infrastructure (Vitest + React Testing Library)
- Set up CI/CD pipeline

---

*Concerns audit: 2026-08-15*
