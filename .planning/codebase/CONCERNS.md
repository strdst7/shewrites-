---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# Codebase Concerns

**Analysis Date:** 2026-11-16

## Tech Debt

**Browser-bound AI service:**
- Error: `vite.config.ts` substitutes an API key into the browser bundle for `services/geminiService.ts`.
- Impact: Public deployments expose the key to users and cannot enforce per-user quotas.
- Fix approach: Move AI requests behind an authenticated server with rate limits.

**SDK response assumptions:**
- Error: `services/geminiService.ts` indexes `generatedImages[0].image.imageBytes` without checking availability.
- Impact: Empty or blocked responses throw an unhelpful runtime error.
- Fix approach: Check response shape and present actionable errors in `components/image/ImageGenerator.tsx`.

## Known Bugs

**Missing deployment key:**
- Symptoms: Google AI requests fail because `getAI()` cannot find a key.
- Files: `.github/workflows/deploy.yml`, `vite.config.ts`, `services/geminiService.ts`.
- Trigger: Deploy with the existing Pages workflow, which does not supply `GEMINI_API_KEY`.
- Workaround: None in the published static app. A secure backend is required.

**Image overlay missing from download:**
- Symptoms: Preview text appears, but downloaded JPEG contains only the image.
- Files: `components/image/ImageGenerator.tsx`.
- Trigger: Add overlay text and click download. The anchor points to the original data URL.
- Workaround: Capture the preview separately outside the app.

## Security Considerations

**Public API credential:**
- Risk: Build-injected `GEMINI_API_KEY` can be extracted and reused.
- Files: `vite.config.ts`, `services/geminiService.ts`, `.github/workflows/deploy.yml`.
- Current mitigation: No server-side credential boundary or user authorization exists.
- Recommendation: Keep the key exclusively on a server. Apply authentication and request limits.

**Uploaded images:**
- Risk: Large or unexpected files reach memory and AI requests without size or content checks.
- Files: `components/image/ImageGenerator.tsx`, `components/image/ImageEditor.tsx`, `components/image/ImageAnalyzer.tsx`.
- Current mitigation: File input declares `accept="image/*"`, which is a browser hint.
- Recommendation: Check MIME type, file size, and decoded format before upload.

## Performance Bottlenecks

**Object URL lifecycle:**
- Error: `URL.createObjectURL` runs during render without `URL.revokeObjectURL`.
- Files: `components/image/ImageGenerator.tsx`, `components/image/ImageEditor.tsx`, `components/image/ImageAnalyzer.tsx`.
- Cause: Each rerender can allocate another unreleased blob URL.
- Improvement path: Create URLs per file in an effect and revoke them on cleanup.

**Large media on main thread:**
- Error: Base64 file conversion and PCM audio decoding run in the browser UI thread.
- Files: `components/image/`, `components/audio/AudioTools.tsx`.
- Improvement path: Limit input size and move expensive decoding off the main thread.

## Fragile Areas

**Shared chat session:**
- Files: `services/geminiService.ts`, `components/chatbot/ChatBot.tsx`.
- Why fragile: One module-level chat instance persists across view changes and language resets.
- Safe modification: Scope chat state to a session and ignore stale streamed chunks.
- Test coverage: No test files exist.

**Speech recognition lifecycle:**
- Files: `components/audio/AudioTools.tsx`.
- Why fragile: A language change creates a new recognition object without stopping the prior one.
- Safe modification: Stop recognition on cleanup and handle browser `onerror` and `onend` events.
- Test coverage: No browser API tests exist.

## Scaling Limits

**Public Gemini quota:**
- Current capacity: Determined by one API key in `vite.config.ts`; no app-enforced limit exists.
- Limit: Shared quota and unrestricted callers can exhaust the key's provider allowance.
- Scaling path: Authenticate users and enforce server-side quotas.

## Dependencies at Risk

**Tailwind CDN and external resources:**
- Risk: `index.html` loads production styling and fonts from third-party CDNs.
- Impact: Outages or policy changes affect presentation outside the build pipeline.
- Migration plan: Bundle local styling and pin dependencies in `package.json`.

## Missing Critical Features

**Automated checks:**
- Error: `.github/workflows/deploy.yml` builds without running `npm run lint` or tests.
- Blocks: Regression detection before GitHub Pages deployment.

## Test Coverage Gaps

**AI and browser flows:**
- Untested: Content parsing, image result handling, streaming chat, uploads, and speech lifecycle.
- Files: `services/geminiService.ts`, `components/content/ContentGenerator.tsx`, `components/image/`, `components/chatbot/ChatBot.tsx`, `components/audio/AudioTools.tsx`.
- Risk: API and browser changes can break user flows without a CI signal.
- Priority: High.

---

*Concerns audit: 2026-11-16*
