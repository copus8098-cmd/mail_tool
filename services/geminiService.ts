
import { GoogleGenAI, Type } from "@google/genai";
import { EmailRequest, EmailResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEmail = async (params: EmailRequest): Promise<EmailResponse> => {
  const { description, language, tone, category } = params;

  const prompt = `
    Generate a professional email in ${language} based on the following details:
    - Context/Purpose: ${description}
    - Tone: ${tone}
    - Category: ${category}

    Please ensure the email includes:
    1. A concise and clear subject line.
    2. A professional greeting.
    3. A well-structured body with appropriate paragraphs.
    4. A professional closing/sign-off.
    5. Placeholders in [brackets] for names or specific details that need user input.

    If the language is Arabic, ensure formal phrasing appropriate for professional business communication in the Middle East.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "The email subject line.",
            },
            body: {
              type: Type.STRING,
              description: "The full body text of the email.",
            },
          },
          required: ["subject", "body"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      subject: result.subject || "No Subject Generated",
      body: result.body || "No Body Generated",
    };
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Failed to generate email. Please try again.");
  }
};
