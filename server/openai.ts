import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeDream(dream: string): Promise<{
  interpretation: string;
  sentiment: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a dream interpretation expert. Analyze the dream and provide an interpretation along with a sentiment score from 1-5 where 1 is very negative and 5 is very positive. Format the response as JSON with 'interpretation' and 'sentiment' fields.",
        },
        {
          role: "user",
          content: dream,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      interpretation: result.interpretation,
      sentiment: Math.max(1, Math.min(5, Math.round(result.sentiment))),
    };
  } catch (error) {
    throw new Error("Failed to analyze dream: " + error.message);
  }
}

export async function analyzeSleepPattern(
  sleepData: Array<{ date: Date; hoursSlept: number; quality: number }>,
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sleep analysis expert. Analyze the sleep pattern data and provide insights about sleep quality, patterns, and recommendations for improvement.",
        },
        {
          role: "user",
          content: JSON.stringify(sleepData),
        },
      ],
    });

    return response.choices[0].message.content || "No analysis available";
  } catch (error) {
    throw new Error("Failed to analyze sleep pattern: " + error.message);
  }
}
