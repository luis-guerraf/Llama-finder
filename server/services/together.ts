import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Defining the schema for search terms
const searchTermSchema = z.object({
  keyword: z.array(z.string()).describe("Search terms"),
});

// Defining the schema for feature extraction
const featureExtractionSchema = z.object({
  summary: z.string().describe("A brief summary of the model's key features"),
});

const searchJsonSchema = zodToJsonSchema(searchTermSchema, "searchTermSchema");
const featureJsonSchema = zodToJsonSchema(
  featureExtractionSchema,
  "featureExtractionSchema",
);

export async function generateSearchTerms(query: string): Promise<string[]> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `In a single word, what is the field of application of this query: "${query}". Provide 3 options.`,
        max_tokens: 100,
        temperature: 0.7,
        response_format: {
          type: "json_object",
          schema: searchJsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    const res = JSON.parse(response.data.choices[0].text);
    return Array.isArray(res["keyword"]) ? res["keyword"] : [];
  } catch (error) {
    console.error("Together AI error:", error);
    return [query];
  }
}

export async function summarizeModelFeatures(description: string): Promise<{
  summary: string;
}> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `Parse the following HTML page of an AI model description. Analyze how the described AI model compares to similar models. Output only a short one-sentence summary of this model's key features.

HTML page: "${description}"`,
        max_tokens: 1000,
        temperature: 0.9,
        response_format: {
          type: "json_object",
          schema: featureJsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    console.log("Summary:", response.data.choices[0].text);
    const result = JSON.parse(response.data.choices[0].text);
    return {
      summary: result['summary'] || "No summary available",
    };
  } catch (error) {
    console.error("Together AI feature summarization error:", error);
    return {
      summary: "Failed to analyze features",
    };
  }
}
