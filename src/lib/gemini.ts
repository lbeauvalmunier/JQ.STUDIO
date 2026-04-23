import { GoogleGenAI } from "@google/genai";

const AI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || "",
};

export const ai = new GoogleGenAI({ apiKey: AI_CONFIG.apiKey });

export async function generateCampaignImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("AI Generation failed:", error);
  }
  return null;
}
