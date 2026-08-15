import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality, ThinkingLevel } from "@google/genai";
import { ChatMessage, ImageFile } from '../types';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ 
  apiKey: API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
let chatInstance: Chat | null = null;

const fileToGenerativePart = (imageFile: ImageFile) => {
  return {
    inlineData: {
      data: imageFile.base64,
      mimeType: imageFile.file.type,
    },
  };
};

const contentGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    hook: { type: Type.STRING, description: "Baris pembuka menarik perhatian dalam Bahasa Melayu (≤ 90 aksara)." },
    thread_post: { type: Type.STRING, description: "Salinan penuh post Threads dalam Bahasa Melayu dengan pemformatan kemas." },
    cta: { type: Type.STRING, description: "Panggilan bertindak (Call-to-Action) dalam Bahasa Melayu." },
    hashtag_block: { type: Type.STRING, description: "Blok hashtag berasaskan trend pasaran Malaysia." },
  },
  required: ["hook", "thread_post", "cta", "hashtag_block"],
};

export const geminiService = {
  async generateContent(prompt: string, usePro: boolean, useSearch: boolean): Promise<GenerateContentResponse> {
    const model = usePro ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash';
    const config: any = {
        responseMimeType: useSearch ? undefined : "application/json",
        responseSchema: useSearch ? undefined : contentGenerationSchema,
    };

    if (usePro) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }
    
    if (useSearch) {
        config.tools = [{ googleSearch: {} }];
    }

    return await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });
  },

  async generateImage(prompt: string, aspectRatio: string, image?: ImageFile): Promise<string> {
    if (image) {
      const imagePart = fileToGenerativePart(image);
      const textPart = { text: prompt };
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      throw new Error("No image was generated from the provided image and prompt.");
    } else {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio,
        },
      });
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
  },

  async editImage(prompt: string, image: ImageFile): Promise<string> {
    const imagePart = fileToGenerativePart(image);
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
    });
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image was generated.");
  },

  async analyzeImage(prompt: string, image: ImageFile): Promise<string> {
    const imagePart = fileToGenerativePart(image);
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text || '';
  },

  startChat(): void {
    chatInstance = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: "Anda ialah pembantu AI strategi kandungan dan perniagaan untuk SheWrites!, khas untuk usahawan wanita di Malaysia. Sentiasa beri respons dalam Bahasa Melayu yang mesra, profesional, santai dan bermotivasi, mengikut trend pasaran Malaysia.",
      },
      history: [],
    });
  },

  async streamChatMessage(message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    if (!chatInstance) {
      this.startChat();
    }
    return await chatInstance!.sendMessageStream({ message });
  },
  
  async textToSpeech(text: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
          throw new Error("No audio data received.");
      }
      return base64Audio;
  }
};