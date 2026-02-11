
import { GoogleGenAI } from "@google/genai";

export const askSukantaAI = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are 'Shikkhok' (শিক্ষক), a friendly and professional English teacher for Bengali students. Your goal is to help students learn English grammar, paragraphs, and essays. Answer in a mix of Bengali and English to ensure understanding. Be encouraging and clear.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। আবার চেষ্টা করুন।";
  }
};
