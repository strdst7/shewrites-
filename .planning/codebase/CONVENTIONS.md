# Coding Conventions

**Analysis Date:** 2026-08-15

## Naming Conventions

**Files:**
- **PascalCase** for React components: `App.tsx`, `Header.tsx`, `TabButton.tsx`, `ChatBot.tsx`, `AudioTools.tsx`, `ContentGenerator.tsx`, `ImageGenerator.tsx`, `ImageEditor.tsx`, `ImageAnalyzer.tsx`
- **PascalCase** for utility/context modules: `Icons.tsx`, `LanguageContext.tsx`
- **camelCase** for service files: `geminiService.ts`
- **lowercase** for config/entry files: `index.tsx`, `index.css`, `index.html`, `vite.config.ts`, `types.ts`, `translations.ts`
- **kebab-case** for package name: `"shewrites!"` in `package.json`

**Components:**
- **PascalCase** for all component names: `ContentGenerator`, `ImageGenerator`, `ChatBot`, `AudioTools`
- **PascalCase** for component filenames matching the component name: `ContentGenerator.tsx` → `ContentGenerator`
- **PascalCase** for sub-components defined in the same file: `FormattingToolbar`, `EditableResult`, `CopyButton`, `Stats` (all inside `components/content/ContentGenerator.tsx`)

**Functions:**
- **camelCase** for all functions and methods: `handleImageUpload`, `handleSubmit`, `handleDownload`, `toggleRecording`, `playTTS`
- **camelCase** for service methods: `geminiService.generateContent`, `geminiService.generateImage`, `geminiService.editImage`, `geminiService.analyzeImage`, `geminiService.startChat`, `geminiService.streamChatMessage`, `geminiService.textToSpeech`
- **camelCase** for event handlers with `handle` prefix: `handleChange`, `handleSubmit`, `handleCopy`, `handleFormat`
- **camelCase** for utility functions: `fileToGenerativePart` (in `services/geminiService.ts`)

**Variables:**
- **camelCase** for all state variables and local variables: `activeView`, `isRecording`, `transcript`, `ttsText`, `audioError`
- **SCREAMING_SNAKE_CASE** for schema constants: `contentGenerationSchema` (in `services/geminiService.ts`) — note: this is actually camelCase, not SCREAMING_SNAKE_CASE

**Types/Interfaces:**
- **PascalCase** for interfaces: `ButtonProps`, `SelectProps`, `TabButtonProps`, `ImageFile`, `ChatMessage`, `FormData`, `Result`, `LanguageContextType`
- **PascalCase** for enums: `AppView`
- **PascalCase** for type aliases: `Language`
- **PascalCase** for generic type parameters: `React.FC<{ children: React.ReactNode }>`

**Constants:**
- **camelCase** for module-level constants: `contentGenerationSchema`, `loadingTips`
- **UPPER_SNAKE_CASE** for environment variable references: `API_KEY`, `GEMINI_API_KEY`

## Code Style

**Formatting:**
- No formatter configuration detected (no `.prettierrc`, `.prettierrc.js`, `biome.json`, or similar)
- Indentation: 2 spaces (consistent across all files)
- Semicolons: Not used (TypeScript default without Prettier)
- Single quotes for string literals (consistent across all files)
- Trailing commas: Not used consistently
- No linting configuration detected (no `.eslintrc`, `eslint.config.*`, or similar)

**TypeScript Configuration:**
- `tsconfig.json` at project root
- Target: `ES2022`
- Module: `ESNext`
- JSX: `react-jsx` (automatic runtime)
- Strict mode: Not explicitly enabled (no `strict: true` in `tsconfig.json`)
- `skipLibCheck: true` enabled
- `allowJs: true` enabled
- Path alias: `@/*` → `./*` (configured in both `tsconfig.json` and `vite.config.ts`)
- `experimentalDecorators: true` enabled
- `noEmit: true` — TypeScript used only for type-checking, not compilation

**Import Style:**
- Default imports for React: `import React from 'react'`
- Named imports for React hooks: `import { useState, useEffect, useRef } from 'react'`
- Default imports for components: `import Button from '../common/Button'`
- Named imports for types: `import { ChatMessage, ImageFile } from '../../types'`
- Named imports for context hooks: `import { useLanguage } from '../../LanguageContext'`
- Named exports for icons: `import { Sparkles, BrainCircuit } from './Icons'`
- Service imports use named export: `import { geminiService } from '../../services/geminiService'`

**Import Order (observed pattern):**
1. React imports (`import React, { useState, useEffect, useRef } from 'react'`)
2. Third-party library imports (`import { GoogleGenAI, ... } from '@google/genai'`)
3. Service imports (`import { geminiService } from '../../services/geminiService'`)
4. Type imports (`import { ChatMessage, ImageFile } from '../../types'`)
5. Component imports (`import Button from '../common/Button'`)
6. Context imports (`import { useLanguage } from '../../LanguageContext'`)
7. Icon imports (`import { Sparkles } from './Icons'`)

**Export Patterns:**
- **Default exports** for components: `export default App`, `export default Header`, `export default Button`, `export default ContentGenerator`
- **Named exports** for icons: `export const Sparkles = ...`, `export const BrainCircuit = ...`
- **Named exports** for context: `export const LanguageProvider`, `export const useLanguage`
- **Named exports** for skeletons: `export const ContentSkeleton`, `export const ImageSkeleton`
- **Named export** for service object: `export const geminiService = { ... }`
- **Named exports** for types: `export enum AppView`, `export interface ImageFile`, `export interface ChatMessage`, `export type Language`

**Type Annotation Usage:**
- All component props are typed with interfaces defined above the component
- State variables are typed with generics: `useState<AppView>(...)`, `useState<ChatMessage[]>([])`, `useState<ImageFile | null>(null)`
- Event handlers use React event types: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`
- Return types for async functions use `Promise<>`: `Promise<GenerateContentResponse>`, `Promise<string>`
- Some use of `any` for flexibility: `const config: any = { ... }` in `services/geminiService.ts:43`
- Function component type: `React.FC` with generic props

## Component/Module Patterns

**Component Structure:**
- All components are functional components using `React.FC<PropsType>` pattern
- Component interface defined immediately above the component (or in the same file)
- State hooks declared at the top of the component body
- Event handler functions defined after state hooks
- JSX returned at the bottom
- No separation of styles — all styling via Tailwind CSS classes inline

**Prop/Interface Definition Patterns:**
- Props interfaces defined inline above the component:
  ```typescript
  interface TabButtonProps {
    onClick: () => void;
    active: boolean;
    children: React.ReactNode;
  }
  const TabButton: React.FC<TabButtonProps> = ({ onClick, active, children }) => { ... }
  ```
- Props extending HTML element attributes:
  ```typescript
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
  }
  ```
- Destructured props in function signature: `({ children, isLoading = false, ...props })`

**State Management Patterns:**
- **Local state only** — no global state management library (no Redux, Zustand, etc.)
- `useState` for component-level state
- `useRef` for mutable references (e.g., `recognitionRef`, `messagesEndRef`, `textAreaRef`)
- `useEffect` for side effects (subscriptions, DOM manipulation, localStorage)
- **Context API** for language/i18n: `LanguageContext` provides `language`, `setLanguage`, and `t` (translations object)
- Dark mode state managed via `localStorage` + `useEffect` in `ThemeSwitcher.tsx`
- Language state managed via `localStorage` + `useState` in `LanguageContext.tsx`

**Event Handler Naming:**
- `handle` prefix for handlers: `handleChange`, `handleSubmit`, `handleCopy`, `handleFormat`, `handleImageUpload`, `handleDownload`
- `on` prefix for props: `onClick`, `onFormat`, `onUpdate`
- `toggle` prefix for boolean flips: `toggleRecording`, `toggleTheme`

**Component Categorization:**
- Page-level components in feature directories: `components/content/ContentGenerator.tsx`, `components/image/ImageGenerator.tsx`, `components/chatbot/ChatBot.tsx`, `components/audio/AudioTools.tsx`
- Shared UI components in `components/common/`: `Button.tsx`, `Select.tsx`, `Spinner.tsx`, `Skeleton.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx`
- Layout components at `components/` root: `Header.tsx`, `TabButton.tsx`
- Icon components in `components/Icons.tsx`

## Error Handling Patterns

**Try/Catch Usage:**
- All async operations wrapped in `try/catch/finally` blocks
- `finally` block always resets loading state: `setIsLoading(false)`
- Error state stored in `useState<string | null>(null)`, set to `null` before async calls
- Consistent pattern across all components:
  ```typescript
  try {
    const result = await geminiService.someMethod(...);
    setResult(result);
  } catch (err) {
    setError(t.common.error);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
  ```

**Error Propagation:**
- Service layer (`services/geminiService.ts`) throws errors with descriptive messages:
  - `throw new Error("GEMINI_API_KEY environment variable not set")`
  - `throw new Error("No image was generated from the provided image and prompt.")`
  - `throw new Error("No image was generated.")`
  - `throw new Error("No audio data received.")`
- Component layer catches errors and displays user-facing message via `t.common.error`

**Error Types:**
- No custom error classes — all errors are native `Error` instances
- No error type discrimination or error code system

**User-Facing Error Messages:**
- All user-facing error messages come from the translation system: `t.common.error`
- Malay: `"Ralat berlaku. Sila cuba lagi."`
- English: `"An error occurred. Please try again."`
- Error display: red-styled `<div>` with Tailwind classes:
  ```tsx
  <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>
  ```

**Guard Clauses:**
- Module-level guard for API key: `if (!API_KEY) { throw new Error(...) }` in `services/geminiService.ts:6-8`
- Null checks in components: `if (!prompt || !imageFile) return;` before async calls
- DOM element null check: `if (!rootElement) { throw new Error(...) }` in `index.tsx:8-10`

**Console Logging:**
- `console.error()` used for all caught errors — no structured logging
- No `console.log()` for debug messages in production code
- No logging library

## Documentation Conventions

**Code Comments:**
- Very sparse — minimal comments throughout the codebase
- Comments are primarily in English
- One comment in `components/audio/AudioTools.tsx:7`: `// Fix for TypeScript "Cannot find name 'SpeechRecognition'".`
- Inline comments in JSX for section delineation: `{/* Transcription Section */}`, `{/* Text-to-Speech Section */}`

**JSDoc/TSDoc:**
- Not used anywhere in the codebase
- No function documentation, parameter descriptions, or return type documentation

**README:**
- No README file exists

**API Documentation:**
- No API documentation
- Gemini API models and configuration are documented inline through code structure

## Git Conventions

**Branch Naming:**
- Only 2 commits in history — no branching convention established
- [UNVERIFIED] No branch naming convention detected

**Commit Message Format:**
- Observed: `feat: add core application layout and audio tools` and `Initial commit`
- Follows conventional commit style (`feat:` prefix) at least for the first real commit
- [UNVERIFIED] No commit message template or enforcement

**PR Conventions:**
- No PR templates or conventions detected
- No CI/CD pipeline configured

## Linting & Formatting

**Linter Configuration:**
- No ESLint configuration detected (no `.eslintrc*`, `eslint.config.*`)
- No Biome configuration detected
- TypeScript type-checking used as the only "lint" step: `"lint": "tsc --noEmit"` in `package.json`

**Formatter Configuration:**
- No Prettier configuration detected (no `.prettierrc*`)
- No formatter enforced — code style is implicit/convention-based

**Pre-commit Hooks:**
- No pre-commit hooks configured (no `.husky/`, no `.pre-commit-config.yaml`, no `lint-staged`)

**CI Checks:**
- No CI/CD pipeline configured (no `.github/workflows/`, no `Jenkinsfile`, no `circle.yml`)
- No automated test, lint, or build checks

**Type Checking:**
- `tsc --noEmit` available via `npm run lint`
- TypeScript strict mode is NOT enabled (`tsconfig.json` has no `strict: true`)
- `any` type used in at least one place: `services/geminiService.ts:43` (`const config: any`)
- `window as any` cast in `components/audio/AudioTools.tsx:30`

---

*Convention analysis: 2026-08-15*
