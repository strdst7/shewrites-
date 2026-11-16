import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality, ThinkingLevel } from "@google/genai";
import { ImageFile } from '../types';

let apiKey = '';
let chatInstance: Chat | null = null;

export const setGeminiApiKey = (key: string) => {
  apiKey = key.trim();
  chatInstance = null;
};

const getAI = () => {
  if (!apiKey) {
    throw new Error("Enter your Gemini API key above before making an AI request.");
  }

  return new GoogleGenAI({ apiKey });
};

export const getGeminiError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  if (!apiKey) return "Enter your Gemini API key above before making an AI request.";
  if (/api.key|api key|unauthorized|unauthenticated|401|403|permission.denied/i.test(message)) {
    return "Gemini rejected your API key or its permissions. Check your key in Google AI Studio and update it above.";
  }
  if (/quota|rate.limit|resource.exhausted|429/i.test(message)) {
    return "Gemini quota or rate limit reached. Check your Google AI Studio usage and try again later.";
  }
  if (/not.found|not supported|404|model/i.test(message)) {
    return "This Gemini model is unavailable for your key. Check your model access in Google AI Studio.";
  }
  return "Gemini request failed. Check your connection and Google AI Studio access, then try again.";
};

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

    return await getAI().models.generateContent({
      model,
      contents: prompt,
      config,
    });
  },

  async generateImage(prompt: string, aspectRatio: string, image?: ImageFile): Promise<string> {
    const response = await getAI().models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: { parts: [...(image ? [fileToGenerativePart(image)] : []), { text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: { aspectRatio },
      },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data);
    if (part?.inlineData?.data) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
    throw new Error("No image was generated from the provided prompt.");
  },

  async editImage(prompt: string, image: ImageFile): Promise<string> {
    const imagePart = fileToGenerativePart(image);
    const response = await getAI().models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data);
    if (part?.inlineData?.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
    throw new Error("No image was generated.");
  },

  async analyzeImage(prompt: string, image: ImageFile): Promise<string> {
    const imagePart = fileToGenerativePart(image);
    const response = await getAI().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text || '';
  },

  startChat(): void {
    chatInstance = null;
  },

  async streamChatMessage(message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    if (!chatInstance) chatInstance = getAI().chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: "Anda ialah pembantu AI strategi kandungan dan perniagaan untuk SheWrites!, khas untuk usahawan wanita di Malaysia. Sentiasa beri respons dalam Bahasa Melayu yang mesra, profesional, santai dan bermotivasi, mengikut trend pasaran Malaysia.",
      },
      history: [],
    });
    return await chatInstance!.sendMessageStream({ message });
  },
  
  async textToSpeech(text: string): Promise<string> {
    const response = await getAI().models.generateContent({
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
