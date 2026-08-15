# Technology Stack

**Analysis Date:** 2026-08-15

## Runtime & Language

**Primary:**
- TypeScript ~5.8.2 — All source files are `.tsx`/`.ts`
- ES2022 target with `module: ESNext`, `moduleResolution: bundler`
- Key language features used: enums (`types.ts`), async/await, `AsyncGenerator` for streaming, `React.FC` typing pattern, `experimentalDecorators` enabled but not observed in use

**Runtime:**
- Browser (SPA) — no server-side runtime; all code runs client-side
- The app is designed to run within Google AI Studio's hosted environment (evidenced by `aistudiocdn.com` import map in `index.html` and `metadata.json` `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`)

## Framework & Core Libraries

**Core:**
- React ^19.2.0 — UI framework (functional components with hooks)
- React DOM ^19.2.0 — Client-side rendering via `ReactDOM.createRoot`

**AI/ML:**
- `@google/genai` ^1.29.0 — Google Generative AI SDK (sole backend integration)
  - Used for: text generation, image generation, image editing, image analysis, chat streaming, text-to-speech
  - Entry point: `services/geminiService.ts`

**Package Manager:**
- npm (implied by `package.json`)
- Lockfile: **Missing** — no `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` found

## Build & Dev Tools

**Build System:**
- Vite ^6.2.0 — bundler and dev server
- `@vitejs/plugin-react` ^5.0.0 — React Fast Refresh support
- Config: `vite.config.ts`
  - Dev server: port 3000, host `0.0.0.0`
  - Path alias: `@/*` → project root
  - Environment injection: `GEMINI_API_KEY` → `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

**Type Checking:**
- TypeScript ~5.8.2
- `tsc --noEmit` via `npm run lint`
- Config: `tsconfig.json`
  - `noEmit: true`, `allowImportingTsExtensions: true`
  - `jsx: react-jsx` (automatic JSX transform)
  - `skipLibCheck: true`

**Linting/Formatting:**
- No ESLint, Prettier, or Biome configuration detected
- No formatting enforcement beyond TypeScript compiler checks

**Dev Commands:**
```bash
npm run dev      # Vite dev server
npm run build    # Vite production build
npm run preview  # Preview production build
npm run lint     # tsc --noEmit (type checking only)
```

## Infrastructure

**Hosting/Deployment:**
- Designed for Google AI Studio's hosted environment (`aistudiocdn.com` CDN for dependencies)
- `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` — suggests server-side API key handling by the AI Studio platform
- No Docker, CI/CD, or custom deployment configuration found

**Database:**
- None — purely client-side state with no persistence beyond `localStorage`
- `localStorage` used for: theme preference (`LanguageContext.tsx`), language preference (`LanguageContext.tsx`)

**Caching:**
- None — no service worker, no HTTP cache layer, no in-memory caching of API responses

**Background Jobs:**
- None — all operations are synchronous user-initiated requests

## Frontend

**UI Framework:**
- React 19 — functional components with hooks (`useState`, `useEffect`, `useRef`, `useContext`)
- No router — single-page app with tab-based view switching (`AppView` enum in `types.ts`)
- No state management library — React Context + `useState` only

**CSS Approach:**
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com` in `index.html`)
- Custom Tailwind config inline in `index.html`:
  - `darkMode: 'class'` — class-based dark mode
  - Custom `brand-pink` color palette (50–950)
  - Custom `brand-cream` color
  - Custom fonts: `font-sans` → Montserrat, `font-serif` → Playfair Display
- Minimal custom CSS: `index.css` (just `body { margin: 0; }`)

**Component Library:**
- Custom-built — no third-party component library
- Shared components in `components/common/`:
  - `Button.tsx` — styled button with loading spinner
  - `Select.tsx` — labeled select dropdown
  - `Skeleton.tsx` — loading placeholder (content + image variants)
  - `Spinner.tsx` — simple spinner
  - `ThemeSwitcher.tsx` — dark/light toggle
  - `LanguageSwitcher.tsx` — MS/EN toggle
- SVG icons in `components/Icons.tsx` — hand-crafted, no icon library

**Fonts:**
- Google Fonts: Playfair Display (serif), Montserrat (sans-serif)
- Loaded via `<link>` in `index.html`

**Internationalization (i18n):**
- Custom implementation — `LanguageContext.tsx` + `translations.ts`
- Two languages: `ms` (Bahasa Melayu) and `en` (English)
- Default: `ms` (Bahasa Melayu)
- Pattern: `const { t, language } = useLanguage()` then `t.section.key`

## API & Communication

**API Style:**
- Direct SDK calls to Google Gemini API — no REST/GraphQL layer
- All API calls routed through `services/geminiService.ts`

**Gemini Models Used:**
| Model | Purpose | File |
|-------|---------|------|
| `gemini-3.6-flash` | Content generation (default), image analysis, chat | `services/geminiService.ts:42,113,121` |
| `gemini-3.1-pro-preview` | Content generation with "Pro" mode (higher detail) | `services/geminiService.ts:42` |
| `imagen-3.0-generate-001` | Image generation (no reference image) | `services/geminiService.ts:81` |
| `gemini-3.1-flash-lite-image` | Image generation/editing (with reference image) | `services/geminiService.ts:68,97` |
| `gemini-3.1-flash-tts-preview` | Text-to-speech | `services/geminiService.ts:138` |

**Authentication:**
- API key (`GEMINI_API_KEY`) injected at build time via Vite's `define` config
- Key available as `process.env.API_KEY` or `process.env.GEMINI_API_KEY` at runtime
- In AI Studio environment, the key is server-side (not exposed to client)

**Real-time Communication:**
- Streaming chat via `AsyncGenerator<GenerateContentResponse>` — `geminiService.streamChatMessage()`
- Web Speech API (`webkitSpeechRecognition`) for speech-to-text transcription

**Browser APIs Used:**
- `navigator.clipboard.writeText()` — copy to clipboard
- `window.AudioContext` / `webkitAudioContext` — audio playback for TTS
- `webkitSpeechRecognition` — speech-to-text
- `localStorage` — theme and language persistence
- `FileReader` — image file to base64 conversion

---

*Stack analysis: 2026-08-15*
