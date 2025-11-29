import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";

export const generateQuestions = async (topic: string): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Create 3 simple multiple choice questions suitable for "English for Libya Prep 3" students about the topic: "${topic}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
            },
            required: ['text', 'options', 'correctAnswer'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    const rawData = JSON.parse(text);

    return rawData.map((q: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      module: 'AI Generated',
      section: 'General',
      type: QuestionType.MCQ,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [];
  }
};
