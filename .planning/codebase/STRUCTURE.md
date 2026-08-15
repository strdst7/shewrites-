# Codebase Structure

**Analysis Date:** 2026-08-15

## Directory Layout

```
shewrites-/
├── components/            # All React UI components
│   ├── audio/             # Audio tools feature (speech-to-text, TTS)
│   ├── chatbot/           # AI Coach chat feature
│   ├── common/            # Shared/reusable UI components
│   ├── content/           # Content generation feature
│   ├── image/             # Image generation, editing, analysis features
│   ├── Header.tsx         # App header with language/theme switchers
│   ├── Icons.tsx          # Inline SVG icon components
│   └── TabButton.tsx      # Tab navigation button
├── services/              # External service abstractions
│   └── geminiService.ts   # All Gemini API interactions
├── .gitignore             # Git ignore rules
├── .planning/             # GSD planning documents (generated)
│   └── codebase/          # Codebase analysis documents
├── App.tsx                # Root application component
├── index.css              # Minimal global styles
├── index.html             # HTML entry point (Vite)
├── index.tsx              # React entry point (mounts app)
├── LanguageContext.tsx     # i18n context provider + hook
├── metadata.json          # App metadata (name, description, capabilities)
├── package.json           # Dependencies and scripts
├── translations.ts        # Malay/English translation strings
├── tsconfig.json          # TypeScript configuration
├── types.ts               # Shared type definitions (AppView, ImageFile, ChatMessage)
└── vite.config.ts         # Vite build configuration
```

## Directory Purposes

**`components/`:**
- Purpose: All React UI components organized by feature
- Contains: `.tsx` files; each feature has its own subdirectory
- Key files: `content/ContentGenerator.tsx`, `image/ImageGenerator.tsx`, `chatbot/ChatBot.tsx`, `audio/AudioTools.tsx`

**`components/audio/`:**
- Purpose: Audio-related feature components
- Contains: `AudioTools.tsx` — speech-to-text (Web Speech API) and text-to-speech (Gemini TTS)

**`components/chatbot/`:**
- Purpose: AI Coach chat feature
- Contains: `ChatBot.tsx` — streaming chat interface with message history

**`components/common/`:**
- Purpose: Shared/reusable UI primitives
- Contains: `Button.tsx`, `Select.tsx`, `Skeleton.tsx`, `Spinner.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx`
- Key files: All are reusable across features

**`components/content/`:**
- Purpose: Content generation feature
- Contains: `ContentGenerator.tsx` — form-driven Threads content generation with structured output

**`components/image/`:**
- Purpose: Image-related feature components
- Contains: `ImageGenerator.tsx`, `ImageEditor.tsx`, `ImageAnalyzer.tsx`

**`services/`:**
- Purpose: External service abstractions
- Contains: `geminiService.ts` — singleton object wrapping all Gemini API calls
- Key files: `geminiService.ts` is the sole file; all API logic lives here

## Key File Locations

**Entry Points:**
- `index.html`: HTML entry — loads Tailwind CDN, fonts, import map, and `index.tsx`
- `index.tsx`: React entry — creates root, wraps with `LanguageProvider` and `StrictMode`
- `App.tsx`: Application root — view routing via `AppView` enum, tab navigation, layout

**Configuration:**
- `vite.config.ts`: Vite build config — dev server port, API key injection, `@` path alias
- `tsconfig.json`: TypeScript config — ES2022 target, bundler module resolution, JSX react-jsx
- `package.json`: Project manifest — React 19, Vite 6, `@google/genai` 1.29
- `metadata.json`: App metadata for AI Studio deployment

**Core Logic:**
- `services/geminiService.ts`: All Gemini API interactions (content gen, image gen/edit/analyze, chat, TTS)
- `types.ts`: Shared types (`AppView`, `ImageFile`, `ChatMessage`)
- `LanguageContext.tsx`: i18n provider and `useLanguage` hook
- `translations.ts`: Full Malay/English translation strings (204 lines)

**Shared UI:**
- `components/common/Button.tsx`: Reusable button with loading state
- `components/common/Select.tsx`: Reusable select dropdown with label
- `components/common/Skeleton.tsx`: Loading skeletons (ContentSkeleton, ImageSkeleton)
- `components/common/Spinner.tsx`: Simple spinner
- `components/common/ThemeSwitcher.tsx`: Dark/light toggle
- `components/common/LanguageSwitcher.tsx`: MS/EN toggle

**Feature Components:**
- `components/content/ContentGenerator.tsx`: Content generation (348 lines — largest component)
- `components/image/ImageGenerator.tsx`: Image generation (177 lines)
- `components/image/ImageEditor.tsx`: Image editing (121 lines)
- `components/image/ImageAnalyzer.tsx`: Image analysis (103 lines)
- `components/chatbot/ChatBot.tsx`: AI Coach chat (87 lines)
- `components/audio/AudioTools.tsx`: Speech-to-text + TTS (147 lines)

**Icons:**
- `components/Icons.tsx`: All inline SVG icon components (Sparkles, BrainCircuit, Image, Wand, Bot, Mic, ImageUp, Download, Volume2, Sun, Moon, Copy, Check, Bold, Italic, List)

## Source Code Organization

**Organization Pattern:** By feature (primary), with a shared `common/` directory for reusable components

The project is a flat-structure SPA with no deep nesting. Each feature area gets one directory under `components/`:

```
components/
├── {feature}/          # Feature-specific components (one per feature)
│   └── {FeatureName}.tsx
├── common/             # Shared UI primitives
│   └── {ComponentName}.tsx
├── Header.tsx          # App-level layout components
├── Icons.tsx           # Icon library
└── TabButton.tsx       # Shared feature-adjacent components
```

**Service layer:** A single file `services/geminiService.ts` handles all external API calls. There is no repository pattern or data layer abstraction.

**Naming Conventions for Files:**
- Components: PascalCase `.tsx` (e.g., `ContentGenerator.tsx`, `ChatBot.tsx`)
- Services: camelCase `.ts` (e.g., `geminiService.ts`)
- Context: PascalCase `.tsx` with "Context" suffix (e.g., `LanguageContext.tsx`)
- Types: lowercase `.ts` (e.g., `types.ts`)
- Translations: lowercase `.ts` (e.g., `translations.ts`)
- Icons: PascalCase `.tsx` (e.g., `Icons.tsx`)

**Index files / Barrel exports:** None. All imports use direct file paths (e.g., `import Button from '../common/Button'`).

## Asset Organization

**Static Assets:**
- No `public/` directory or static assets beyond `vite.svg` (referenced in `index.html`)
- External fonts loaded via Google Fonts CDN in `index.html`
- Tailwind CSS loaded via CDN script (`https://cdn.tailwindcss.com`) — not a build asset

**Public Files:**
- `index.html` is the only HTML file (Vite SPA)
- No `public/` directory exists

**Upload/Media Handling:**
- Image uploads are handled in-browser via `FileReader` API
- Uploaded images are converted to base64 and sent to Gemini API
- No server-side file storage; all image data is ephemeral (in-memory only)
- Generated images are displayed as base64 data URIs and can be downloaded via client-side download link

## Configuration Files

**Environment Configuration:**
- `GEMINI_API_KEY` is the only required environment variable
- Injected via Vite's `define` config in `vite.config.ts:14-15`:
  ```typescript
  define: {
    'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  }
  ```
- Loaded via Vite's `loadEnv(mode, '.', '')` — reads from `.env` files in project root
- No `.env` file is committed (excluded via `.gitignore` pattern `*.local`)

**Build Configuration:**
- `vite.config.ts`: Vite build config with React plugin, path alias (`@` → project root), dev server port 3000
- `tsconfig.json`: TypeScript config — ES2022, bundler module resolution, `noEmit: true`, JSX react-jsx
- `package.json`: Scripts — `dev` (vite), `build` (vite build), `preview` (vite preview), `lint` (tsc --noEmit)

**CDN Dependencies (import map in `index.html`):**
- `react` → `https://aistudiocdn.com/react@^19.2.0`
- `react-dom` → `https://aistudiocdn.com/react-dom@^19.2.0`
- `@google/genai` → `https://aistudiocdn.com/@google/genai@^1.29.0`
- These are loaded via `<script type="importmap">` in the HTML

**CI/CD Configuration:**
- None detected — no `.github/`, no CI config files

## Generated/Build Output

**Build Output:**
- `dist/` — Vite build output (gitignored)
- `dist-ssr/` — Vite SSR build output (gitignored)

**Generated Code:**
- None — no code generation, no auto-generated files

**Cache Directories:**
- `node_modules/` — npm dependencies (gitignored)
- `*.local` — Vite local env files (gitignored)

## Where to Add New Code

**New Feature/View:**
1. Add a new value to the `AppView` enum in `types.ts`
2. Create a new component directory under `components/` (e.g., `components/analytics/`)
3. Create the feature component file (e.g., `components/analytics/Analytics.tsx`)
4. Add a new `TabButton` in `App.tsx` with the corresponding `AppView` value
5. Add a new case in the `switch` statement in `App.tsx`'s `renderView()`
6. Add translation strings for the new feature in both `ms` and `en` sections of `translations.ts`

**New Gemini API Method:**
1. Add the method to the `geminiService` object in `services/geminiService.ts`
2. If the method returns new data shapes, add types to `types.ts`
3. Call the method from the relevant feature component

**New Shared UI Component:**
1. Create the component in `components/common/` (e.g., `components/common/Modal.tsx`)
2. Export as default from the file
3. Import using relative path: `import Modal from '../common/Modal'`

**New Icon:**
1. Add an exported SVG component to `components/Icons.tsx`
2. Follow the existing pattern: `export const IconName = (props: React.SVGProps<SVGSVGElement>) => (...)`

**New Translation Strings:**
1. Add keys to both `ms` and `en` objects in `translations.ts`
2. The `useLanguage()` hook's `t` object is typed to include all keys

## Special Directories

**`.planning/`:**
- Purpose: GSD planning documents (codebase analysis, milestone plans)
- Generated: Yes (by GSD tooling)
- Committed: Yes

**`node_modules/`:**
- Purpose: npm package dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`dist/`:**
- Purpose: Vite production build output
- Generated: Yes (by `vite build`)
- Committed: No (gitignored)

---

*Structure analysis: 2026-08-15*
