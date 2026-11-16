---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# External Integrations

**Analysis Date:** 2026-11-16

## APIs & External Services

**Generative AI:**
- Google Gemini and Imagen: content, chat, images, vision, and speech through `services/geminiService.ts`.
  - SDK/client: `@google/genai` in `package.json`.
  - Auth: `GEMINI_API_KEY` injected by `vite.config.ts` into browser code.
  - Models: `gemini-3.6-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite-image`, `imagen-3.0-generate-001`, and `gemini-3.1-flash-tts-preview`.
- Google Search grounding: optional `googleSearch` tool in `services/geminiService.ts`.

**Browser and presentation:**
- Web Speech API: `webkitSpeechRecognition` for transcription in `components/audio/AudioTools.tsx`.
- Web Audio API: plays decoded speech in `components/audio/AudioTools.tsx`.
- Tailwind CDN, Google Fonts, and AI Studio CDN import map: `index.html`.
- Fluid background iframe: `https://fluid.krackeddevs.com/` in `App.tsx`.

## Data Storage

**Databases:**
- None detected in `package.json` or `services/`.

**File Storage:**
- No remote file store. `components/image/` reads local uploads with `FileReader`.
- Generated images use in-memory data URLs and browser downloads in `components/image/`.

**Caching:**
- `localStorage` retains language and theme in `LanguageContext.tsx` and `components/common/ThemeSwitcher.tsx`.

## Authentication & Identity

**Auth Provider:**
- None detected. `services/geminiService.ts` authenticates with a build-injected API key.

## Monitoring & Observability

**Error Tracking:**
- None detected in `package.json`.

**Logs:**
- Components report request errors with `console.error` in `components/`.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages deployment through `.github/workflows/deploy.yml`.

**CI Pipeline:**
- GitHub Actions runs `npm ci` and `npm run build` in `.github/workflows/deploy.yml`.
- Dependabot updates npm and GitHub Actions dependencies weekly through `.github/dependabot.yml`.

## Environment Configuration

**Required env vars:**
- `GEMINI_API_KEY`: read by `vite.config.ts`, then consumed by `services/geminiService.ts`.
- `GITHUB_ACTIONS`: sets the Pages asset base path in `vite.config.ts`.

**Secrets location:**
- `README.md` documents local `.env` or `.env.local`; neither is read for this map.
- `.github/workflows/deploy.yml` does not inject `GEMINI_API_KEY` during deployment.

## Webhooks & Callbacks

**Incoming:**
- None detected. The application is a static frontend.

**Outgoing:**
- No webhook endpoint detected. `services/geminiService.ts` calls Google APIs from the browser.

---

*Integration audit: 2026-11-16*
