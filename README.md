# SheWrites! ✨

> **The Ultimate AI Content & Multimedia Studio for Malaysian Female Entrepreneurs & Creators.**  
> Crafted with passion by [aimirah.com](https://aimirah.com) &bull; 2026 Nur Amirah Mohd Kamil

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gen AI SDK](https://img.shields.io/badge/Google_Gen_AI_SDK-@google/genai-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🌟 Overview

**SheWrites!** is a comprehensive, bilingual (Bahasa Melayu & English) AI studio engineered specifically for women entrepreneurs, creators, and digital marketers in Malaysia. Powered by Google's next-generation **Gemini 3** and **Imagen 3** models via `@google/genai`, SheWrites! empowers users to craft viral social media threads, produce marketing copy, generate luxury aesthetic imagery, analyze visual assets, and synthesize voiceovers seamlessly.

---

## 🚀 Core Features

### 1. ✍️ SheWrites! Content Studio
- **Pre-defined Prompt Templates**:
  - 🔥 **Viral Thread (Thread Tular)**: 5-part storytelling formula engineered for high engagement and reposts.
  - 👑 **Luxury Affirmation (Affirmasi Mewah)**: Quiet-luxury, calm, abundance mindset copywriting.
  - 🛍️ **Sales Hook (Pencangkuk Jualan 5-Angka)**: Problem &rarr; Agitation &rarr; Solution conversion framework.
  - ⭐ **Client Transformation Story**: Compelling before-and-after social proof narratives.
  - 📈 **Money Mindset Memo**: Authoritative thought leadership and financial intelligence.
  - 💬 **Relatable Banter & Meme**: Witty, relatable posts reflecting everyday female entrepreneurship.
- **Editable Output Canvas**: Directly edit and polish the AI-generated Hook, Thread Post, CTA, and Hashtags in real time.
- **Markdown Formatting Toolbar**: Format text instantly with **Bold**, *Italic*, and Bulleted List (`•`) controls.
- **Live Word & Character Count Tracker**: Real-time counter for each section to ensure compliance with character limits (e.g. 500-char limit on Threads).
- **1-Click Copy to Clipboard**: Instant copy with visual feedback ("Disalin!" / "Copied!").
- **Search Grounding & Deep Thinking**: Toggle real-time Google Search grounding or high-reasoning Gemini 3.1 Pro mode.

---

### 2. 🎨 AI Image Generator & Studio
- **Text-to-Image Generation**: Photorealistic and aesthetic image creation powered by `imagen-3.0-generate-001`.
- **Multi-Aspect Ratio Support**: Seamless output in `1:1` (Square), `3:4` (Portrait), `4:3` (Landscape), `9:16` (Story/Reel), and `16:9` (Widescreen).
- **Image-to-Image Generation**: Provide visual reference images combined with descriptive prompts.

---

### 3. 🪄 AI Image Editor (Inpainting & Remixing)
- **Prompt-Based Image Editing**: Edit and enhance existing photos using `gemini-3.1-flash-lite-image`.
- **Aesthetic Refinement**: Modify lighting, backgrounds, subjects, and artistic styles without loss of quality.

---

### 4. 🔍 Multimodal Image Analyzer
- **Vision-Powered Insights**: Upload product or social photos for comprehensive visual audits using `gemini-3.6-flash`.
- **Actionable Copy Extraction**: Automatically extract marketing hooks, color palette recommendations, and audience engagement suggestions from any image.

---

### 5. 💬 SheWrites! AI Strategy Chatbot
- **Bilingual Business Persona**: Conversational AI consultant tuned for the Malaysian market, personal branding, and female entrepreneurship.
- **Real-Time Streaming Responses**: Instant, low-latency streaming chat powered by `gemini-3.6-flash`.

---

### 6. 🎙️ Audio & Voice Studio
- **High-Fidelity Text-to-Speech (TTS)**: Convert captions and affirmations into studio-quality spoken audio using `gemini-3.1-flash-tts-preview` with realistic speech synthesis.

---

### 7. 🌸 Thoughtful UI & Aesthetic Design
- **Bilingual Support**: Instant toggle between **Bahasa Melayu (MS)** and **English (EN)** with dynamic localization.
- **Dark / Light Mode**: Complete theme toggle with persistent preferences.
- **Fluid Ambient Visualizer**: Responsive background canvas.
- **Clean Typography & Responsive Layout**: Built with Playfair Display (Serif) & Montserrat (Sans) with fluid container scaling across mobile, tablet, and desktop.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Bundler & Tooling** | Vite 6 |
| **Styling** | Tailwind CSS |
| **Icons** | Custom SVG Lucide-compatible icon system |
| **AI Models (LLM / Multimodal)** | Google Gemini 3 (`gemini-3.6-flash`, `gemini-3.1-pro-preview`) |
| **Image Generation & Editing** | Google Imagen 3 (`imagen-3.0-generate-001`, `gemini-3.1-flash-lite-image`) |
| **Voice Synthesis (TTS)** | Google Gemini TTS (`gemini-3.1-flash-tts-preview`) |
| **SDK** | `@google/genai` (Official Google Gen AI SDK) |

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/shewrites.git
   cd shewrites
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## 🏗️ Build & Production

To compile TypeScript and create a production build:

```bash
# Type check and build with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
shewrites/
├── components/
│   ├── audio/              # Audio & Text-to-Speech components
│   ├── chatbot/            # AI Chatbot assistant with streaming
│   ├── common/             # Button, Select, Theme & Language Switchers, Skeletons
│   ├── content/            # Content Studio, Templates Sidebar & Template Data
│   ├── image/              # Image Generator, Editor & Analyzer
│   ├── Header.tsx          # Responsive brand navigation & controls
│   ├── Icons.tsx           # High-precision SVG iconography
│   └── TabButton.tsx       # Studio navigation tabs
├── services/
│   └── geminiService.ts    # Centralized @google/genai API client & workflows
├── App.tsx                 # Core application layout & view router
├── LanguageContext.tsx     # Internationalization context (MS / EN)
├── translations.ts         # Complete bilingual locale strings
├── types.ts                # TypeScript interfaces, enums, & schemas
├── index.html              # HTML entry with font configurations
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies & scripts
```

---

## 👩‍💻 Author & Credits

- **Creator & Developer**: Nur Amirah Mohd Kamil
- **Website**: [aimirah.com](https://aimirah.com)
- **Year**: 2026

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
