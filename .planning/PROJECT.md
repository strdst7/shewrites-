# SheWrites! — Content Pipeline

## What This Is

SheWrites! is an AI content studio for women entrepreneurs in Malaysia. This milestone adds an automated content pipeline: enter a topic, and the app generates a full post and matching image in one seamless flow — no manual handoff between tools.

## Core Value

One topic in, full content suite out — the pipeline eliminates the friction of switching between tools and manually re-entering prompts.

## Requirements

### Validated

- ✓ Content generation with Gemini (structured JSON output) — existing
- ✓ Image generation with Gemini (Imagen model) — existing
- ✓ Image editing with reference image — existing
- ✓ Image analysis — existing
- ✓ Bilingual UI (Malay/English) with LanguageContext — existing
- ✓ Dark/light theme with localStorage persistence — existing
- ✓ Streaming chat (AI Coach) — existing
- ✓ Audio tools (TTS + STT) — existing
- ✓ Copy-to-clipboard for generated content — existing
- ✓ Download for generated images — existing

### Active

- [ ] User can enter a topic and trigger the content pipeline
- [ ] Pipeline generates a written post from the topic using existing Gemini content generation
- [ ] Pipeline automatically generates a matching image from the post content
- [ ] Pipeline runs end-to-end without manual step approval (auto-run)
- [ ] User can review and edit both post and image after generation
- [ ] Pipeline respects the current app language setting (Malay/English)
- [ ] Pipeline lives as a new tab in the app alongside existing tools

### Out of Scope

- Caption variants — pipeline can be extended later to generate shorter/alternative versions
- Audio narration from post — not in scope for this milestone
- Auto-posting or scheduling — not in scope
- Content calendar — not in scope
- Backend API proxy for Gemini key — known security concern, separate fix
- Saving/persisting pipeline results — not in scope (no backend yet)

## Context

- SheWrites! is a client-side-only React SPA running on Vite with the Google Gemini API
- All AI capabilities are provided by the `@google/genai` SDK called directly from the browser
- The app currently has separate tools (Content Generator, Image Generator, Image Editor, Image Analyzer, AI Coach, Audio Tools) that operate independently
- The Gemini service layer (`services/geminiService.ts`) centralizes all API calls and is the integration point
- The existing ContentGenerator uses structured JSON output with a content generation schema
- The existing ImageGenerator uses the Imagen model for generation and can accept reference images
- Content generation prompts are currently hardcoded in Malay — the pipeline should respect the app language setting
- The app uses a custom i18n system (`LanguageContext.tsx` + `translations.ts`) — all new UI strings must go through it
- The app uses Tailwind CSS via CDN with custom brand-pink and brand-cream colors

## Constraints

- **Tech Stack:** Must use existing React + Gemini API + Vite stack — no new backend or infrastructure
- **API Key:** Pipeline inherits the existing client-side API key approach (known security concern, separate fix)
- **i18n:** All new user-facing strings must go through the translation system (`translations.ts`)
- **Styling:** Must use existing Tailwind CSS approach with brand colors
- **No new dependencies:** Prefer using existing `@google/genai` SDK capabilities over adding new packages

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pipeline as a new tab | Different interaction model (one input → chained outputs) vs existing single-purpose tools; avoids making ContentGenerator even larger | — Pending |
| Auto-run without step approval | Reduces friction — the user enters a topic and gets results; can review/edit after | — Pending |
| Post → Image sequential flow | Image generation depends on the post content to create a matching visual; can't be parallel | — Pending |
| Respect app language setting | Consistent with existing app behavior; prompts should be in the user's selected language | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-15 after initialization*
