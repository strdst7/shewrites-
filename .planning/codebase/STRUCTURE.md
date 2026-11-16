---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# Codebase Structure

**Analysis Date:** 2026-11-16

## Directory Layout

```text
shewrites-/
├── .github/               # GitHub Actions deployment and Dependabot
├── components/
│   ├── audio/              # Browser transcription and speech output
│   ├── chatbot/            # Streaming chat interface
│   ├── common/             # Shared controls, loaders, preference switches
│   ├── content/            # Content prompt and editable results
│   └── image/              # Generation, editing, and analysis views
├── services/               # Google AI SDK integration
├── App.tsx                 # View switching and application shell
├── LanguageContext.tsx     # Locale provider and persistence
├── translations.ts         # Malay and English UI text
├── types.ts                # Shared view, image, and chat types
├── index.tsx               # React mount point
├── index.html              # HTML, CDN assets, and inline Tailwind config
├── vite.config.ts          # Build and dev server config
└── package.json            # Dependencies and scripts
```

## Directory Purposes

**`components/`:**
- Contains one directory per feature and shared UI in `components/common/`.
- `components/Header.tsx`, `components/Icons.tsx`, and `components/TabButton.tsx` support the app shell.

**`services/`:**
- `services/geminiService.ts` owns all Google AI SDK calls.

**`.github/`:**
- `.github/workflows/deploy.yml` publishes GitHub Pages.
- `.github/dependabot.yml` schedules dependency updates.

## Key File Locations

**Entry Points:**
- `index.html`: loads browser assets and `index.tsx`.
- `index.tsx`: mounts `App.tsx` under `LanguageProvider`.

**Configuration:**
- `package.json`: scripts and dependencies.
- `tsconfig.json`: TypeScript compiler config and `@/*` alias.
- `vite.config.ts`: Vite dev server, asset base, and env substitution.

**Core Logic:**
- `App.tsx`: tab selection.
- `services/geminiService.ts`: Google AI requests and chat session.
- `LanguageContext.tsx`, `translations.ts`: localization.

**Testing:**
- No test files or test config are present.

## Naming Conventions

**Files:**
- PascalCase for React components: `components/image/ImageEditor.tsx`.
- camelCase for services and shared modules: `services/geminiService.ts`, `translations.ts`.

**Directories:**
- Lowercase feature names: `components/content/`, `components/image/`.

## Where to Add New Code

**New Feature:**
- Add the view under `components/<feature>/` and register it in `types.ts` and `App.tsx`.
- Add localized labels to `translations.ts`.
- No test directory exists. Add a test runner before creating executable tests.

**New Component/Module:**
- Place reusable controls in `components/common/` and feature views in their feature directory.

**Utilities:**
- Put Google AI request code in `services/geminiService.ts` or another file under `services/`.

## Special Directories

**`dist/`:**
- Vite build output from `npm run build`. `.gitignore` excludes it.

**`.planning/codebase/`:**
- Codebase map documents. These documents are committed after generation.

---

*Structure analysis: 2026-11-16*
