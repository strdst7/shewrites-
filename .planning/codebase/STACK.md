---
last_mapped_commit: 128905ad42b6c7d744019829fe2a22b91405204c
last_mapped_at: 2026-11-16
---
# Technology Stack

**Analysis Date:** 2026-11-16

## Languages

**Primary:**
- TypeScript 5.8.2: React components, Gemini service, and Vite config in `*.tsx`, `services/geminiService.ts`, and `vite.config.ts`.

**Secondary:**
- HTML and CSS: `index.html` and `index.css`.
- JavaScript: inline Tailwind config in `index.html`.

## Runtime

**Environment:**
- Browser: React app mounted by `index.tsx`.
- Node.js 20: build runtime in `.github/workflows/deploy.yml`.

**Package Manager:**
- npm: `package-lock.json` exists, and deployment runs `npm ci`.

## Frameworks

**Core:**
- React 19.2.0 and React DOM 19.2.0: UI in `components/` and `App.tsx`.
- Tailwind CSS CDN: utility classes and inline theme config in `index.html`.

**Testing:**
- Not detected: `package.json` defines no test runner or test script.

**Build/Dev:**
- Vite 6.2.0 and `@vitejs/plugin-react` 5.0.0: `vite.config.ts`.
- TypeScript 5.8.2: `npm run lint` executes `tsc --noEmit` using `tsconfig.json`.

## Key Dependencies

**Critical:**
- `@google/genai` 1.29.0: Gemini and Imagen API access in `services/geminiService.ts`.
- `react` and `react-dom` 19.2.0: rendering and hooks in `index.tsx` and `components/`.

**Infrastructure:**
- Google Fonts and Tailwind CDN: browser-loaded styling in `index.html`.
- `@types/node` 22.14.0: Node types in `vite.config.ts`.

## Configuration

**Environment:**
- `GEMINI_API_KEY` is loaded by `vite.config.ts` and substituted into browser code.
- `GITHUB_ACTIONS` selects the `/shewrites-/` base path in `vite.config.ts`.

**Build:**
- `package.json` scripts define `dev`, `build`, `preview`, and `lint`.
- `tsconfig.json` uses ES2022, JSX automatic runtime, and the `@/*` path alias.

## Platform Requirements

**Development:**
- Install dependencies with `npm ci` and run `npm run dev` on port 3000.
- Gemini operations require a valid API key. No server-side key boundary exists.

**Production:**
- `.github/workflows/deploy.yml` builds `dist/` and publishes GitHub Pages.
- Browser access to external CDNs and Google AI endpoints is required.

---

*Stack analysis: 2026-11-16*
