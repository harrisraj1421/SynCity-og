
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API will not be available.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface StudyGuide {
  summary: string;
  keyPoints: string[];
  practiceQuestions: {
    question: string;
    answer: string;
  }[];
}

export const generateStudyGuide = async (text: string): Promise<StudyGuide> => {
  if (!process.env.API_KEY) {
    // Return mock data if API key is not available
    return {
      summary: "This is a mock summary because the Gemini API key is not configured. The provided text would be summarized here, highlighting the main ideas and arguments.",
      keyPoints: [
        "This is a key point extracted from the text.",
        "This is another important concept or fact.",
        "And a third key takeaway for quick review."
      ],
      practiceQuestions: [
        { question: "What is the main topic of the text? (Mock Question)", answer: "The main topic is whatever the provided text was about." },
        { question: "Can you explain a specific concept? (Mock Question)", answer: "Yes, this answer would elaborate on a specific concept from the text." }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following text, generate a study guide. Provide a concise summary, 3-5 bulleted key points, and 2-3 practice questions with their answers. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise summary of the provided text."
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3-5 key takeaways or important points from the text."
            },
            practiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              },
              description: "A list of 2-3 practice questions based on the text, with answers."
            }
          },
          required: ["summary", "keyPoints", "practiceQuestions"]
        }
      }
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate study guide. Please check your API key and try again.");
  }
};
