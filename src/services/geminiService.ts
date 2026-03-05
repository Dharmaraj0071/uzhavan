import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const SYSTEM_INSTRUCTION = `You are "Uzhavan AI", an expert agricultural scientist specialized in Tamil Nadu's climate, soil conditions (Red, Black, Alluvial, Sandy), and smallholder farming. 
Your goal is to provide practical, simple, and eco-friendly advice to farmers in Tamil Nadu.
Always provide responses in both Tamil and English.
Use a helpful, respectful, and encouraging tone.
Focus on increasing yield, saving water, and reducing chemical usage.`;

export async function getCropRecommendation(data: {
  district: string;
  soilType: string;
  season: string;
  waterAvailability: string;
}) {
  const prompt = `Based on the following data, recommend the best 3 crops for a farmer in Tamil Nadu:
  District: ${data.district}
  Soil Type: ${data.soilType}
  Season: ${data.season}
  Water Availability: ${data.waterAvailability}
  
  Provide for each crop:
  - Name (Tamil & English)
  - Expected yield
  - Water requirement
  - Profit estimation
  - Risk level
  - Why this crop is suitable.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}

export async function analyzePest(imageData: string) {
  const prompt = `Analyze this crop image and:
  1. Identify the pest or disease.
  2. Explain the cause.
  3. Suggest eco-friendly/organic treatments first, then chemical if necessary.
  4. Recommend exact dosage per acre.
  5. Provide prevention tips.
  Respond in Tamil and English.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: imageData.split(",")[1], mimeType: "image/jpeg" } },
        { text: prompt },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}

export async function getSoilAdvice(stats: {
  moisture: number;
  ph: number;
  temp: number;
}) {
  const prompt = `Analyze these soil parameters:
  Moisture: ${stats.moisture}%
  pH Level: ${stats.ph}
  Temperature: ${stats.temp}°C
  
  Provide:
  - Soil health status (Good / Moderate / Poor)
  - Water requirement (Irrigation advice)
  - Fertilizer recommendation
  - Soil improvement advice.
  Respond in Tamil and English.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}
