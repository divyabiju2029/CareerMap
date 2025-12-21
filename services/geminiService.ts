
import { GoogleGenAI, Type } from "@google/genai";
import { InterestScores, RecommendationResponse } from "../types";

export const generateCareerRecommendations = async (scores: InterestScores): Promise<RecommendationResponse> => {
  // Always use a named parameter for the API key from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scoreSummary = Object.entries(scores)
    .map(([domain, score]) => `${domain}: ${score}/10`)
    .join(", ");

  const prompt = `
    The user has taken a career interest assessment. Here are their scores across different domains:
    ${scoreSummary}

    Based on these scores, identify the top 3 career roles that would be a perfect fit. 
    For each role, provide:
    1. The job title and a brief description.
    2. A match score (0-100) based on their interest profile.
    3. A list of 5 essential technical and soft skills.
    4. A list of 3-4 professional certifications or degrees.
    5. A structured 4-step roadmap (milestones) to achieve this career.
    
    Also provide a brief overall "Profile Summary" explaining why these careers were chosen based on their dominant interests.
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
            profileSummary: { type: Type.STRING },
            topCareers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  requiredSkills: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  certifications: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        timeframe: { type: Type.STRING }
                      },
                      required: ["title", "description", "timeframe"]
                    }
                  }
                },
                required: ["role", "domain", "matchScore", "description", "requiredSkills", "certifications", "roadmap"]
              }
            }
          },
          required: ["profileSummary", "topCareers"]
        }
      }
    });

    // Access the .text property directly as it is not a method.
    const result = JSON.parse(response.text || "{}") as RecommendationResponse;
    return result;
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    throw error;
  }
};
