
export enum AppView {
  CONTENT_GENERATOR = 'ContentGenerator',
  IMAGE_GENERATOR = 'ImageGenerator',
  IMAGE_EDITOR = 'ImageEditor',
  IMAGE_ANALYZER = 'ImageAnalyzer',
  CHAT = 'Chat',
  AUDIO_TOOLS = 'AudioTools',
}

export interface ImageFile {
  file: File;
  base64: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
